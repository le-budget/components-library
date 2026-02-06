import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetInputText from "../../src/components/BudgetInputText/BudgetInputText.vue";
import BudgetStatusIcon from "../../src/components/BudgetStatusIcon/BudgetStatusIcon.vue";
import doc from "../../docs/BudgetInputText/BudgetInputText.md?raw";

const meta: Meta<typeof BudgetInputText> = {
  title: "Components/BudgetInputText",
  component: BudgetInputText,
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

type Story = StoryObj<typeof BudgetInputText>;

export const Default: Story = {
  args: {
    modelValue: "",
    label: "Nom",
    placeholder: "Votre nom"
  },
  render: (args) => ({
    components: { BudgetInputText },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetInputText v-bind="args" v-model="value" />'
  })
};

export const WithIcons: Story = {
  args: {
    modelValue: "",
    label: "Recherche",
    placeholder: "Rechercher"
  },
  render: (args) => ({
    components: { BudgetInputText, BudgetStatusIcon },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <BudgetInputText v-bind="args" v-model="value">
        <template #prefix>
          <BudgetStatusIcon status="status-info" />
        </template>
        <template #suffix>
          <BudgetStatusIcon status="status-success" />
        </template>
      </BudgetInputText>
    `
  })
};

export const Error: Story = {
  args: {
    modelValue: "Erreur",
    label: "Nom",
    error: true,
    errorMessage: "Valeur invalide"
  },
  render: (args) => ({
    components: { BudgetInputText },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<BudgetInputText v-bind="args" v-model="value" />'
  })
};
