import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetDivider from "../../src/components/BudgetDivider/BudgetDivider.vue";
import doc from "../../docs/BudgetDivider/BudgetDivider.md?raw";

const meta: Meta<typeof BudgetDivider> = {
  title: "Components/Layout/Divider",
  component: BudgetDivider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    orientation: "horizontal",
    color: "primary",
    lineStyle: "solid",
    thickness: "md"
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "error"]
    },
    lineStyle: {
      control: "inline-radio",
      options: ["solid", "dashed", "dotted"]
    },
    thickness: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetDivider>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    orientation: "vertical"
  },
  render: (args) => ({
    components: { BudgetDivider },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-24 items-stretch gap-4">
        <span class="text-sm">A</span>
        <BudgetDivider v-bind="args" />
        <span class="text-sm">B</span>
      </div>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetDivider },
    template: `
      <div class="flex flex-col gap-4">
        <BudgetDivider color="primary" />
        <BudgetDivider color="neutral" />
        <BudgetDivider color="success" />
        <BudgetDivider color="warning" />
        <BudgetDivider color="error" />
      </div>
    `
  })
};

export const LineStyles: Story = {
  render: () => ({
    components: { BudgetDivider },
    template: `
      <div class="flex flex-col gap-4">
        <BudgetDivider line-style="solid" />
        <BudgetDivider line-style="dashed" />
        <BudgetDivider line-style="dotted" />
      </div>
    `
  })
};

export const Thicknesses: Story = {
  render: () => ({
    components: { BudgetDivider },
    template: `
      <div class="flex flex-col gap-4">
        <BudgetDivider thickness="sm" />
        <BudgetDivider thickness="md" />
        <BudgetDivider thickness="lg" />
      </div>
    `
  })
};
