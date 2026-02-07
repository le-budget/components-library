import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetToolbar from "../../src/components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItem from "../../src/components/BudgetToolbarItem/BudgetToolbarItem.vue";
import BudgetToolbarItemButton from "../../src/components/BudgetToolbarItemButton/BudgetToolbarItemButton.vue";
import BudgetToolbarItemSeparator from "../../src/components/BudgetToolbarItemSeparator/BudgetToolbarItemSeparator.vue";
import doc from "../../docs/BudgetToolbarItemSeparator/BudgetToolbarItemSeparator.md?raw";

const meta: Meta<typeof BudgetToolbarItemSeparator> = {
  title: "Components/Layout/Toolbar Item Separator",
  component: BudgetToolbarItemSeparator,
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

type Story = StoryObj<typeof BudgetToolbarItemSeparator>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetToolbar,
      BudgetToolbarItem,
      BudgetToolbarItemButton,
      BudgetToolbarItemSeparator
    },
    template: `
      <BudgetToolbar label="Separator">
        <BudgetToolbarItem><BudgetToolbarItemButton>A</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem><BudgetToolbarItemButton>B</BudgetToolbarItemButton></BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};

export const VerticalToolbar: Story = {
  render: () => ({
    components: {
      BudgetToolbar,
      BudgetToolbarItem,
      BudgetToolbarItemButton,
      BudgetToolbarItemSeparator
    },
    template: `
      <BudgetToolbar label="Separator vertical" orientation="vertical">
        <BudgetToolbarItem><BudgetToolbarItemButton>A</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem><BudgetToolbarItemButton>B</BudgetToolbarItemButton></BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};
