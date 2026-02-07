import { mount } from "@vue/test-utils";
import BudgetToolbar from "../src/components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItem from "../src/components/BudgetToolbarItem/BudgetToolbarItem.vue";

describe("BudgetToolbarItem", () => {
  it("renders horizontal class without toolbar context", () => {
    const wrapper = mount(BudgetToolbarItem, {
      slots: { default: "Item" }
    });

    expect(wrapper.classes()).toContain("inline-flex");
    expect(wrapper.classes()).toContain("items-center");
    expect(wrapper.classes()).not.toContain("w-full");
  });

  it("inherits vertical full width behavior from toolbar", () => {
    const wrapper = mount(BudgetToolbar, {
      props: {
        orientation: "vertical"
      },
      slots: {
        default: `
          <BudgetToolbarItem>Item</BudgetToolbarItem>
        `
      },
      global: {
        components: { BudgetToolbarItem }
      }
    });

    const item = wrapper.findComponent(BudgetToolbarItem);
    expect(item.classes()).toContain("w-full");
  });
});
