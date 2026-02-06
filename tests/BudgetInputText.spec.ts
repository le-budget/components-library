import { mount } from "@vue/test-utils";
import BudgetInputText from "../src/components/BudgetInputText/BudgetInputText.vue";

describe("BudgetInputText", () => {
  it("emits updates and shows error", async () => {
    const wrapper = mount(BudgetInputText, {
      props: {
        modelValue: "",
        label: "Nom",
        error: true,
        errorMessage: "Invalide"
      }
    });

    const input = wrapper.find("input");
    expect(wrapper.text()).toContain("Nom");
    expect(input.attributes("aria-invalid")).toBe("true");
    const errorId = input.attributes("aria-describedby");
    expect(errorId).toBeDefined();
    expect(wrapper.find(`#${errorId}`).text()).toContain("Invalide");

    await input.setValue("Alex");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Alex"]);
  });

  it("handles prefix and suffix slots", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "" },
      slots: {
        prefix: "<span>p</span>",
        suffix: "<span>s</span>"
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("pl-9");
    expect(input.classes()).toContain("pr-9");
  });

  it("renders without slots", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "" }
    });
    const input = wrapper.find("input");
    expect(input.classes()).not.toContain("pl-9");
  });

  it("uses default error message", () => {
    const wrapper = mount(BudgetInputText, {
      props: {
        modelValue: "",
        error: true
      }
    });

    expect(wrapper.text()).toContain("Valeur invalide");
  });
});
