import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetStatus from "../../src/components/BudgetStatus/BudgetStatus.vue";
import doc from "../../docs/BudgetStatus/BudgetStatus.md?raw";

const meta: Meta<typeof BudgetStatus> = {
  title: "Components/Feedback/Status",
  component: BudgetStatus,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    color: "primary",
    size: "md",
    animation: null,
    label: "Primary status"
  },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "error"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl", "xxl"]
    },
    animation: {
      control: "select",
      options: [null, "bounce", "pulse", "ping"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetStatus>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => ({
    components: { BudgetStatus },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <BudgetStatus color="primary" label="Primary status" />
        <BudgetStatus color="neutral" label="Neutral status" />
        <BudgetStatus color="success" label="Success status" />
        <BudgetStatus color="warning" label="Warning status" />
        <BudgetStatus color="error" label="Error status" />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetStatus },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <BudgetStatus size="sm" label="Small status" />
        <BudgetStatus size="md" label="Medium status" />
        <BudgetStatus size="lg" label="Large status" />
        <BudgetStatus size="xl" label="Extra large status" />
        <BudgetStatus size="xxl" label="2X large status" />
      </div>
    `
  })
};

export const Animations: Story = {
  render: () => ({
    components: { BudgetStatus },
    template: `
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-2">
          <BudgetStatus animation="bounce" label="Bounce status" />
          <span class="text-sm text-slate-700 dark:text-slate-200">Bounce</span>
        </div>
        <div class="flex items-center gap-2">
          <BudgetStatus animation="pulse" label="Pulse status" />
          <span class="text-sm text-slate-700 dark:text-slate-200">Pulse</span>
        </div>
        <div class="flex items-center gap-2">
          <BudgetStatus animation="ping" label="Ping status" />
          <span class="text-sm text-slate-700 dark:text-slate-200">Ping</span>
        </div>
      </div>
    `
  })
};
