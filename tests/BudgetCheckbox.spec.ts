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

  it("applies size variants with md as default", () => {
    const small = mount(BudgetCheckbox, {
      props: { modelValue: true, size: "sm" }
    });
    const smallBox = small.find("label span");
    const smallIcon = small.find("svg");
    expect(smallBox.classes()).toContain("h-4");
    expect(smallBox.classes()).toContain("w-4");
    expect(smallIcon.classes()).toContain("h-2.5");
    expect(smallIcon.classes()).toContain("w-2.5");

    const medium = mount(BudgetCheckbox, {
      props: { modelValue: true }
    });
    const mediumBox = medium.find("label span");
    const mediumIcon = medium.find("svg");
    expect(mediumBox.classes()).toContain("h-5");
    expect(mediumBox.classes()).toContain("w-5");
    expect(mediumIcon.classes()).toContain("h-3");
    expect(mediumIcon.classes()).toContain("w-3");

    const large = mount(BudgetCheckbox, {
      props: { modelValue: true, size: "lg" }
    });
    const largeBox = large.find("label span");
    const largeIcon = large.find("svg");
    expect(largeBox.classes()).toContain("h-6");
    expect(largeBox.classes()).toContain("w-6");
    expect(largeIcon.classes()).toContain("h-3.5");
    expect(largeIcon.classes()).toContain("w-3.5");
  });
});
