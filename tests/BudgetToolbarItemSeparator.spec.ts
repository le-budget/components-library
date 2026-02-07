import { mount } from "@vue/test-utils";
import BudgetToolbar from "../src/components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItemSeparator from "../src/components/BudgetToolbarItemSeparator/BudgetToolbarItemSeparator.vue";

describe("BudgetToolbarItemSeparator", () => {
  it("uses vertical orientation by default without toolbar", () => {
    const wrapper = mount(BudgetToolbarItemSeparator);

    expect(wrapper.attributes("aria-orientation")).toBe("vertical");
    expect(wrapper.classes()).toContain("w-px");
    expect(wrapper.classes()).toContain("mx-1");
  });

  it("derives horizontal orientation from vertical toolbar", () => {
    const wrapper = mount(BudgetToolbar, {
      props: { orientation: "vertical" },
      slots: {
        default: "<BudgetToolbarItemSeparator />"
      },
      global: {
        components: { BudgetToolbarItemSeparator }
      }
    });

    const separator = wrapper.findComponent(BudgetToolbarItemSeparator);
    expect(separator.attributes("aria-orientation")).toBe("horizontal");
    expect(separator.classes()).toContain("h-px");
    expect(separator.classes()).toContain("w-full");
    expect(separator.classes()).toContain("my-1");
  });

  it("supports explicit horizontal orientation with sm and lg sizes", () => {
    const small = mount(BudgetToolbar, {
      props: { size: "sm" },
      slots: {
        default: "<BudgetToolbarItemSeparator orientation=\"horizontal\" />"
      },
      global: {
        components: { BudgetToolbarItemSeparator }
      }
    });
    const smallSeparator = small.findComponent(BudgetToolbarItemSeparator);
    expect(smallSeparator.attributes("aria-orientation")).toBe("horizontal");
    expect(smallSeparator.classes()).toContain("my-0.5");

    const large = mount(BudgetToolbar, {
      props: { size: "lg" },
      slots: {
        default: "<BudgetToolbarItemSeparator orientation=\"horizontal\" />"
      },
      global: {
        components: { BudgetToolbarItemSeparator }
      }
    });
    const largeSeparator = large.findComponent(BudgetToolbarItemSeparator);
    expect(largeSeparator.classes()).toContain("my-1.5");
  });

  it("supports explicit vertical orientation with sm and lg sizes", () => {
    const small = mount(BudgetToolbar, {
      props: { size: "sm", orientation: "vertical" },
      slots: {
        default: "<BudgetToolbarItemSeparator orientation=\"vertical\" />"
      },
      global: {
        components: { BudgetToolbarItemSeparator }
      }
    });
    const smallSeparator = small.findComponent(BudgetToolbarItemSeparator);
    expect(smallSeparator.attributes("aria-orientation")).toBe("vertical");
    expect(smallSeparator.classes()).toContain("mx-0.5");

    const large = mount(BudgetToolbar, {
      props: { size: "lg", orientation: "vertical" },
      slots: {
        default: "<BudgetToolbarItemSeparator orientation=\"vertical\" />"
      },
      global: {
        components: { BudgetToolbarItemSeparator }
      }
    });
    const largeSeparator = large.findComponent(BudgetToolbarItemSeparator);
    expect(largeSeparator.classes()).toContain("mx-1.5");
  });
});
