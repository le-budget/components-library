import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetButton/BudgetButton.md?raw";

const meta: Meta<typeof BudgetButton> = {
  title: "Components/Actions/Button",
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
    color: "primary"
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

export const IconOnly: Story = {
  args: {
    ariaLabel: "Ajouter",
    size: "md"
  },
  render: (args) => ({
    components: { BudgetButton, BudgetIcon },
    setup: () => ({ args }),
    template:
      '<BudgetButton v-bind="args"><template #icon><BudgetIcon status="status-info" /></template></BudgetButton>'
  })
};

export const IconText: Story = {
  render: () => ({
    components: { BudgetButton, BudgetIcon },
    template: `
      <div class="flex flex-col gap-2">
        <BudgetButton size="sm">
          <template #icon><BudgetIcon status="status-success" /></template>
          Confirmer
        </BudgetButton>
        <BudgetButton size="md">
          <template #icon><BudgetIcon status="status-success" /></template>
          Confirmer
        </BudgetButton>
        <BudgetButton size="lg">
          <template #icon><BudgetIcon status="status-success" /></template>
          Confirmer
        </BudgetButton>
      </div>
    `
  })
};

export const IconTextLoading: Story = {
  args: {
    loading: true
  },
  render: (args) => ({
    components: { BudgetButton, BudgetIcon },
    setup: () => ({ args }),
    template:
      '<BudgetButton v-bind="args"><template #icon><BudgetIcon status="status-info" /></template>En cours</BudgetButton>'
  })
};

export const IconTextLoadingWithIcons: Story = {
  args: {
    loading: true,
    hideIconsOnLoading: false
  },
  render: (args) => ({
    components: { BudgetButton, BudgetIcon },
    setup: () => ({ args }),
    template:
      '<BudgetButton v-bind="args"><template #icon><BudgetIcon status="status-info" /></template>En cours</BudgetButton>'
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

export const Colors: Story = {
  render: () => ({
    components: { BudgetButton },
    template: `
      <div class="grid gap-2 sm:grid-cols-2">
        <BudgetButton color="primary">Primary</BudgetButton>
        <BudgetButton color="secondary">Secondary</BudgetButton>
        <BudgetButton color="ghost">Ghost</BudgetButton>
        <BudgetButton color="primary-success">Primary Success</BudgetButton>
        <BudgetButton color="secondary-success">Secondary Success</BudgetButton>
        <BudgetButton color="primary-warning">Primary Warning</BudgetButton>
        <BudgetButton color="secondary-warning">Secondary Warning</BudgetButton>
        <BudgetButton color="primary-error">Primary Error</BudgetButton>
        <BudgetButton color="secondary-error">Secondary Error</BudgetButton>
      </div>
    `
  })
};
