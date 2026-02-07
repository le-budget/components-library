import { mount } from "@vue/test-utils";
import BudgetDropdownOption from "../src/components/BudgetDropdownOption/BudgetDropdownOption.vue";

describe("BudgetDropdownOption", () => {
  it("renders slot content", () => {
    const wrapper = mount(BudgetDropdownOption, {
      props: { label: "Salaire", value: "salary" },
      slots: { default: "<span>Option</span>" }
    });

    expect(wrapper.text()).toContain("Option");
  });

  it("renders right slot content", () => {
    const wrapper = mount(BudgetDropdownOption, {
      props: { label: "Salaire", value: "salary" },
      slots: { right: "<span>1 000,00 €</span>" }
    });

    expect(wrapper.text()).toContain("1 000,00 €");
  });
});
