import { mount } from "@vue/test-utils";
import BudgetDropdownGroup from "../src/components/BudgetDropdownGroup/BudgetDropdownGroup.vue";

describe("BudgetDropdownGroup", () => {
  it("renders slot content", () => {
    const wrapper = mount(BudgetDropdownGroup, {
      props: { label: "Revenus" },
      slots: { default: "<span>Item</span>" }
    });

    expect(wrapper.text()).toContain("Item");
  });
});
