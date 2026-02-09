import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BudgetRadialProgress from "../src/components/BudgetRadialProgress/BudgetRadialProgress.vue";

function getProgressCircle(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll("circle")[1];
}

describe("BudgetRadialProgress", () => {
  it("renders with default props and accessibility attributes", () => {
    const wrapper = mount(BudgetRadialProgress, {
      props: { value: 65 }
    });

    expect(wrapper.attributes("role")).toBe("progressbar");
    expect(wrapper.attributes("aria-valuemin")).toBe("0");
    expect(wrapper.attributes("aria-valuemax")).toBe("100");
    expect(wrapper.attributes("aria-valuenow")).toBe("65");
    expect(wrapper.attributes("style")).toContain("width: 24px");
    expect(wrapper.attributes("style")).toContain("height: 24px");
    expect(wrapper.text()).toBe("");
  });

  it("supports all size variants and only shows label for xl and xxl", () => {
    const sizes = [
      { size: "sm", px: 16, hasLabel: false },
      { size: "md", px: 24, hasLabel: false },
      { size: "lg", px: 32, hasLabel: false },
      { size: "xl", px: 64, hasLabel: true },
      { size: "xxl", px: 92, hasLabel: true }
    ] as const;

    for (const variant of sizes) {
      const wrapper = mount(BudgetRadialProgress, {
        props: { value: 50, size: variant.size }
      });

      expect(wrapper.attributes("style")).toContain(`width: ${variant.px}px`);
      expect(wrapper.attributes("style")).toContain(`height: ${variant.px}px`);

      if (variant.hasLabel) {
        expect(wrapper.text()).toBe("50%");
      } else {
        expect(wrapper.text()).toBe("");
      }
    }
  });

  it("applies all color variants from BudgetDivider mapping", () => {
    const neutral = mount(BudgetRadialProgress, {
      props: { value: 10, color: "neutral" }
    });
    expect(getProgressCircle(neutral).classes()).toContain("text-slate-500");

    const success = mount(BudgetRadialProgress, {
      props: { value: 10, color: "success" }
    });
    expect(getProgressCircle(success).classes()).toContain("text-c-green-dark");

    const warning = mount(BudgetRadialProgress, {
      props: { value: 10, color: "warning" }
    });
    expect(getProgressCircle(warning).classes()).toContain("text-c-orange-dark");

    const error = mount(BudgetRadialProgress, {
      props: { value: 10, color: "error" }
    });
    expect(getProgressCircle(error).classes()).toContain("text-c-red-dark");

    const primary = mount(BudgetRadialProgress, {
      props: { value: 10, color: "primary" }
    });
    expect(getProgressCircle(primary).classes()).toContain("text-c-blue-dark");
  });

  it("supports step-based color configuration", async () => {
    const wrapper = mount(BudgetRadialProgress, {
      props: {
        value: 15,
        animated: false,
        color: {
          steps: [
            { min: 0, color: "error" },
            { min: 30, color: "warning" },
            { min: 60, color: "success" }
          ]
        }
      }
    });

    expect(getProgressCircle(wrapper).classes()).toContain("text-c-red-dark");

    await wrapper.setProps({ value: 45 });
    expect(getProgressCircle(wrapper).classes()).toContain("text-c-orange-dark");

    await wrapper.setProps({ value: 90 });
    expect(getProgressCircle(wrapper).classes()).toContain("text-c-green-dark");
  });

  it("falls back to neutral and warns once when no step matches", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const wrapper = mount(BudgetRadialProgress, {
      props: {
        value: 10,
        animated: false,
        color: {
          steps: [
            { min: 30, color: "warning" },
            { min: 60, color: "success" }
          ]
        }
      }
    });

    expect(getProgressCircle(wrapper).classes()).toContain("text-slate-500");
    expect(warnSpy).toHaveBeenCalledWith(
      "[BudgetRadialProgress] No color step matched the current value. Falling back to 'neutral'."
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ value: 5 });
    expect(getProgressCircle(wrapper).classes()).toContain("text-slate-500");
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });

  it("warns on duplicate step min and keeps last declared step", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const wrapper = mount(BudgetRadialProgress, {
      props: {
        value: 40,
        animated: false,
        color: {
          steps: [
            { min: 0, color: "error" },
            { min: 30, color: "warning" },
            { min: 30, color: "success" }
          ]
        }
      }
    });

    expect(getProgressCircle(wrapper).classes()).toContain("text-c-green-dark");
    expect(warnSpy).toHaveBeenCalledWith(
      "[BudgetRadialProgress] Duplicate color steps detected. The last declared step for a given min value will be used."
    );

    warnSpy.mockRestore();
  });

  it("clamps value below 0 and above 100", () => {
    const low = mount(BudgetRadialProgress, {
      props: { value: -25, size: "xl" }
    });
    expect(low.attributes("aria-valuenow")).toBe("0");
    expect(low.text()).toBe("0%");
    expect(parseFloat(getProgressCircle(low).attributes("stroke-dashoffset"))).toBeGreaterThan(0);

    const high = mount(BudgetRadialProgress, {
      props: { value: 140, size: "xl" }
    });
    expect(high.attributes("aria-valuenow")).toBe("100");
    expect(high.text()).toBe("100%");
    expect(parseFloat(getProgressCircle(high).attributes("stroke-dashoffset"))).toBe(0);
  });

  it("supports custom strokeWidth and keeps ratio default when omitted", () => {
    const withDefaultStroke = mount(BudgetRadialProgress, {
      props: { value: 30, size: "md" }
    });
    const defaultTrack = withDefaultStroke.findAll("circle")[0];
    const defaultStroke = Number(defaultTrack.attributes("stroke-width"));
    expect(defaultStroke).toBeCloseTo(12.5);

    const withCustomStroke = mount(BudgetRadialProgress, {
      props: { value: 30, size: "md", strokeWidth: 6 }
    });
    const customTrack = withCustomStroke.findAll("circle")[0];
    const customStroke = Number(customTrack.attributes("stroke-width"));
    expect(customStroke).toBeCloseTo(25);
  });

  it("clamps invalid strokeWidth values", () => {
    const low = mount(BudgetRadialProgress, {
      props: { value: 50, size: "sm", strokeWidth: 0 }
    });
    expect(Number(low.findAll("circle")[0].attributes("stroke-width"))).toBeCloseTo(6.25);

    const high = mount(BudgetRadialProgress, {
      props: { value: 50, size: "sm", strokeWidth: 99 }
    });
    expect(Number(high.findAll("circle")[0].attributes("stroke-width"))).toBeCloseTo(43.75);
  });

  it("animates progress when value changes", async () => {
    vi.useFakeTimers();

    const originalRaf = window.requestAnimationFrame;
    const originalCancelRaf = window.cancelAnimationFrame;

    window.requestAnimationFrame = (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(Date.now()), 16);
    window.cancelAnimationFrame = (handle: number) => {
      window.clearTimeout(handle);
    };

    try {
      const wrapper = mount(BudgetRadialProgress, {
        props: { value: 0, size: "xl", animationDuration: 320 }
      });

      const before = parseFloat(getProgressCircle(wrapper).attributes("stroke-dashoffset"));
      await wrapper.setProps({ value: 100 });
      const pending = parseFloat(getProgressCircle(wrapper).attributes("stroke-dashoffset"));
      expect(pending).toBe(before);

      vi.advanceTimersByTime(400);
      await nextTick();

      const after = parseFloat(getProgressCircle(wrapper).attributes("stroke-dashoffset"));
      expect(after).toBeCloseTo(0, 3);
      expect(wrapper.text()).toBe("100%");

      wrapper.unmount();
    } finally {
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCancelRaf;
      vi.useRealTimers();
    }
  });

  it("supports disabling animation", async () => {
    const wrapper = mount(BudgetRadialProgress, {
      props: { value: 10, size: "xl", animated: false }
    });

    await wrapper.setProps({ value: 90 });

    expect(wrapper.text()).toBe("90%");
    expect(wrapper.attributes("aria-valuenow")).toBe("90");
  });

  it("updates immediately when animationDuration is 0", async () => {
    const wrapper = mount(BudgetRadialProgress, {
      props: { value: 10, size: "xl", animationDuration: 0 }
    });

    await wrapper.setProps({ value: 75 });

    expect(wrapper.text()).toBe("75%");
    expect(wrapper.attributes("aria-valuenow")).toBe("75");
  });

  it("cancels previous animation frame when value changes quickly", async () => {
    vi.useFakeTimers();

    const originalRaf = window.requestAnimationFrame;
    const originalCancelRaf = window.cancelAnimationFrame;
    const cancelSpy = vi.fn<(handle: number) => void>();

    window.requestAnimationFrame = (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(Date.now()), 16);
    window.cancelAnimationFrame = (handle: number) => {
      cancelSpy(handle);
      window.clearTimeout(handle);
    };

    try {
      const wrapper = mount(BudgetRadialProgress, {
        props: { value: 0, size: "xl", animationDuration: 1000 }
      });

      await wrapper.setProps({ value: 80 });
      await wrapper.setProps({ value: 40 });

      expect(cancelSpy).toHaveBeenCalledTimes(1);
    } finally {
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCancelRaf;
      vi.useRealTimers();
    }
  });
});
