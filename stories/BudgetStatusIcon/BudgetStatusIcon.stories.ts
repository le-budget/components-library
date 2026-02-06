import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetStatusIcon from "../../src/components/BudgetStatusIcon/BudgetStatusIcon.vue";
import doc from "../../docs/BudgetStatusIcon/BudgetStatusIcon.md?raw";

const meta: Meta<typeof BudgetStatusIcon> = {
  title: "Components/BudgetStatusIcon",
  component: BudgetStatusIcon,
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

type Story = StoryObj<typeof BudgetStatusIcon>;

export const Success: Story = {
  args: {
    status: "status-success"
  }
};

export const Warning: Story = {
  args: {
    status: "status-warning"
  }
};

export const Error: Story = {
  args: {
    status: "status-error"
  }
};

export const Info: Story = {
  args: {
    status: "status-info"
  }
};
