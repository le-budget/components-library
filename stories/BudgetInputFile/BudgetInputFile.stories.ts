import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetInputFile from "../../src/components/BudgetInputFile/BudgetInputFile.vue";
import doc from "../../docs/BudgetInputFile/BudgetInputFile.md?raw";

const meta: Meta<typeof BudgetInputFile> = {
  title: "Components/Input/Input File",
  component: BudgetInputFile,
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
    color: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "error", "neutral"]
    },
    accept: {
      control: "text"
    },
    maxFileSize: {
      control: "number"
    }
  }
};

export default meta;
type Story = StoryObj<typeof BudgetInputFile>;

export const Default: Story = {
  args: {
    modelValue: null,
    label: "Justificatif",
    dropzoneLabel: "Glissez-deposez un fichier ou cliquez"
  },
  render: (args) => ({
    components: { BudgetInputFile },
    setup() {
      const value = ref<File | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetInputFile v-bind="args" v-model="value" />'
  })
};

export const PdfOnly: Story = {
  args: {
    modelValue: null,
    label: "Facture",
    accept: ".pdf,application/pdf",
    maxFileSize: 2 * 1024 * 1024
  },
  render: (args) => ({
    components: { BudgetInputFile },
    setup() {
      const value = ref<File | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetInputFile v-bind="args" v-model="value" />'
  })
};

export const Error: Story = {
  args: {
    modelValue: null,
    label: "Piece jointe",
    error: true,
    errorMessage: "Le fichier est obligatoire",
    color: "error"
  },
  render: (args) => ({
    components: { BudgetInputFile },
    setup() {
      const value = ref<File | null>(args.modelValue);
      return { args, value };
    },
    template: '<BudgetInputFile v-bind="args" v-model="value" />'
  })
};
