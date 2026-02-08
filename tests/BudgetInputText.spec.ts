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

  it("handles prefix slot only", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "" },
      slots: {
        prefix: "<span>p</span>"
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("pl-9");
    expect(input.classes()).not.toContain("pr-9");
  });

  it("handles suffix slot only", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "" },
      slots: {
        suffix: "<span>s</span>"
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).not.toContain("pl-9");
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

  it("applies success styles", () => {
    const wrapper = mount(BudgetInputText, {
      props: {
        modelValue: "",
        success: true
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("border-c-green");
  });

  it("error overrides success", () => {
    const wrapper = mount(BudgetInputText, {
      props: {
        modelValue: "",
        error: true,
        success: true
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("border-c-red");
    expect(input.classes()).not.toContain("border-c-green");
  });

  it("passes autocomplete to the input", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "", autocomplete: "email" }
    });

    const input = wrapper.find("input");
    expect(input.attributes("autocomplete")).toBe("email");
  });

  it("defaults autocomplete to off", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "" }
    });

    const input = wrapper.find("input");
    expect(input.attributes("autocomplete")).toBe("off");
  });

  it("applies compact size classes", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "", size: "sm" },
      slots: {
        prefix: "<span>p</span>",
        suffix: "<span>s</span>"
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("py-1.5");
    expect(input.classes()).toContain("text-sm");
    expect(input.classes()).toContain("pl-8");
    expect(input.classes()).toContain("pr-8");
  });

  it("applies large size classes", () => {
    const wrapper = mount(BudgetInputText, {
      props: { modelValue: "", size: "lg" },
      slots: {
        prefix: "<span>p</span>",
        suffix: "<span>s</span>"
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("py-2.5");
    expect(input.classes()).toContain("pl-10");
    expect(input.classes()).toContain("pr-10");
  });
});
