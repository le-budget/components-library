import { mount } from "@vue/test-utils";
import BudgetTableGroup from "../src/components/BudgetTableGroup/BudgetTableGroup.vue";

describe("BudgetTableGroup", () => {
  it("renders slot content", () => {
    const wrapper = mount(BudgetTableGroup, {
      props: {
        title: "Groupe"
      },
      slots: {
        default: "<span>Ligne</span>"
      }
    });

    expect(wrapper.text()).toContain("Ligne");
  });
});
