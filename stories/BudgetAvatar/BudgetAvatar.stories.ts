import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetAvatar from "../../src/components/BudgetAvatar/BudgetAvatar.vue";
import doc from "../../docs/BudgetAvatar/BudgetAvatar.md?raw";

const meta: Meta<typeof BudgetAvatar> = {
  title: "Components/UI/Avatar",
  component: BudgetAvatar,
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

type Story = StoryObj<typeof BudgetAvatar>;

const sampleImage = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#dbeafe"/>
        <stop offset="100%" stop-color="#93c5fd"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#g)" />
    <circle cx="300" cy="240" r="110" fill="#1e3a8a" opacity="0.85" />
    <rect x="120" y="360" width="360" height="180" rx="90" fill="#1d4ed8" opacity="0.9" />
  </svg>`
)}`;

export const Default: Story = {
  args: {
    image: sampleImage
  }
};

export const Shapes: Story = {
  render: () => ({
    components: { BudgetAvatar },
    setup: () => ({ sampleImage }),
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <BudgetAvatar :image="sampleImage" shape="circle" />
        <BudgetAvatar :image="sampleImage" shape="rounded" />
        <BudgetAvatar :image="sampleImage" shape="square" />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetAvatar },
    setup: () => ({ sampleImage }),
    template: `
      <div class="flex flex-wrap items-end gap-4">
        <BudgetAvatar :image="sampleImage" size="sm" />
        <BudgetAvatar :image="sampleImage" size="md" />
        <BudgetAvatar :image="sampleImage" size="lg" />
        <BudgetAvatar :image="sampleImage" size="xl" />
      </div>
    `
  })
};

export const LargeSizes: Story = {
  render: () => ({
    components: { BudgetAvatar },
    setup: () => ({ sampleImage }),
    template: `
      <div class="grid gap-4">
        <BudgetAvatar :image="sampleImage" size="xxl" />
      </div>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetAvatar },
    setup: () => ({ sampleImage }),
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <BudgetAvatar :image="sampleImage" color="primary" />
        <BudgetAvatar :image="sampleImage" color="secondary" />
        <BudgetAvatar :image="sampleImage" color="ghost" />
        <BudgetAvatar :image="sampleImage" color="primary-success" />
        <BudgetAvatar :image="sampleImage" color="secondary-success" />
        <BudgetAvatar :image="sampleImage" color="primary-warning" />
        <BudgetAvatar :image="sampleImage" color="secondary-warning" />
        <BudgetAvatar :image="sampleImage" color="primary-error" />
        <BudgetAvatar :image="sampleImage" color="secondary-error" />
      </div>
    `
  })
};

export const BorderThickness: Story = {
  render: () => ({
    components: { BudgetAvatar },
    setup: () => ({ sampleImage }),
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <BudgetAvatar :image="sampleImage" thickness="sm" />
        <BudgetAvatar :image="sampleImage" thickness="md" />
        <BudgetAvatar :image="sampleImage" thickness="lg" />
      </div>
    `
  })
};
