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

  it("omits label and error message when not provided", () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: false }
    });

    const input = wrapper.find("input");
    expect(wrapper.find("p").exists()).toBe(false);
    expect(input.attributes("aria-invalid")).toBeUndefined();
    expect(input.attributes("aria-describedby")).toBeUndefined();
    expect(wrapper.findAll("label span")).toHaveLength(1);
  });

  it("shows checked styles and icon when modelValue is true", () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: true, label: "Ok" }
    });

    const box = wrapper.find("label span");
    expect(box.classes()).toContain("bg-slate-900");
    expect(box.classes()).toContain("border-slate-300");
    const icon = wrapper.find("svg");
    expect(icon.exists()).toBe(true);
    expect(icon.element.style.display).toBe("");
  });

  it("applies error and disabled styles together", () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: false, error: true, disabled: true }
    });

    const input = wrapper.find("input");
    expect(input.attributes("disabled")).toBeDefined();
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-describedby")).toBeDefined();

    const box = wrapper.find("label span");
    expect(box.classes()).toContain("border-red-500");
    expect(box.classes()).toContain("opacity-60");
  });

  it("removes the check icon when unchecked", async () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: true }
    });

    const icon = wrapper.find("svg");
    expect(icon.exists()).toBe(true);
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.find("svg").element.style.display).toBe("none");
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
