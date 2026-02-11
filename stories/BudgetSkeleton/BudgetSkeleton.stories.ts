import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetSkeleton from "../../src/components/BudgetSkeleton/BudgetSkeleton.vue";
import doc from "../../docs/BudgetSkeleton/BudgetSkeleton.md?raw";

const meta: Meta<typeof BudgetSkeleton> = {
  title: "Components/Feedback/Skeleton",
  component: BudgetSkeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    variant: "text",
    size: "md",
    lines: 3,
    rounded: "md",
    animated: true,
    animation: "pulse",
    ratio: "16:9"
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "rect", "circle", "image"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"]
    },
    animation: {
      control: "select",
      options: ["pulse", "shimmer"]
    },
    ratio: {
      control: "select",
      options: ["1:1", "4:3", "16:9"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetSkeleton>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => ({
    components: { BudgetSkeleton },
    template: `
      <div class="grid max-w-xl gap-4">
        <BudgetSkeleton variant="text" :lines="3" />
        <BudgetSkeleton variant="rect" height="72px" />
        <BudgetSkeleton variant="circle" width="48px" height="48px" />
        <BudgetSkeleton variant="image" ratio="16:9" />
      </div>
    `
  })
};

export const TextSizes: Story = {
  render: () => ({
    components: { BudgetSkeleton },
    template: `
      <div class="grid max-w-xl gap-4">
        <BudgetSkeleton size="sm" :lines="2" />
        <BudgetSkeleton size="md" :lines="2" />
        <BudgetSkeleton size="lg" :lines="2" />
      </div>
    `
  })
};

export const Playground: Story = {
  render: (args) => ({
    components: { BudgetSkeleton },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-xl">
        <BudgetSkeleton v-bind="args" />
      </div>
    `
  })
};
