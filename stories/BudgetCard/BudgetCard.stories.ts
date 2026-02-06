import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetCard from "../../src/components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetCard/BudgetCard.md?raw";

const meta: Meta<typeof BudgetCard> = {
  title: "Components/UI/Card",
  component: BudgetCard,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    icon: { control: false },
    collapsible: { control: "boolean" },
    collapsed: { control: "boolean" }
  },
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetCard>;

export const Default: Story = {
  args: {
    title: "Titre de section"
  },
  render: (args) => ({
    components: { BudgetCard },
    setup: () => ({ args }),
    template: `
      <BudgetCard v-bind="args">
        <p class="text-sm text-slate-600 dark:text-slate-400">Contenu</p>
      </BudgetCard>
    `
  })
};

export const SansTitre: Story = {
  args: {
    title: ""
  },
  render: (args) => ({
    components: { BudgetCard },
    setup: () => ({ args }),
    template: `
      <BudgetCard v-bind="args">
        <p class="text-sm text-slate-600 dark:text-slate-400">Contenu</p>
      </BudgetCard>
    `
  })
};

export const AvecIcone: Story = {
  args: {
    title: "Budget"
  },
  render: (args) => ({
    components: { BudgetCard, BudgetIcon },
    setup: () => ({ args }),
    template: `
      <BudgetCard v-bind="args">
        <template #icon>
          <BudgetIcon status="status-info" />
        </template>
        <p class="text-sm text-slate-600 dark:text-slate-400">Contenu</p>
      </BudgetCard>
    `
  })
};

export const Repliable: Story = {
  args: {
    title: "Section repliable",
    collapsible: true,
    collapsed: false
  },
  render: (args) => ({
    components: { BudgetCard, BudgetIcon },
    setup: () => ({ args }),
    template: `
      <BudgetCard v-bind="args">
        <template #icon>
          <BudgetIcon status="status-info" />
        </template>
        <p class="text-sm text-slate-600 dark:text-slate-400">Contenu</p>
      </BudgetCard>
    `
  })
};

export const Repliee: Story = {
  args: {
    title: "Section repliee",
    collapsible: true,
    collapsed: true
  },
  render: (args) => ({
    components: { BudgetCard },
    setup: () => ({ args }),
    template: `
      <BudgetCard v-bind="args">
        <p class="text-sm text-slate-600 dark:text-slate-400">Contenu</p>
      </BudgetCard>
    `
  })
};
