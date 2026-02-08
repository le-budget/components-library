import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetRadio from "../../src/components/BudgetRadio/BudgetRadio.vue";
import BudgetRadioGroup from "../../src/components/BudgetRadioGroup/BudgetRadioGroup.vue";
import doc from "../../docs/BudgetRadioGroup/BudgetRadioGroup.md?raw";

const meta: Meta<typeof BudgetRadioGroup> = {
  title: "Components/Input/RadioGroup",
  component: BudgetRadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetRadioGroup>;

export const Horizontal: Story = {
  args: {
    modelValue: "monthly",
    label: "Frequence",
    orientation: "horizontal"
  },
  render: (args) => ({
    components: { BudgetRadioGroup, BudgetRadio },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <BudgetRadioGroup v-bind="args" v-model="value">
        <BudgetRadio value="weekly" label="Hebdomadaire" />
        <BudgetRadio value="monthly" label="Mensuel" />
        <BudgetRadio value="yearly" label="Annuel" />
      </BudgetRadioGroup>
    `
  })
};

export const Vertical: Story = {
  args: {
    modelValue: "monthly",
    label: "Frequence",
    orientation: "vertical"
  },
  render: (args) => ({
    components: { BudgetRadioGroup, BudgetRadio },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <BudgetRadioGroup v-bind="args" v-model="value">
        <BudgetRadio value="weekly" label="Hebdomadaire" />
        <BudgetRadio value="monthly" label="Mensuel" />
        <BudgetRadio value="yearly" label="Annuel" />
      </BudgetRadioGroup>
    `
  })
};

export const ErrorState: Story = {
  args: {
    modelValue: null,
    label: "Frequence",
    error: true,
    errorMessage: "Selection obligatoire"
  },
  render: (args) => ({
    components: { BudgetRadioGroup, BudgetRadio },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <BudgetRadioGroup v-bind="args" v-model="value">
        <BudgetRadio value="weekly" label="Hebdomadaire" />
        <BudgetRadio value="monthly" label="Mensuel" />
        <BudgetRadio value="yearly" label="Annuel" />
      </BudgetRadioGroup>
    `
  })
};

export const ColorsAndSizes: Story = {
  render: () => ({
    components: { BudgetRadioGroup, BudgetRadio },
    setup() {
      const colorValue = ref("success");
      const sizeValue = ref("md");
      return { colorValue, sizeValue };
    },
    template: `
      <div class="grid gap-4">
        <BudgetRadioGroup v-model="colorValue" label="Couleurs" color="success">
          <BudgetRadio value="success" label="Success" />
          <BudgetRadio value="neutral" label="Neutral" color="neutral" />
          <BudgetRadio value="error" label="Error" color="error" />
        </BudgetRadioGroup>

        <BudgetRadioGroup v-model="sizeValue" label="Tailles" size="lg">
          <BudgetRadio value="sm" label="Small" size="sm" />
          <BudgetRadio value="md" label="Medium" />
          <BudgetRadio value="lg" label="Large" size="lg" />
        </BudgetRadioGroup>
      </div>
    `
  })
};
