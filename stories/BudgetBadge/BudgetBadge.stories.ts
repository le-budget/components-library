import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetBadge from "../../src/components/BudgetBadge/BudgetBadge.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
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

export const Colors: Story = {
  render: () => ({
    components: { BudgetBadge },
    template: `
      <div class="flex flex-wrap gap-2">
        <BudgetBadge text="Primary" color="primary" />
        <BudgetBadge text="Secondary" color="secondary" />
        <BudgetBadge text="Ghost" color="ghost" />
        <BudgetBadge text="Success" color="success" />
        <BudgetBadge text="Warning" color="warning" />
        <BudgetBadge text="Error" color="error" />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetBadge },
    template: `
      <div class="grid gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <BudgetBadge text="XS Primary" size="xs" color="primary" />
          <BudgetBadge text="XS Secondary" size="xs" color="secondary" />
          <BudgetBadge text="XS Ghost" size="xs" color="ghost" />
          <BudgetBadge text="XS Success" size="xs" color="success" />
          <BudgetBadge text="XS Warning" size="xs" color="warning" />
          <BudgetBadge text="XS Error" size="xs" color="error" />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <BudgetBadge text="MD Primary" size="md" color="primary" />
          <BudgetBadge text="MD Secondary" size="md" color="secondary" />
          <BudgetBadge text="MD Ghost" size="md" color="ghost" />
          <BudgetBadge text="MD Success" size="md" color="success" />
          <BudgetBadge text="MD Warning" size="md" color="warning" />
          <BudgetBadge text="MD Error" size="md" color="error" />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <BudgetBadge text="LG Primary" size="lg" color="primary" />
          <BudgetBadge text="LG Secondary" size="lg" color="secondary" />
          <BudgetBadge text="LG Ghost" size="lg" color="ghost" />
          <BudgetBadge text="LG Success" size="lg" color="success" />
          <BudgetBadge text="LG Warning" size="lg" color="warning" />
          <BudgetBadge text="LG Error" size="lg" color="error" />
        </div>
      </div>
    `
  })
};

export const Icons: Story = {
  render: () => ({
    components: { BudgetBadge, BudgetIcon },
    template: `
      <div class="grid gap-3">
        <div class="flex flex-wrap gap-2">
          <BudgetBadge text="XS Left" size="xs">
            <template #icon>
              <BudgetIcon status="status-info" size="sm" />
            </template>
          </BudgetBadge>
          <BudgetBadge text="XS Right" size="xs">
            <template #iconRight>
              <BudgetIcon status="status-success" size="sm" />
            </template>
          </BudgetBadge>
          <BudgetBadge text="XS Both" size="xs">
            <template #icon>
              <BudgetIcon status="status-info" size="sm" />
            </template>
            <template #iconRight>
              <BudgetIcon status="status-success" size="sm" />
            </template>
          </BudgetBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <BudgetBadge text="MD Left" size="md">
            <template #icon>
              <BudgetIcon status="status-info" size="md" />
            </template>
          </BudgetBadge>
          <BudgetBadge text="MD Right" size="md">
            <template #iconRight>
              <BudgetIcon status="status-success" size="md" />
            </template>
          </BudgetBadge>
          <BudgetBadge text="MD Both" size="md">
            <template #icon>
              <BudgetIcon status="status-info" size="md" />
            </template>
            <template #iconRight>
              <BudgetIcon status="status-success" size="md" />
            </template>
          </BudgetBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <BudgetBadge text="LG Left" size="lg">
            <template #icon>
              <BudgetIcon status="status-info" size="lg" />
            </template>
          </BudgetBadge>
          <BudgetBadge text="LG Right" size="lg">
            <template #iconRight>
              <BudgetIcon status="status-success" size="lg" />
            </template>
          </BudgetBadge>
          <BudgetBadge text="LG Both" size="lg">
            <template #icon>
              <BudgetIcon status="status-info" size="lg" />
            </template>
            <template #iconRight>
              <BudgetIcon status="status-success" size="lg" />
            </template>
          </BudgetBadge>
        </div>
      </div>
    `
  })
};
