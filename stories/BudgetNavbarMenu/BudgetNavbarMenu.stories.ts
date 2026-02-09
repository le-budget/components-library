import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetNavbarMenu from "../../src/components/BudgetNavbarMenu/BudgetNavbarMenu.vue";
import BudgetNavbarMenuItem from "../../src/components/BudgetNavbarMenuItem/BudgetNavbarMenuItem.vue";
import doc from "../../docs/BudgetNavbarMenu/BudgetNavbarMenu.md?raw";

const meta: Meta<typeof BudgetNavbarMenu> = {
  title: "Components/Layout/Navbar Menu",
  component: BudgetNavbarMenu,
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

type Story = StoryObj<typeof BudgetNavbarMenu>;

export const Default: Story = {
  render: () => ({
    components: { BudgetNavbarMenu, BudgetNavbarMenuItem },
    template: `
      <BudgetNavbarMenu>
        <BudgetNavbarMenuItem>
          <a href="#" class="w-full">Tableau de bord</a>
        </BudgetNavbarMenuItem>
        <BudgetNavbarMenuItem active>
          <a href="#" class="w-full">Transactions</a>
        </BudgetNavbarMenuItem>
        <BudgetNavbarMenuItem>
          <a href="#" class="w-full">Rapports</a>
        </BudgetNavbarMenuItem>
      </BudgetNavbarMenu>
    `
  })
};

export const Alignments: Story = {
  render: () => ({
    components: { BudgetNavbarMenu, BudgetNavbarMenuItem },
    template: `
      <div class="grid gap-4">
        <BudgetNavbarMenu align="left">
          <BudgetNavbarMenuItem><a href="#" class="w-full">Gauche</a></BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem><a href="#" class="w-full">Item 2</a></BudgetNavbarMenuItem>
        </BudgetNavbarMenu>
        <BudgetNavbarMenu align="center">
          <BudgetNavbarMenuItem><a href="#" class="w-full">Centre</a></BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem><a href="#" class="w-full">Item 2</a></BudgetNavbarMenuItem>
        </BudgetNavbarMenu>
        <BudgetNavbarMenu align="right">
          <BudgetNavbarMenuItem><a href="#" class="w-full">Droite</a></BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem><a href="#" class="w-full">Item 2</a></BudgetNavbarMenuItem>
        </BudgetNavbarMenu>
      </div>
    `
  })
};
