import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetBadge from "../../src/components/BudgetBadge/BudgetBadge.vue";
import doc from "../../docs/BudgetBadge/BudgetBadge.md?raw";

const meta: Meta<typeof BudgetBadge> = {
  title: "Components/UI/Badge",
  component: BudgetBadge,
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

type Story = StoryObj<typeof BudgetBadge>;

export const Default: Story = {
  args: {
    text: "Actif"
  }
};

export const CustomColor: Story = {
  args: {
    text: "Archive",
    colorClass: "bg-slate-100 text-slate-700"
  }
};
