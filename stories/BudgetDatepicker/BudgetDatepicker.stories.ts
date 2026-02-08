import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetDatepicker from "../../src/components/BudgetDatepicker/BudgetDatepicker.vue";
import doc from "../../docs/BudgetDatepicker/BudgetDatepicker.md?raw";

const meta: Meta<typeof BudgetDatepicker> = {
  title: "Components/Input/Datepicker",
  component: BudgetDatepicker,
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
    align: {
      control: { type: "select" },
      options: ["left", "right"]
    },
    autocomplete: {
      control: "text"
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetDatepicker>;

export const Default: Story = {
  args: {
    modelValue: null,
    label: "Date",
    placeholder: "jj/mm/aaaa"
  },
  render: (args) => ({
    components: { BudgetDatepicker },
    setup() {
      const value = ref<string | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetDatepicker v-bind="args" v-model="value" />'
  })
};

export const WithValue: Story = {
  args: {
    modelValue: "2026-02-08",
    label: "Date de paiement"
  },
  render: (args) => ({
    components: { BudgetDatepicker },
    setup() {
      const value = ref<string | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetDatepicker v-bind="args" v-model="value" />'
  })
};

export const WithBounds: Story = {
  args: {
    modelValue: "2026-02-15",
    label: "Periode autorisee",
    minDate: "2026-02-10",
    maxDate: "2026-02-20"
  },
  render: (args) => ({
    components: { BudgetDatepicker },
    setup() {
      const value = ref<string | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetDatepicker v-bind="args" v-model="value" />'
  })
};

export const Error: Story = {
  args: {
    modelValue: null,
    label: "Date",
    error: true,
    errorMessage: "Date invalide"
  },
  render: (args) => ({
    components: { BudgetDatepicker },
    setup() {
      const value = ref<string | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetDatepicker v-bind="args" v-model="value" />'
  })
};

export const Success: Story = {
  args: {
    modelValue: "2026-02-08",
    label: "Date",
    success: true
  },
  render: (args) => ({
    components: { BudgetDatepicker },
    setup() {
      const value = ref<string | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetDatepicker v-bind="args" v-model="value" />'
  })
};
