import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetRadio from "../../src/components/BudgetRadio/BudgetRadio.vue";
import doc from "../../docs/BudgetRadio/BudgetRadio.md?raw";

const meta: Meta<typeof BudgetRadio> = {
  title: "Components/Input/Radio",
  component: BudgetRadio,
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

type Story = StoryObj<typeof BudgetRadio>;

export const Unchecked: Story = {
  args: {
    modelValue: "none",
    value: "option-a",
    label: "Option A",
    name: "standalone-unchecked"
  },
  render: (args) => ({
    components: { BudgetRadio },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetRadio v-bind="args" v-model="value" />'
  })
};

export const Checked: Story = {
  args: {
    modelValue: "option-a",
    value: "option-a",
    label: "Option A",
    name: "standalone-checked"
  },
  render: (args) => ({
    components: { BudgetRadio },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetRadio v-bind="args" v-model="value" />'
  })
};

export const Disabled: Story = {
  args: {
    modelValue: "option-a",
    value: "option-a",
    label: "Option A",
    name: "standalone-disabled",
    disabled: true
  },
  render: (args) => ({
    components: { BudgetRadio },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetRadio v-bind="args" v-model="value" />'
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetRadio },
    setup() {
      const selected = ref("primary");
      return { selected };
    },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetRadio v-model="selected" name="colors" value="primary" label="Primary" color="primary" />
        <BudgetRadio v-model="selected" name="colors" value="neutral" label="Neutral" color="neutral" />
        <BudgetRadio v-model="selected" name="colors" value="success" label="Success" color="success" />
        <BudgetRadio v-model="selected" name="colors" value="warning" label="Warning" color="warning" />
        <BudgetRadio v-model="selected" name="colors" value="error" label="Error" color="error" />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetRadio },
    setup() {
      const selected = ref("md");
      return { selected };
    },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetRadio v-model="selected" name="sizes" value="sm" label="Small" size="sm" />
        <BudgetRadio v-model="selected" name="sizes" value="md" label="Medium" size="md" />
        <BudgetRadio v-model="selected" name="sizes" value="lg" label="Large" size="lg" />
      </div>
    `
  })
};
