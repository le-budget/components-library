import { mount } from "@vue/test-utils";
import BudgetBadge from "../src/components/BudgetBadge/BudgetBadge.vue";

describe("BudgetBadge", () => {
  it("renders text and custom color", () => {
    const wrapper = mount(BudgetBadge, {
      props: { text: "Actif", colorClass: "bg-slate-100 text-slate-700" }
    });

    expect(wrapper.text()).toBe("Actif");
    expect(wrapper.classes()).toContain("bg-slate-100");
  });
});
