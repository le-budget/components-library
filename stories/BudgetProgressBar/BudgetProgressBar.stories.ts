import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetProgressBar from "../../src/components/BudgetProgressBar/BudgetProgressBar.vue";
import doc from "../../docs/BudgetProgressBar/BudgetProgressBar.md?raw";

const meta: Meta<typeof BudgetProgressBar> = {
  title: "Components/Feedback/ProgressBar",
  component: BudgetProgressBar,
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
    color: "primary",
    thickness: 10,
    animated: true,
    animationDuration: 450,
    displayValue: false,
    displayValuePosition: "onBar"
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100, step: 1 }
    },
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "error"]
    },
    thickness: {
      control: { type: "number", min: 2, max: 48, step: 1 }
    },
    animated: {
      control: "boolean"
    },
    animationDuration: {
      control: { type: "number", min: 0, max: 2000, step: 50 }
    },
    displayValue: {
      control: "boolean"
    },
    displayValuePosition: {
      control: "select",
      options: [
        "onBar",
        "top",
        "bottom",
        "topLeft",
        "topRight",
        "bottomLeft",
        "bottomRight"
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetProgressBar>;

export const Default: Story = {};

export const Thickness: Story = {
  render: () => ({
    components: { BudgetProgressBar },
    template: `
      <div class="grid w-full max-w-xl gap-4">
        <BudgetProgressBar :value="72" :thickness="6" />
        <BudgetProgressBar :value="72" :thickness="10" />
        <BudgetProgressBar :value="72" :thickness="16" />
      </div>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetProgressBar },
    template: `
      <div class="grid w-full max-w-xl gap-3">
        <BudgetProgressBar :value="20" color="primary" />
        <BudgetProgressBar :value="40" color="neutral" />
        <BudgetProgressBar :value="60" color="success" />
        <BudgetProgressBar :value="80" color="warning" />
        <BudgetProgressBar :value="100" color="error" />
      </div>
    `
  })
};

export const StepColors: Story = {
  render: () => ({
    components: { BudgetProgressBar },
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
      <div class="grid w-full max-w-xl gap-3">
        <BudgetProgressBar :value="15" :color="dynamicColor" />
        <BudgetProgressBar :value="45" :color="dynamicColor" />
        <BudgetProgressBar :value="85" :color="dynamicColor" />
      </div>
    `
  })
};

export const ValuePositions: Story = {
  render: () => ({
    components: { BudgetProgressBar },
    template: `
      <div class="grid w-full max-w-xl gap-4">
        <BudgetProgressBar :value="65" :display-value="true" display-value-position="onBar" />
        <BudgetProgressBar :value="65" :display-value="true" display-value-position="top" />
        <BudgetProgressBar :value="65" :display-value="true" display-value-position="topLeft" />
        <BudgetProgressBar :value="65" :display-value="true" display-value-position="topRight" />
        <BudgetProgressBar :value="65" :display-value="true" display-value-position="bottom" />
        <BudgetProgressBar :value="65" :display-value="true" display-value-position="bottomLeft" />
        <BudgetProgressBar :value="65" :display-value="true" display-value-position="bottomRight" />
      </div>
    `
  })
};
