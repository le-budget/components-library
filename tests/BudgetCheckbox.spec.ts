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
    expect(input.attributes("aria-describedby")).toBeUndefined();
    expect(wrapper.findAll("label span")).toHaveLength(1);
  });

  it("shows checked styles and icon when modelValue is true", () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: true, label: "Ok", color: "primary" }
    });

    const box = wrapper.find("label span");
    expect(box.classes()).toContain("bg-c-blue");
    expect(box.classes()).toContain("border-c-blue-dark");
    const icon = wrapper.find("svg");
    expect(icon.exists()).toBe(true);
    expect(icon.element.style.display).toBe("");
  });

  it("applies color and disabled styles together", () => {
    const wrapper = mount(BudgetCheckbox, {
      props: { modelValue: false, color: "error", disabled: true }
    });

    const input = wrapper.find("input");
    expect(input.attributes("disabled")).toBeDefined();

    const box = wrapper.find("label span");
    expect(box.classes()).toContain("border-c-red-dark");
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

  it("applies color variants for checked and unchecked states", () => {
    const cases = [
      {
        color: "success",
        checked: ["bg-c-green", "border-c-green-dark"],
        unchecked: ["bg-white", "text-c-green-dark"]
      },
      {
        color: "warning",
        checked: ["bg-c-orange", "border-c-orange-dark"],
        unchecked: ["bg-white", "text-c-orange-dark"]
      },
      {
        color: "error",
        checked: ["bg-c-red", "border-c-red-dark"],
        unchecked: ["bg-white", "text-c-red-dark"]
      }
    ] as const;

    for (const { color, checked, unchecked } of cases) {
      const checkedWrapper = mount(BudgetCheckbox, {
        props: { modelValue: true, color }
      });
      const checkedBox = checkedWrapper.find("label span");
      checked.forEach((className) => {
        expect(checkedBox.classes()).toContain(className);
      });

      const uncheckedWrapper = mount(BudgetCheckbox, {
        props: { modelValue: false, color }
      });
      const uncheckedBox = uncheckedWrapper.find("label span");
      unchecked.forEach((className) => {
        expect(uncheckedBox.classes()).toContain(className);
      });
    }
  });
});
