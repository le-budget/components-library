import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetToolbar from "../../src/components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItem from "../../src/components/BudgetToolbarItem/BudgetToolbarItem.vue";
import BudgetToolbarItemButton from "../../src/components/BudgetToolbarItemButton/BudgetToolbarItemButton.vue";
import doc from "../../docs/BudgetToolbarItem/BudgetToolbarItem.md?raw";

const meta: Meta<typeof BudgetToolbarItem> = {
  title: "Components/Layout/Toolbar Item",
  component: BudgetToolbarItem,
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

type Story = StoryObj<typeof BudgetToolbarItem>;

export const Default: Story = {
  render: () => ({
    components: { BudgetToolbar, BudgetToolbarItem, BudgetToolbarItemButton },
    template: `
      <BudgetToolbar label="Demo item">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton>Action</BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};
