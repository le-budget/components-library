import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import BudgetAmountInput from "../src/components/BudgetAmountInput/BudgetAmountInput.vue";

const NBSP = "\u00A0";

describe("BudgetAmountInput", () => {
  it("formats initial value", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 1000.5 }
    });

    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe(`1 000,50${NBSP}\u20AC`);
  });

  it("formats negative values", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: -12.3 }
    });

    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe(`-12,30${NBSP}\u20AC`);
  });

  it("formats non-finite values as zero", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: Number.POSITIVE_INFINITY }
    });

    await nextTick();
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe(`0,00${NBSP}\u20AC`);
  });

  it("normalizes negative zero to zero", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: -0 }
    });

    await nextTick();
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe(`0,00${NBSP}\u20AC`);
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
    expect((input.element as HTMLInputElement).value).toBe(`2 000,00${NBSP}\u20AC`);
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

  it("normalizes typed negative zero to zero", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = "-0";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([0]);
  });

  it("keeps sign-only input as intermediate negative state", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = "-";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect((input.element as HTMLInputElement).value).toBe("-");
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
    expect((input.element as HTMLInputElement).value).toBe(`0,50${NBSP}\u20AC`);
  });

  it("treats dot as a decimal separator", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    input.element.value = "12.34";
    await input.trigger("input");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([12.34]);
    expect((input.element as HTMLInputElement).value).toBe(`12,34${NBSP}\u20AC`);
  });

  it("selects full content on focus", async () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 123.45 }
    });

    const input = wrapper.find("input").element as HTMLInputElement;
    const selectSpy = vi.spyOn(input, "select");
    await wrapper.find("input").trigger("focus");

    expect(selectSpy).toHaveBeenCalledTimes(1);
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
    expect((input.element as HTMLInputElement).value).toBe(`0,00${NBSP}\u20AC`);
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

  it("applies success styles", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: {
        modelValue: 10,
        success: true
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("border-c-green");
  });

  it("error overrides success", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: {
        modelValue: 10,
        error: true,
        success: true
      }
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("border-c-red");
    expect(input.classes()).not.toContain("border-c-green");
  });

  it("passes autocomplete to the input", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0, autocomplete: "off" }
    });

    const input = wrapper.find("input");
    expect(input.attributes("autocomplete")).toBe("off");
  });

  it("defaults autocomplete to off", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 0 }
    });

    const input = wrapper.find("input");
    expect(input.attributes("autocomplete")).toBe("off");
  });

  it("handles prefix and suffix slots", () => {
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 10 },
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
    const wrapper = mount(BudgetAmountInput, {
      props: { modelValue: 10 }
    });

    const input = wrapper.find("input");
    expect(input.classes()).not.toContain("pl-9");
    expect(input.classes()).not.toContain("pr-9");
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
