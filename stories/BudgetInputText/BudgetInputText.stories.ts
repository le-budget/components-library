import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetInputText from "../../src/components/BudgetInputText/BudgetInputText.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetInputText/BudgetInputText.md?raw";

const meta: Meta<typeof BudgetInputText> = {
  title: "Components/Input/Input Text",
  component: BudgetInputText,
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

type Story = StoryObj<typeof BudgetInputText>;

export const Default: Story = {
  args: {
    modelValue: "",
    label: "Nom",
    placeholder: "Votre nom",
    autocomplete: "off"
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
    components: { BudgetInputText, BudgetIcon },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <BudgetInputText v-bind="args" v-model="value">
        <template #prefix>
          <BudgetIcon status="status-info" />
        </template>
        <template #suffix>
          <BudgetIcon status="status-success" />
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

export const Success: Story = {
  args: {
    modelValue: "Valide",
    label: "Nom",
    success: true
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

export const Autocomplete: Story = {
  args: {
    modelValue: "",
    label: "Email",
    placeholder: "nom@exemple.com",
    autocomplete: "email"
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

export const Sizes: Story = {
  render: () => ({
    components: { BudgetInputText },
    setup() {
      const valueSm = ref("");
      const valueMd = ref("");
      const valueLg = ref("");
      return { valueSm, valueMd, valueLg };
    },
    template: `
      <div class="grid gap-4">
        <BudgetInputText v-model="valueSm" label="Taille sm" size="sm" placeholder="Votre nom" />
        <BudgetInputText v-model="valueMd" label="Taille md" size="md" placeholder="Votre nom" />
        <BudgetInputText v-model="valueLg" label="Taille lg" size="lg" placeholder="Votre nom" />
      </div>
    `
  })
};

export const RightAligned: Story = {
  args: {
    modelValue: "Texte aligne a droite",
    label: "Nom",
    align: "right"
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
