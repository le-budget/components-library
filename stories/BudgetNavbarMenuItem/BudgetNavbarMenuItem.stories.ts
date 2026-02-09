import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetNavbarMenu from "../../src/components/BudgetNavbarMenu/BudgetNavbarMenu.vue";
import BudgetNavbarMenuItem from "../../src/components/BudgetNavbarMenuItem/BudgetNavbarMenuItem.vue";
import doc from "../../docs/BudgetNavbarMenuItem/BudgetNavbarMenuItem.md?raw";

const meta: Meta<typeof BudgetNavbarMenuItem> = {
  title: "Components/Layout/Navbar Menu Item",
  component: BudgetNavbarMenuItem,
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

type Story = StoryObj<typeof BudgetNavbarMenuItem>;

export const States: Story = {
  render: () => ({
    components: { BudgetNavbarMenu, BudgetNavbarMenuItem },
    template: `
      <BudgetNavbarMenu>
        <BudgetNavbarMenuItem>
          <a href="#" class="w-full">Normal</a>
        </BudgetNavbarMenuItem>
        <BudgetNavbarMenuItem active>
          <a href="#" class="w-full">Actif</a>
        </BudgetNavbarMenuItem>
        <BudgetNavbarMenuItem disabled>
          <a href="#" class="w-full">Desactive</a>
        </BudgetNavbarMenuItem>
      </BudgetNavbarMenu>
    `
  })
};