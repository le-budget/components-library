import { defineComponent, ref } from "vue";
import { mount } from "@vue/test-utils";
import {
  buildPiePalette,
  resolveVariantHex,
  useChartColorResolver,
  type BudgetChartColor
} from "../src/components/BudgetCharts/chartColors";

describe("chartColors", () => {
  it("resolves static variant hex values", () => {
    expect(resolveVariantHex("primary")).toBe("#196FAB");
    expect(resolveVariantHex("error")).toBe("#D14B59");
  });

  it("builds pie palette starting from base variant and cycles", () => {
    expect(buildPiePalette("warning", 7)).toEqual([
      "#DE964F",
      "#196FAB",
      "#27988F",
      "#D14B59",
      "#64748B",
      "#DE964F",
      "#196FAB"
    ]);
  });

  it("resolves steps and alpha colors", () => {
    const TestHost = defineComponent({
      setup() {
        const color = ref<BudgetChartColor>({
          steps: [
            { min: -100, color: "error" },
            { min: 0, color: "warning" },
            { min: 50, color: "success" }
          ]
        });

        const resolver = useChartColorResolver(color, "TestChart");

        return {
          color,
          resolver
        };
      },
      template: "<div />"
    });

    const wrapper = mount(TestHost);

    expect(wrapper.vm.resolver.resolveVariant(-10)).toBe("error");
    expect(wrapper.vm.resolver.resolveVariant(10)).toBe("warning");
    expect(wrapper.vm.resolver.resolveVariant(60)).toBe("success");
    expect(wrapper.vm.resolver.resolveHexWithAlpha(60, 0.2)).toBe("rgba(39, 152, 143, 0.2)");
  });

  it("warns on duplicate min steps", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const TestHost = defineComponent({
      setup() {
        const color = ref<BudgetChartColor>({
          steps: [
            { min: 0, color: "warning" },
            { min: 0, color: "success" }
          ]
        });

        useChartColorResolver(color, "TestChart");
        return {};
      },
      template: "<div />"
    });

    mount(TestHost);

    expect(warnSpy).toHaveBeenCalledWith(
      "[TestChart] Duplicate color steps detected. The last declared step for a given min value will be used."
    );

    warnSpy.mockRestore();
  });

  it("warns once and falls back to neutral when no step matches", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const TestHost = defineComponent({
      setup() {
        const color = ref<BudgetChartColor>({
          steps: [{ min: 10, color: "success" }]
        });

        const resolver = useChartColorResolver(color, "TestChart");

        return {
          resolver,
          color
        };
      },
      template: "<div />"
    });

    const wrapper = mount(TestHost);

    expect(wrapper.vm.resolver.resolveVariant(5)).toBe("neutral");
    expect(wrapper.vm.resolver.resolveVariant(4)).toBe("neutral");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      "[TestChart] No color step matched the current value. Falling back to 'neutral'."
    );

    warnSpy.mockRestore();
  });

  it("resets no-match warning when color config changes", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const TestHost = defineComponent({
      setup() {
        const color = ref<BudgetChartColor>({
          steps: [{ min: 10, color: "success" }]
        });

        const resolver = useChartColorResolver(color, "TestChart");

        return {
          color,
          resolver
        };
      },
      template: "<div />"
    });

    const wrapper = mount(TestHost);

    wrapper.vm.resolver.resolveVariant(3);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    wrapper.vm.color = {
      steps: [{ min: 20, color: "warning" }]
    };
    await wrapper.vm.$nextTick();

    wrapper.vm.resolver.resolveVariant(3);
    expect(warnSpy).toHaveBeenCalledTimes(2);

    warnSpy.mockRestore();
  });

  it("returns static variant without step logic", () => {
    const TestHost = defineComponent({
      setup() {
        const color = ref<BudgetChartColor>("primary");
        const resolver = useChartColorResolver(color, "TestChart");

        return {
          resolver
        };
      },
      template: "<div />"
    });

    const wrapper = mount(TestHost);

    expect(wrapper.vm.resolver.resolveVariant(-999)).toBe("primary");
    expect(wrapper.vm.resolver.resolveHex(-999)).toBe("#196FAB");
  });
});

