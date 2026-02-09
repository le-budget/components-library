import { mount } from "@vue/test-utils";
import BudgetDivider from "../src/components/BudgetDivider/BudgetDivider.vue";

describe("BudgetDivider", () => {
  it("renders horizontal primary solid divider by default", () => {
    const wrapper = mount(BudgetDivider);

    expect(wrapper.attributes("role")).toBe("separator");
    expect(wrapper.attributes("aria-orientation")).toBe("horizontal");
    expect(wrapper.classes()).toContain("w-full");
    expect(wrapper.classes()).toContain("border-t-2");
    expect(wrapper.classes()).toContain("border-c-blue-dark");
    expect(wrapper.classes()).toContain("border-solid");
  });

  it("supports vertical orientation stretched in parent", () => {
    const wrapper = mount(BudgetDivider, {
      props: {
        orientation: "vertical"
      }
    });

    expect(wrapper.attributes("aria-orientation")).toBe("vertical");
    expect(wrapper.classes()).toContain("h-full");
    expect(wrapper.classes()).toContain("self-stretch");
    expect(wrapper.classes()).toContain("border-l-2");
  });

  it("supports all color variants from BudgetRadio", () => {
    const neutral = mount(BudgetDivider, { props: { color: "neutral" } });
    expect(neutral.classes()).toContain("border-slate-500");

    const success = mount(BudgetDivider, { props: { color: "success" } });
    expect(success.classes()).toContain("border-c-green-dark");

    const warning = mount(BudgetDivider, { props: { color: "warning" } });
    expect(warning.classes()).toContain("border-c-orange-dark");

    const error = mount(BudgetDivider, { props: { color: "error" } });
    expect(error.classes()).toContain("border-c-red-dark");
  });

  it("supports dashed and dotted line styles", () => {
    const dashed = mount(BudgetDivider, {
      props: {
        lineStyle: "dashed"
      }
    });
    expect(dashed.classes()).toContain("border-dashed");

    const dotted = mount(BudgetDivider, {
      props: {
        lineStyle: "dotted"
      }
    });
    expect(dotted.classes()).toContain("border-dotted");
  });

  it("supports thickness variants", () => {
    const horizontalSm = mount(BudgetDivider, {
      props: { thickness: "sm" }
    });
    expect(horizontalSm.classes()).toContain("border-t");

    const horizontalLg = mount(BudgetDivider, {
      props: { thickness: "lg" }
    });
    expect(horizontalLg.classes()).toContain("border-t-4");

    const verticalSm = mount(BudgetDivider, {
      props: { orientation: "vertical", thickness: "sm" }
    });
    expect(verticalSm.classes()).toContain("border-l");

    const verticalLg = mount(BudgetDivider, {
      props: { orientation: "vertical", thickness: "lg" }
    });
    expect(verticalLg.classes()).toContain("border-l-4");
  });
});
