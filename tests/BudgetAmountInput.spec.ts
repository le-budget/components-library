import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import BudgetAmountInput from "../src/components/BudgetAmountInput/BudgetAmountInput.vue";

const NBSP = "\u00A0";

describe("BudgetAmountInput", () => {
  it("formats initial value", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 1000.5 }
    });

    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe(`1 000,50${NBSP}€`);
  });

  it("formats negative values", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: -12.3 }
    });

    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe(`-12,30${NBSP}€`);
  });

  it("emits updates on input", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = "2000";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([2000]);
    expect((input.element as HTMLInputElement).value).toBe(`2 000,00${NBSP}€`);
  });

  it("uses fallback cursor position when selectionStart is null", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    Object.defineProperty(input.element, "selectionStart", {
      value: null,
      configurable: true
    });
    input.element.value = "45";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([45]);
  });

  it("handles cursor at start", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = "123";
    input.element.setSelectionRange(0, 0);
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([123]);
  });

  it("accepts negative input", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = "-12,3";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([-12.3]);
  });

  it("formats input with leading comma", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = ",5";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([0.5]);
    expect((input.element as HTMLInputElement).value).toBe(`0,50${NBSP}€`);
  });

  it("handles allowEmpty", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: null, allowEmpty: true }
    });

    const input = wrapper.find("input");
    expect((input.element as HTMLInputElement).value).toBe("");

    input.element.value = "";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([null]);
  });

  it("defaults empty to zero when allowEmpty is false", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = "";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([0]);
    expect((input.element as HTMLInputElement).value).toBe(`0,00${NBSP}€`);
  });

  it("renders error message and aria attributes", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: {
        modelValue: 10,
        error: true,
        errorMessage: "Invalide"
      }
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    const errorId = input.attributes("aria-describedby");
    expect(errorId).toBeDefined();
    expect(wrapper.find(`#${errorId}`).text()).toContain("Invalide");
  });

  it("uses default error message", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: {
        modelValue: 10,
        error: true
      }
    });

    expect(wrapper.text()).toContain("Valeur invalide");
  });

  it("formats NaN as zero", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: Number.NaN }
    });

    await nextTick();
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe(`0,00${NBSP}€`);
  });

  it("renders label with matching input id", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 10, label: "Montant" }
    });

    const label = wrapper.find("label");
    const input = wrapper.find("input");
    expect(label.text()).toBe("Montant");
    expect(label.attributes("for")).toBe(input.attributes("id"));
  });

});
