import { mount } from "@vue/test-utils";
import BudgetRadio from "../src/components/BudgetRadio/BudgetRadio.vue";
import BudgetRadioGroup from "../src/components/BudgetRadioGroup/BudgetRadioGroup.vue";

describe("BudgetRadio", () => {
  it("emits update:modelValue on change in standalone mode", async () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: "weekly",
        value: "monthly",
        name: "frequency",
        label: "Mensuel"
      }
    });

    await wrapper.find("input").setValue(true);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["monthly"]);
  });

  it("applies checked style when selected", () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: "monthly",
        value: "monthly",
        color: "primary"
      }
    });

    const radio = wrapper.find("label > span");
    expect(radio.classes()).toContain("bg-c-blue");
    expect(radio.classes()).toContain("border-c-blue-dark");
  });

  it("applies unchecked style when not selected", () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: "weekly",
        value: "monthly",
        color: "warning"
      }
    });

    const radio = wrapper.find("label > span");
    expect(radio.classes()).toContain("bg-white");
    expect(radio.classes()).toContain("text-c-orange-dark");
  });

  it("supports neutral color variant", () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: "weekly",
        value: "monthly",
        color: "neutral"
      }
    });

    const radio = wrapper.find("label > span");
    expect(radio.classes()).toContain("border-slate-500");
  });

  it("applies disabled styles", () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: "monthly",
        value: "monthly",
        disabled: true
      }
    });

    const input = wrapper.find("input");
    const radio = wrapper.find("label > span");
    expect(input.attributes("disabled")).toBeDefined();
    expect(radio.classes()).toContain("opacity-60");
  });

  it("applies size variants", () => {
    const small = mount(BudgetRadio, {
      props: { modelValue: "a", value: "a", size: "sm" }
    });
    expect(small.find("label > span").classes()).toContain("h-4");
    expect(small.find("label > span > span").classes()).toContain("h-1.5");

    const medium = mount(BudgetRadio, {
      props: { modelValue: "a", value: "a" }
    });
    expect(medium.find("label > span").classes()).toContain("h-5");
    expect(medium.find("label > span > span").classes()).toContain("h-2");

    const large = mount(BudgetRadio, {
      props: { modelValue: "a", value: "a", size: "lg" }
    });
    expect(large.find("label > span").classes()).toContain("h-6");
    expect(large.find("label > span > span").classes()).toContain("h-2.5");
  });

  it("renders standalone error message and aria attributes", () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: null,
        value: "monthly",
        error: true,
        errorMessage: "Selection obligatoire"
      }
    });

    const input = wrapper.find("input");
    const errorId = input.attributes("aria-describedby");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(errorId).toBeDefined();
    expect(wrapper.find(`#${errorId}`).text()).toBe("Selection obligatoire");
  });

  it("uses default standalone error message", () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: null,
        value: "monthly",
        error: true
      }
    });

    expect(wrapper.text()).toContain("Valeur invalide");
  });

  it("does not emit when change event comes from unchecked input", async () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: "weekly",
        value: "monthly",
        name: "frequency"
      }
    });

    const input = wrapper.find("input").element as HTMLInputElement;
    input.checked = false;
    await wrapper.find("input").trigger("change");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("handles keydown and unmount in standalone mode", async () => {
    const wrapper = mount(BudgetRadio, {
      props: {
        modelValue: "weekly",
        value: "weekly",
        name: "frequency"
      }
    });

    await wrapper.find("input").trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    wrapper.unmount();
  });

  it("supports ArrowLeft and ArrowUp navigation in group", async () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: "monthly",
        name: "frequency"
      },
      slots: {
        default: `
          <BudgetRadio value="weekly" label="Hebdomadaire" />
          <BudgetRadio value="monthly" label="Mensuel" />
          <BudgetRadio value="yearly" label="Annuel" />
        `
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const inputs = wrapper.findAll("input");
    await inputs[1].trigger("keydown", { key: "ArrowLeft" });
    await inputs[1].trigger("keydown", { key: "ArrowUp" });

    expect(wrapper.emitted("update:modelValue")).toEqual([["weekly"], ["weekly"]]);
  });
});
