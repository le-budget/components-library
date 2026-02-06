import { mount } from "@vue/test-utils";
import BudgetButton from "../src/components/BudgetButton/BudgetButton.vue";

describe("BudgetButton", () => {
  it("renders content", () => {
    const wrapper = mount(BudgetButton, {
      slots: { default: "Valider" }
    });

    expect(wrapper.text()).toContain("Valider");
  });

  it("handles loading and disabled state", () => {
    const wrapper = mount(BudgetButton, {
      props: { loading: true },
      slots: { default: "Chargement" }
    });

    expect(wrapper.attributes("aria-busy")).toBe("true");
    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("applies size and error styles", () => {
    const small = mount(BudgetButton, {
      props: { size: "sm", error: true },
      slots: { default: "Petit" }
    });
    expect(small.classes()).toContain("h-8");
    expect(small.classes()).toContain("bg-red-600");

    const large = mount(BudgetButton, {
      props: { size: "lg" },
      slots: { default: "Grand" }
    });
    expect(large.classes()).toContain("h-12");
  });
});
