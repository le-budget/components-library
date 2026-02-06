import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetCheckbox from "../../src/components/BudgetCheckbox/BudgetCheckbox.vue";
import doc from "../../docs/BudgetCheckbox/BudgetCheckbox.md?raw";

const meta: Meta<typeof BudgetCheckbox> = {
  title: "Components/Input/Checkbox",
  component: BudgetCheckbox,
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

type Story = StoryObj<typeof BudgetCheckbox>;

export const Unchecked: Story = {
  args: {
    modelValue: false,
    label: "Activer"
  },
  render: (args) => ({
    components: { BudgetCheckbox },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetCheckbox v-bind="args" v-model="value" />'
  })
};

export const Checked: Story = {
  args: {
    modelValue: true,
    label: "Activer"
  },
  render: (args) => ({
    components: { BudgetCheckbox },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetCheckbox v-bind="args" v-model="value" />'
  })
};

export const Disabled: Story = {
  args: {
    modelValue: true,
    label: "Activer",
    disabled: true
  },
  render: (args) => ({
    components: { BudgetCheckbox },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetCheckbox v-bind="args" v-model="value" />'
  })
};

export const Error: Story = {
  args: {
    modelValue: false,
    label: "Activer",
    error: true,
    errorMessage: "Valeur invalide"
  },
  render: (args) => ({
    components: { BudgetCheckbox },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetCheckbox v-bind="args" v-model="value" />'
  })
};
