import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetToolbar from "../../src/components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItem from "../../src/components/BudgetToolbarItem/BudgetToolbarItem.vue";
import BudgetToolbarItemButton from "../../src/components/BudgetToolbarItemButton/BudgetToolbarItemButton.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetToolbarItemButton/BudgetToolbarItemButton.md?raw";

const meta: Meta<typeof BudgetToolbarItemButton> = {
  title: "Components/Layout/Toolbar Item Button",
  component: BudgetToolbarItemButton,
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

type Story = StoryObj<typeof BudgetToolbarItemButton>;

export const Default: Story = {
  render: () => ({
    components: { BudgetToolbar, BudgetToolbarItem, BudgetToolbarItemButton },
    template: `
      <BudgetToolbar label="Default">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton>Action</BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetToolbar, BudgetToolbarItem, BudgetToolbarItemButton },
    template: `
      <BudgetToolbar label="Colors" wrap>
        <BudgetToolbarItem><BudgetToolbarItemButton color="primary">Primary</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="secondary">Secondary</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="ghost">Ghost</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="primary-success">Primary Success</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="secondary-success">Secondary Success</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="primary-warning">Primary Warning</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="secondary-warning">Secondary Warning</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="primary-error">Primary Error</BudgetToolbarItemButton></BudgetToolbarItem>
        <BudgetToolbarItem><BudgetToolbarItemButton color="secondary-error">Secondary Error</BudgetToolbarItemButton></BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};

export const Icons: Story = {
  render: () => ({
    components: { BudgetToolbar, BudgetToolbarItem, BudgetToolbarItemButton, BudgetIcon },
    template: `
      <BudgetToolbar label="Icons">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton aria-label="Ajouter">
            <template #icon><BudgetIcon status="status-info" decorative /></template>
          </BudgetToolbarItemButton>
        </BudgetToolbarItem>
        <BudgetToolbarItem>
          <BudgetToolbarItemButton>
            <template #icon><BudgetIcon status="status-success" decorative /></template>
            Confirmer
          </BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};
