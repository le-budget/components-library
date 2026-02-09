import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetAlert from "../../src/components/BudgetAlert/BudgetAlert.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetAlert/BudgetAlert.md?raw";

const meta: Meta<typeof BudgetAlert> = {
  title: "Components/Feedback/Alert",
  component: BudgetAlert,
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

type Story = StoryObj<typeof BudgetAlert>;

export const Default: Story = {
  args: {
    text: "Cette information est importante.",
    color: "primary",
    size: "md"
  }
};

export const Dismissible: Story = {
  args: {
    text: "Vous pouvez fermer cette alerte.",
    dismissible: true,
    color: "secondary"
  }
};

export const AutoDismissFade: Story = {
  args: {
    text: "Cette alerte disparait automatiquement apres 3 secondes.",
    color: "primary-success",
    autoDismiss: true,
    dismissAfter: 3000
  }
};

export const WithIcons: Story = {
  args: {
    text: "Alerte avec icones a gauche et a droite.",
    color: "primary-warning"
  },
  render: (args) => ({
    components: { BudgetAlert, BudgetIcon },
    setup: () => ({ args }),
    template: `
      <BudgetAlert v-bind="args">
        <template #prefix>
          <BudgetIcon status="status-warning" size="md" />
        </template>
        Alerte avec icones a gauche et a droite.
        <template #suffix>
          <BudgetIcon status="status-info" size="md" />
        </template>
      </BudgetAlert>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetAlert },
    template: `
      <div class="grid gap-3">
        <BudgetAlert size="sm" text="Alerte petite" />
        <BudgetAlert size="md" text="Alerte moyenne" />
        <BudgetAlert size="lg" text="Alerte grande" />
      </div>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetAlert },
    template: `
      <div class="grid gap-2">
        <BudgetAlert color="primary" text="Primary" />
        <BudgetAlert color="secondary" text="Secondary" />
        <BudgetAlert color="ghost" text="Ghost" />
        <BudgetAlert color="primary-success" text="Primary Success" />
        <BudgetAlert color="secondary-success" text="Secondary Success" />
        <BudgetAlert color="primary-warning" text="Primary Warning" />
        <BudgetAlert color="secondary-warning" text="Secondary Warning" />
        <BudgetAlert color="primary-error" text="Primary Error" />
        <BudgetAlert color="secondary-error" text="Secondary Error" />
      </div>
    `
  })
};
