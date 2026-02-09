import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BudgetProgressBar from "../src/components/BudgetProgressBar/BudgetProgressBar.vue";

function getTrack(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[role="progressbar"]');
}

function getFill(wrapper: ReturnType<typeof mount>) {
  return getTrack(wrapper).find("div");
}

describe("BudgetProgressBar", () => {
  it("renders with default props and accessibility attributes", () => {
    const wrapper = mount(BudgetProgressBar, {
      props: { value: 65 }
    });

    expect(getTrack(wrapper).attributes("aria-valuemin")).toBe("0");
    expect(getTrack(wrapper).attributes("aria-valuemax")).toBe("100");
    expect(getTrack(wrapper).attributes("aria-valuenow")).toBe("65");
    expect(getTrack(wrapper).attributes("style")).toContain("height: 8px");
    expect(wrapper.text()).toBe("");
  });

  it("always takes full width of parent", () => {
    const wrapper = mount(BudgetProgressBar, {
      props: { value: 50 }
    });

    expect(wrapper.classes()).toContain("w-full");
    expect(getTrack(wrapper).classes()).toContain("w-full");
  });

  it("clamps value below 0 and above 100", () => {
    const low = mount(BudgetProgressBar, {
      props: { value: -20, animated: false, displayValue: true, displayValuePosition: "onBar" }
    });
    expect(getTrack(low).attributes("aria-valuenow")).toBe("0");
    expect(getFill(low).attributes("style")).toContain("width: 0%");
    expect(low.text()).toContain("0%");

    const high = mount(BudgetProgressBar, {
      props: { value: 150, animated: false, displayValue: true, displayValuePosition: "onBar" }
    });
    expect(getTrack(high).attributes("aria-valuenow")).toBe("100");
    expect(getFill(high).attributes("style")).toContain("width: 100%");
    expect(high.text()).toContain("100%");
  });

  it("supports custom thickness and clamps invalid values", async () => {
    const wrapper = mount(BudgetProgressBar, {
      props: { value: 40, animated: false, thickness: 12 }
    });
    expect(getTrack(wrapper).attributes("style")).toContain("height: 12px");

    await wrapper.setProps({ thickness: 1 });
    expect(getTrack(wrapper).attributes("style")).toContain("height: 2px");

    await wrapper.setProps({ thickness: 120 });
    expect(getTrack(wrapper).attributes("style")).toContain("height: 48px");
  });

  it("applies all color variants", () => {
    const neutral = mount(BudgetProgressBar, {
      props: { value: 10, animated: false, color: "neutral" }
    });
    expect(getFill(neutral).classes()).toContain("bg-slate-500");

    const success = mount(BudgetProgressBar, {
      props: { value: 10, animated: false, color: "success" }
    });
    expect(getFill(success).classes()).toContain("bg-c-green-dark");

    const warning = mount(BudgetProgressBar, {
      props: { value: 10, animated: false, color: "warning" }
    });
    expect(getFill(warning).classes()).toContain("bg-c-orange-dark");

    const error = mount(BudgetProgressBar, {
      props: { value: 10, animated: false, color: "error" }
    });
    expect(getFill(error).classes()).toContain("bg-c-red-dark");

    const primary = mount(BudgetProgressBar, {
      props: { value: 10, animated: false, color: "primary" }
    });
    expect(getFill(primary).classes()).toContain("bg-c-blue-dark");
  });

  it("supports step-based color configuration", async () => {
    const wrapper = mount(BudgetProgressBar, {
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

    expect(getFill(wrapper).classes()).toContain("bg-c-red-dark");

    await wrapper.setProps({ value: 45 });
    expect(getFill(wrapper).classes()).toContain("bg-c-orange-dark");

    await wrapper.setProps({ value: 90 });
    expect(getFill(wrapper).classes()).toContain("bg-c-green-dark");
  });

  it("falls back to neutral and warns once when no step matches", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const wrapper = mount(BudgetProgressBar, {
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

    expect(getFill(wrapper).classes()).toContain("bg-slate-500");
    expect(warnSpy).toHaveBeenCalledWith(
      "[BudgetProgressBar] No color step matched the current value. Falling back to 'neutral'."
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ value: 5 });
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });

  it("warns on duplicate step min and keeps last declared step", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const wrapper = mount(BudgetProgressBar, {
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

    expect(getFill(wrapper).classes()).toContain("bg-c-green-dark");
    expect(warnSpy).toHaveBeenCalledWith(
      "[BudgetProgressBar] Duplicate color steps detected. The last declared step for a given min value will be used."
    );

    warnSpy.mockRestore();
  });

  it("displays the value on the bar", () => {
    const wrapper = mount(BudgetProgressBar, {
      props: { value: 65, animated: false, displayValue: true, displayValuePosition: "onBar" }
    });

    const value = wrapper.find("span.absolute");
    expect(value.exists()).toBe(true);
    expect(value.text()).toBe("65%");
    expect(value.classes()).toContain("absolute");
  });

  it("supports top and bottom value positions with alignment variants", () => {
    const top = mount(BudgetProgressBar, {
      props: { value: 65, animated: false, displayValue: true, displayValuePosition: "top" }
    });
    const topLabel = top.find(".mb-1");
    expect(topLabel.exists()).toBe(true);
    expect(topLabel.classes()).toContain("justify-center");

    const topLeft = mount(BudgetProgressBar, {
      props: { value: 65, animated: false, displayValue: true, displayValuePosition: "topLeft" }
    });
    const topLeftLabel = topLeft.find(".mb-1");
    expect(topLeftLabel.exists()).toBe(true);
    expect(topLeftLabel.classes()).toContain("justify-start");

    const topRight = mount(BudgetProgressBar, {
      props: { value: 65, animated: false, displayValue: true, displayValuePosition: "topRight" }
    });
    const topRightLabel = topRight.find(".mb-1");
    expect(topRightLabel.exists()).toBe(true);
    expect(topRightLabel.classes()).toContain("justify-end");

    const bottom = mount(BudgetProgressBar, {
      props: { value: 65, animated: false, displayValue: true, displayValuePosition: "bottom" }
    });
    const bottomLabel = bottom.find(".mt-1");
    expect(bottomLabel.exists()).toBe(true);
    expect(bottomLabel.classes()).toContain("justify-center");

    const bottomLeft = mount(BudgetProgressBar, {
      props: {
        value: 65,
        animated: false,
        displayValue: true,
        displayValuePosition: "bottomLeft"
      }
    });
    const bottomLeftLabel = bottomLeft.find(".mt-1");
    expect(bottomLeftLabel.exists()).toBe(true);
    expect(bottomLeftLabel.classes()).toContain("justify-start");

    const bottomRight = mount(BudgetProgressBar, {
      props: {
        value: 65,
        animated: false,
        displayValue: true,
        displayValuePosition: "bottomRight"
      }
    });
    const bottomRightLabel = bottomRight.find(".mt-1");
    expect(bottomRightLabel.exists()).toBe(true);
    expect(bottomRightLabel.classes()).toContain("justify-end");
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
      const wrapper = mount(BudgetProgressBar, {
        props: { value: 0, animationDuration: 320, displayValue: true, displayValuePosition: "onBar" }
      });

      const before = getFill(wrapper).attributes("style");
      await wrapper.setProps({ value: 100 });
      const pending = getFill(wrapper).attributes("style");
      expect(pending).toBe(before);

      vi.advanceTimersByTime(400);
      await nextTick();

      const after = getFill(wrapper).attributes("style");
      expect(after).toContain("width: 100%");
      expect(wrapper.text()).toContain("100%");

      wrapper.unmount();
    } finally {
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCancelRaf;
      vi.useRealTimers();
    }
  });

  it("supports disabling animation", async () => {
    const wrapper = mount(BudgetProgressBar, {
      props: { value: 10, animated: false, displayValue: true, displayValuePosition: "onBar" }
    });

    await wrapper.setProps({ value: 90 });

    expect(getFill(wrapper).attributes("style")).toContain("width: 90%");
    expect(wrapper.text()).toContain("90%");
  });

  it("updates immediately when animationDuration is 0", async () => {
    const wrapper = mount(BudgetProgressBar, {
      props: { value: 10, animationDuration: 0, displayValue: true, displayValuePosition: "onBar" }
    });

    await wrapper.setProps({ value: 75 });

    expect(getFill(wrapper).attributes("style")).toContain("width: 75%");
    expect(wrapper.text()).toContain("75%");
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
      const wrapper = mount(BudgetProgressBar, {
        props: { value: 0, animationDuration: 1000 }
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
