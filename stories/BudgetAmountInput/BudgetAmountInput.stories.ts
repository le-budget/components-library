import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetAmountInput from "../../src/components/BudgetAmountInput/BudgetAmountInput.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetAmountInput/BudgetAmountInput.md?raw";

const meta: Meta<typeof BudgetAmountInput> = {
  title: "Components/Input/Input Amount",
  component: BudgetAmountInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"]
    },
    autocomplete: {
      control: "text"
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetAmountInput>;

export const Default: Story = {
  args: {
    modelValue: 1000.5,
    label: "Montant",
    autocomplete: "off"
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

export const WithIcons: Story = {
  args: {
    modelValue: 250,
    label: "Montant"
  },
  render: (args) => ({
    components: { BudgetAmountInput, BudgetIcon },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <BudgetAmountInput v-bind="args" v-model="value">
        <template #prefix>
          <BudgetIcon status="status-info" />
        </template>
        <template #suffix>
          <BudgetIcon status="status-success" />
        </template>
      </BudgetAmountInput>
    `
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

export const Success: Story = {
  args: {
    modelValue: 99.99,
    label: "Montant",
    success: true
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

export const Autocomplete: Story = {
  args: {
    modelValue: 0,
    label: "Montant",
    autocomplete: "transaction-amount"
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

export const Sizes: Story = {
  render: () => ({
    components: { BudgetAmountInput },
    setup() {
      const valueSm = ref(125);
      const valueMd = ref(1250.5);
      const valueLg = ref(12500.75);
      return { valueSm, valueMd, valueLg };
    },
    template: `
      <div class="grid gap-4">
        <BudgetAmountInput v-model="valueSm" label="Taille sm" size="sm" />
        <BudgetAmountInput v-model="valueMd" label="Taille md" size="md" />
        <BudgetAmountInput v-model="valueLg" label="Taille lg" size="lg" />
      </div>
    `
  })
};
