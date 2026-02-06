import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetStatusIcon from "../../src/components/BudgetStatusIcon/BudgetStatusIcon.vue";
import doc from "../../docs/BudgetButton/BudgetButton.md?raw";

const meta: Meta<typeof BudgetButton> = {
  title: "Components/BudgetButton",
  component: BudgetButton,
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

type Story = StoryObj<typeof BudgetButton>;

export const Primary: Story = {
  args: {
    size: "md",
    disabled: false,
    loading: false,
    error: false
  },
  render: (args) => ({
    components: { BudgetButton },
    setup: () => ({ args }),
    template: '<BudgetButton v-bind="args">Valider</BudgetButton>'
  })
};

export const Loading: Story = {
  args: {
    loading: true
  },
  render: (args) => ({
    components: { BudgetButton },
    setup: () => ({ args }),
    template: '<BudgetButton v-bind="args">Traitement</BudgetButton>'
  })
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
  render: (args) => ({
    components: { BudgetButton },
    setup: () => ({ args }),
    template: '<BudgetButton v-bind="args">Desactive</BudgetButton>'
  })
};

export const Error: Story = {
  args: {
    error: true
  },
  render: (args) => ({
    components: { BudgetButton },
    setup: () => ({ args }),
    template: '<BudgetButton v-bind="args">Erreur</BudgetButton>'
  })
};

export const IconOnly: Story = {
  args: {
    ariaLabel: "Ajouter",
    size: "md"
  },
  render: (args) => ({
    components: { BudgetButton, BudgetStatusIcon },
    setup: () => ({ args }),
    template:
      '<BudgetButton v-bind="args"><template #icon><BudgetStatusIcon status="status-info" /></template></BudgetButton>'
  })
};

export const IconText: Story = {
  render: () => ({
    components: { BudgetButton, BudgetStatusIcon },
    template:
      '<BudgetButton><template #icon><BudgetStatusIcon status="status-success" /></template>Confirmer</BudgetButton>'
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetButton },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetButton size="sm">Petit</BudgetButton>
        <BudgetButton size="md">Moyen</BudgetButton>
        <BudgetButton size="lg">Grand</BudgetButton>
      </div>
    `
  })
};
