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

export const Default: Story = {
  args: {
    status: "status-info"
  }
};

export const Statuses: Story = {
  render: () => ({
    components: { BudgetIcon },
    template: `
      <div class="flex items-center gap-4">
        <BudgetIcon status="status-success" />
        <BudgetIcon status="status-warning" />
        <BudgetIcon status="status-error" />
        <BudgetIcon status="status-info" />
      </div>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetIcon },
    template: `
      <div class="flex items-center gap-4">
        <BudgetIcon status="status-info" color="primary" />
        <BudgetIcon status="status-success" color="success" />
        <BudgetIcon status="status-warning" color="warning" />
        <BudgetIcon status="status-error" color="error" />
        <BudgetIcon status="status-info" color="neutral" />
        <BudgetIcon status="status-info" color="white" />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetIcon },
    template: `
      <div class="flex items-center gap-4">
        <BudgetIcon status="status-info" size="sm" />
        <BudgetIcon status="status-info" size="md" />
        <BudgetIcon status="status-info" size="lg" />
        <BudgetIcon status="status-info" size="xl" />
        <BudgetIcon status="status-info" size="xxl" />
      </div>
    `
  })
};

export const Decorative: Story = {
  args: {
    status: "status-info",
    decorative: true
  }
};
