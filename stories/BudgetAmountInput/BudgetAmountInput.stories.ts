import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetAmountInput from "../../src/components/BudgetAmountInput/BudgetAmountInput.vue";
import doc from "../../docs/BudgetAmountInput/BudgetAmountInput.md?raw";

const meta: Meta<typeof BudgetAmountInput> = {
  title: "Components/BudgetAmountInput",
  component: BudgetAmountInput,
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

type Story = StoryObj<typeof BudgetAmountInput>;

export const Default: Story = {
  args: {
    modelValue: 1000.5,
    label: "Montant"
  },
  render: (args) => ({
    components: { BudgetAmountInput },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetAmountInput v-bind="args" v-model="value" />'
  })
};

export const AllowEmpty: Story = {
  args: {
    modelValue: null,
    label: "Montant",
    allowEmpty: true
  },
  render: (args) => ({
    components: { BudgetAmountInput },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetAmountInput v-bind="args" v-model="value" />'
  })
};

export const Error: Story = {
  args: {
    modelValue: 50,
    label: "Montant",
    error: true,
    errorMessage: "Valeur invalide"
  },
  render: (args) => ({
    components: { BudgetAmountInput },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetAmountInput v-bind="args" v-model="value" />'
  })
};
