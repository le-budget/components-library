import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetRadialProgress from "../../src/components/BudgetRadialProgress/BudgetRadialProgress.vue";
import doc from "../../docs/BudgetRadialProgress/BudgetRadialProgress.md?raw";

const meta: Meta<typeof BudgetRadialProgress> = {
  title: "Components/Feedback/RadialProgress",
  component: BudgetRadialProgress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    value: 65,
    size: "md",
    color: "primary",
    animated: true,
    animationDuration: 450
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100, step: 1 }
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl", "xxl"]
    },
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "error"]
    },
    strokeWidth: {
      control: { type: "number", min: 1, max: 20, step: 1 }
    },
    animated: {
      control: "boolean"
    },
    animationDuration: {
      control: { type: "number", min: 0, max: 2000, step: 50 }
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetRadialProgress>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetRadialProgress },
    template: `
      <div class="flex items-end gap-4">
        <BudgetRadialProgress :value="65" size="sm" />
        <BudgetRadialProgress :value="65" size="md" />
        <BudgetRadialProgress :value="65" size="lg" />
        <BudgetRadialProgress :value="65" size="xl" />
        <BudgetRadialProgress :value="65" size="xxl" />
      </div>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetRadialProgress },
    template: `
      <div class="flex items-center gap-4">
        <BudgetRadialProgress :value="20" color="primary" size="xl" />
        <BudgetRadialProgress :value="40" color="neutral" size="xl" />
        <BudgetRadialProgress :value="60" color="success" size="xl" />
        <BudgetRadialProgress :value="80" color="warning" size="xl" />
        <BudgetRadialProgress :value="100" color="error" size="xl" />
      </div>
    `
  })
};

export const StepColors: Story = {
  render: () => ({
    components: { BudgetRadialProgress },
    setup() {
      const dynamicColor = {
        steps: [
          { min: 0, color: "error" as const },
          { min: 30, color: "warning" as const },
          { min: 60, color: "success" as const }
        ]
      };

      return { dynamicColor };
    },
    template: `
      <div class="flex items-center gap-4">
        <BudgetRadialProgress :value="15" :color="dynamicColor" size="xl" />
        <BudgetRadialProgress :value="45" :color="dynamicColor" size="xl" />
        <BudgetRadialProgress :value="85" :color="dynamicColor" size="xl" />
      </div>
    `
  })
};

export const StrokeWidth: Story = {
  render: () => ({
    components: { BudgetRadialProgress },
    template: `
      <div class="flex items-center gap-4">
        <BudgetRadialProgress :value="72" size="xl" :stroke-width="3" />
        <BudgetRadialProgress :value="72" size="xl" :stroke-width="6" />
        <BudgetRadialProgress :value="72" size="xl" :stroke-width="10" />
      </div>
    `
  })
};
