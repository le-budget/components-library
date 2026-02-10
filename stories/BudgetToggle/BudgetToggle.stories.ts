import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetToggle from "../../src/components/BudgetToggle/BudgetToggle.vue";
import doc from "../../docs/BudgetToggle/BudgetToggle.md?raw";

const meta: Meta<typeof BudgetToggle> = {
  title: "Components/Input/Toggle",
  component: BudgetToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    modelValue: false,
    color: "primary",
    size: "md",
    activeText: "Actif",
    inactiveText: "Inactif",
    disabled: false
  },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "error"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl"]
    },
    disabled: {
      control: "boolean"
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetToggle>;

export const Default: Story = {
  render: (args) => ({
    components: { BudgetToggle },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetToggle v-bind="args" v-model="value" />'
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetToggle },
    setup() {
      const value = ref(true);
      return { value };
    },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetToggle v-model="value" color="primary" active-text="Primary" />
        <BudgetToggle v-model="value" color="neutral" active-text="Neutral" />
        <BudgetToggle v-model="value" color="success" active-text="Success" />
        <BudgetToggle v-model="value" color="warning" active-text="Warning" />
        <BudgetToggle v-model="value" color="error" active-text="Error" />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetToggle },
    setup() {
      const value = ref(true);
      return { value };
    },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetToggle v-model="value" size="sm" active-text="Small" />
        <BudgetToggle v-model="value" size="md" active-text="Medium" />
        <BudgetToggle v-model="value" size="lg" active-text="Large" />
        <BudgetToggle v-model="value" size="xl" active-text="Extra large" />
      </div>
    `
  })
};

export const Disabled: Story = {
  render: () => ({
    components: { BudgetToggle },
    setup() {
      const enabled = ref(true);
      const disabledValue = ref(false);
      return { enabled, disabledValue };
    },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetToggle
          v-model="enabled"
          disabled
          active-text="Actif (disabled)"
          inactive-text="Inactif (disabled)"
        />
        <BudgetToggle
          v-model="disabledValue"
          disabled
          active-text="Actif (disabled)"
          inactive-text="Inactif (disabled)"
        />
      </div>
    `
  })
};

export const Playground: Story = {
  render: () => ({
    components: { BudgetToggle },
    setup() {
      const enabled = ref(false);
      const colored = ref(true);
      const sized = ref(true);
      return { enabled, colored, sized };
    },
    template: `
      <div class="grid gap-4">
        <BudgetToggle
          v-model="enabled"
          active-text="Notifications actives"
          inactive-text="Notifications inactives"
        />
        <BudgetToggle
          v-model="colored"
          color="success"
          active-text="Sauvegarde auto activee"
          inactive-text="Sauvegarde auto desactivee"
        />
        <BudgetToggle
          v-model="sized"
          size="xl"
          color="warning"
          active-text="Mode surveillance"
          inactive-text="Mode normal"
        />
      </div>
    `
  })
};
