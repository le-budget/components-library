import { mount } from "@vue/test-utils";
import BudgetToolbar from "../src/components/BudgetToolbar/BudgetToolbar.vue";

describe("BudgetToolbar", () => {
  it("renders default toolbar attributes and classes", () => {
    const wrapper = mount(BudgetToolbar, {
      props: { label: "Actions" },
      slots: { default: "<span>Item</span>" }
    });

    expect(wrapper.attributes("role")).toBe("toolbar");
    expect(wrapper.attributes("aria-label")).toBe("Actions");
    expect(wrapper.attributes("aria-orientation")).toBe("horizontal");
    expect(wrapper.classes()).toContain("flex-row");
    expect(wrapper.classes()).toContain("justify-start");
    expect(wrapper.classes()).toContain("flex-nowrap");
    expect(wrapper.classes()).toContain("gap-1.5");
  });

  it("applies vertical orientation and size classes", () => {
    const wrapper = mount(BudgetToolbar, {
      props: {
        orientation: "vertical",
        size: "lg"
      },
      slots: { default: "<span>Item</span>" }
    });

    expect(wrapper.attributes("aria-orientation")).toBe("vertical");
    expect(wrapper.classes()).toContain("flex-col");
    expect(wrapper.classes()).toContain("items-stretch");
    expect(wrapper.classes()).toContain("gap-2");
    expect(wrapper.classes()).toContain("p-2");
  });

  it("applies wrap only in horizontal mode and disabled style", () => {
    const horizontal = mount(BudgetToolbar, {
      props: {
        wrap: true,
        size: "sm",
        disabled: true
      },
      slots: { default: "<span>Item</span>" }
    });

    expect(horizontal.classes()).toContain("flex-wrap");
    expect(horizontal.classes()).toContain("opacity-60");
    expect(horizontal.classes()).toContain("gap-1");

    const vertical = mount(BudgetToolbar, {
      props: {
        orientation: "vertical",
        wrap: true
      },
      slots: { default: "<span>Item</span>" }
    });
    expect(vertical.classes()).toContain("flex-nowrap");
  });

  it("supports right alignment in horizontal mode", () => {
    const rightAligned = mount(BudgetToolbar, {
      props: {
        align: "right"
      },
      slots: { default: "<span>Item</span>" }
    });

    expect(rightAligned.classes()).toContain("justify-end");
    expect(rightAligned.classes()).toContain("w-full");
    expect(rightAligned.classes()).not.toContain("justify-start");

    const verticalRight = mount(BudgetToolbar, {
      props: {
        orientation: "vertical",
        align: "right"
      },
      slots: { default: "<span>Item</span>" }
    });
    expect(verticalRight.classes()).not.toContain("justify-end");
  });
});
