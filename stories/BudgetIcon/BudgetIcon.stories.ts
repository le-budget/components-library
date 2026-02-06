import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetIcon/BudgetIcon.md?raw";

const meta: Meta<typeof BudgetIcon> = {
  title: "Components/UI/Icon",
  component: BudgetIcon,
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

type Story = StoryObj<typeof BudgetIcon>;

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

export const Colored: Story = {
  args: {
    status: "status-success",
    color: "success"
  }
};
