import { mount } from "@vue/test-utils";
import BudgetCheckbox from "../src/components/BudgetCheckbox/BudgetCheckbox.vue";

describe("BudgetCheckbox", () => {
  it("updates modelValue on change", async () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: false, label: "Activer" }
    });

    const input = wrapper.find("input");
    await input.setValue(true);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
  });

  it("shows error message", () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: false, error: true, errorMessage: "Invalide" }
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(wrapper.text()).toContain("Invalide");
  });

  it("uses default error message", () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: false, error: true }
    });

    expect(wrapper.text()).toContain("Valeur invalide");
  });
});
