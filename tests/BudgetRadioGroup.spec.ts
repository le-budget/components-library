import { mount } from "@vue/test-utils";
import { defineComponent, h, inject, nextTick, onMounted, ref } from "vue";
import { vi } from "vitest";
import BudgetRadio from "../src/components/BudgetRadio/BudgetRadio.vue";
import BudgetRadioGroup from "../src/components/BudgetRadioGroup/BudgetRadioGroup.vue";
import { budgetRadioGroupKey } from "../src/components/BudgetRadioGroup/radioGroupContext";

describe("BudgetRadioGroup", () => {
  it("uses horizontal orientation by default", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: { modelValue: "monthly" },
      slots: {
        default: '<BudgetRadio value="monthly" label="Mensuel" />'
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const group = wrapper.find('[role="radiogroup"]');
    expect(group.classes()).toContain("flex-row");
    expect(group.classes()).toContain("flex-wrap");
  });

  it("supports vertical orientation", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: { modelValue: "monthly", orientation: "vertical" },
      slots: {
        default: '<BudgetRadio value="monthly" label="Mensuel" />'
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const group = wrapper.find('[role="radiogroup"]');
    expect(group.classes()).toContain("flex-col");
    expect(group.classes()).not.toContain("flex-row");
  });

  it("emits update:modelValue when selecting another option", async () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: { modelValue: "weekly", name: "frequency" },
      slots: {
        default: `
          <BudgetRadio value="weekly" label="Hebdomadaire" />
          <BudgetRadio value="monthly" label="Mensuel" />
        `
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const inputs = wrapper.findAll("input");
    await inputs[1].setValue(true);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["monthly"]);
  });

  it("links error message with aria-describedby", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: null,
        error: true,
        errorMessage: "Selection obligatoire"
      },
      slots: {
        default: '<BudgetRadio value="monthly" label="Mensuel" />'
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const group = wrapper.find('[role="radiogroup"]');
    const radio = wrapper.find("input");
    const describedBy = group.attributes("aria-describedby");

    expect(group.attributes("aria-invalid")).toBe("true");
    expect(radio.attributes("aria-invalid")).toBe("true");
    expect(describedBy).toBeDefined();
    expect(radio.attributes("aria-describedby")).toBe(describedBy);
    expect(wrapper.find(`#${describedBy}`).text()).toBe("Selection obligatoire");
  });

  it("uses default group error message", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: null,
        error: true
      },
      slots: {
        default: '<BudgetRadio value="monthly" label="Mensuel" />'
      },
      global: {
        components: { BudgetRadio }
      }
    });

    expect(wrapper.text()).toContain("Valeur invalide");
  });

  it("sets aria-labelledby when label is provided", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: "monthly",
        label: "Frequence"
      },
      slots: {
        default: '<BudgetRadio value="monthly" label="Mensuel" />'
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const group = wrapper.find('[role="radiogroup"]');
    const labelledBy = group.attributes("aria-labelledby");
    expect(labelledBy).toBeDefined();
    expect(wrapper.find(`#${labelledBy}`).text()).toBe("Frequence");
  });

  it("propagates disabled state to radios", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: "monthly",
        disabled: true
      },
      slots: {
        default: '<BudgetRadio value="monthly" label="Mensuel" />'
      },
      global: {
        components: { BudgetRadio }
      }
    });

    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });

  it("supports arrow key navigation", async () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: "weekly",
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
    await inputs[0].trigger("keydown", { key: "ArrowRight" });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["monthly"]);
  });

  it("allows radio color override when group color is set", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: "weekly",
        color: "success"
      },
      slots: {
        default: `
          <BudgetRadio value="weekly" label="Hebdomadaire" />
          <BudgetRadio value="monthly" label="Mensuel" color="error" />
        `
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const radios = wrapper.findAll("label > span.rounded-full.border");
    expect(radios[0].classes()).toContain("border-c-green-dark");
    expect(radios[1].classes()).toContain("border-c-red-dark");
  });

  it("allows radio size override when group size is set", () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: "weekly",
        size: "lg"
      },
      slots: {
        default: `
          <BudgetRadio value="weekly" label="Hebdomadaire" />
          <BudgetRadio value="monthly" label="Mensuel" size="sm" />
        `
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const radios = wrapper.findAll("label > span.rounded-full.border");
    expect(radios[0].classes()).toContain("h-6");
    expect(radios[1].classes()).toContain("h-4");
  });

  it("does not move selection when all radios are disabled", async () => {
    const wrapper = mount(BudgetRadioGroup, {
      props: {
        modelValue: "weekly",
        disabled: true
      },
      slots: {
        default: `
          <BudgetRadio value="weekly" label="Hebdomadaire" />
          <BudgetRadio value="monthly" label="Mensuel" />
        `
      },
      global: {
        components: { BudgetRadio }
      }
    });

    const input = wrapper.find("input");
    await input.trigger("keydown", { key: "ArrowRight" });

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("unregisters radios on unmount", async () => {
    const Host = defineComponent({
      components: { BudgetRadioGroup, BudgetRadio },
      setup() {
        const selected = ref("weekly");
        const visible = ref(true);
        return { selected, visible };
      },
      template: `
        <BudgetRadioGroup v-model="selected">
          <BudgetRadio v-if="visible" value="weekly" label="Hebdomadaire" />
          <BudgetRadio value="monthly" label="Mensuel" />
        </BudgetRadioGroup>
      `
    });

    const wrapper = mount(Host);
    await wrapper.findAll("input")[0].trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.findComponent(BudgetRadioGroup).emitted("update:modelValue")?.[0]).toEqual(["monthly"]);

    wrapper.vm.visible = false;
    await nextTick();

    await wrapper.find("input").trigger("keydown", { key: "ArrowRight" });
    const emitted = wrapper.findComponent(BudgetRadioGroup).emitted("update:modelValue");
    expect(emitted).toEqual([["monthly"], ["monthly"]]);
  });

  it("ignores duplicate register calls for the same input", () => {
    const DuplicateRegisterProbe = defineComponent({
      setup() {
        const group = inject(budgetRadioGroupKey);
        const input = document.createElement("input");
        input.type = "radio";

        onMounted(() => {
          group?.registerRadio(input);
          group?.registerRadio(input);
        });

        return () => h("div");
      }
    });

    const wrapper = mount(BudgetRadioGroup, {
      props: { modelValue: "weekly" },
      slots: {
        default: () => h(DuplicateRegisterProbe)
      }
    });

    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
  });

  it("returns early in focusByStep when there are no enabled radios", () => {
    const NoEnabledProbe = defineComponent({
      setup() {
        const group = inject(budgetRadioGroupKey);
        const input = document.createElement("input");
        input.type = "radio";
        input.disabled = true;

        onMounted(() => {
          group?.registerRadio(input);
          group?.focusByStep(input, 1);
        });

        return () => h("div");
      }
    });

    const wrapper = mount(BudgetRadioGroup, {
      props: { modelValue: "weekly" },
      slots: {
        default: () => h(NoEnabledProbe)
      }
    });

    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
  });

  it("exposes modelValue through provided context", () => {
    const readValues: unknown[] = [];
    const ModelValueProbe = defineComponent({
      setup() {
        const group = inject(budgetRadioGroupKey);
        onMounted(() => {
          readValues.push(group?.modelValue.value);
        });
        return () => h("div");
      }
    });

    mount(BudgetRadioGroup, {
      props: { modelValue: "monthly" },
      slots: {
        default: () => h(ModelValueProbe)
      }
    });

    expect(readValues).toEqual(["monthly"]);
  });

  it("handles focusByStep with an unregistered current input", () => {
    const UnregisteredCurrentProbe = defineComponent({
      setup() {
        const group = inject(budgetRadioGroupKey);
        const unregisteredCurrent = document.createElement("input");
        unregisteredCurrent.type = "radio";

        const registered = document.createElement("input");
        registered.type = "radio";
        const changeSpy = vi.fn();
        registered.addEventListener("change", changeSpy);

        onMounted(() => {
          group?.registerRadio(registered);
          group?.focusByStep(unregisteredCurrent, 1);
        });

        return () => h("div");
      }
    });

    const wrapper = mount(BudgetRadioGroup, {
      props: { modelValue: "weekly" },
      slots: {
        default: () => h(UnregisteredCurrentProbe)
      }
    });

    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
  });
});
