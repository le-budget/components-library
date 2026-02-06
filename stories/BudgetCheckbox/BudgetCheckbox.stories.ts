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

export const Colors: Story = {
  render: () => ({
    components: { BudgetCheckbox },
    setup() {
      const value = ref(true);
      return { value };
    },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetCheckbox v-model="value" label="Primary" color="primary" />
        <BudgetCheckbox v-model="value" label="Success" color="success" />
        <BudgetCheckbox v-model="value" label="Warning" color="warning" />
        <BudgetCheckbox v-model="value" label="Error" color="error" />
      </div>
    `
  })
};
