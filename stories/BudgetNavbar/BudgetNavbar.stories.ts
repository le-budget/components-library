import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetNavbar from "../../src/components/BudgetNavbar/BudgetNavbar.vue";
import BudgetNavbarMenu from "../../src/components/BudgetNavbarMenu/BudgetNavbarMenu.vue";
import BudgetNavbarMenuItem from "../../src/components/BudgetNavbarMenuItem/BudgetNavbarMenuItem.vue";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import doc from "../../docs/BudgetNavbar/BudgetNavbar.md?raw";

const meta: Meta<typeof BudgetNavbar> = {
  title: "Components/Layout/Navbar",
  component: BudgetNavbar,
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

type Story = StoryObj<typeof BudgetNavbar>;

export const Default: Story = {
  render: () => ({
    components: { BudgetNavbar, BudgetNavbarMenu, BudgetNavbarMenuItem, BudgetButton },
    template: `
      <BudgetNavbar>
        <template #brand>
          <span class="text-sm font-semibold">Budget SaaS</span>
        </template>

        <BudgetNavbarMenu>
          <BudgetNavbarMenuItem active>
            <a href="#" class="w-full">Tableau de bord</a>
          </BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem>
            <a href="#" class="w-full">Transactions</a>
          </BudgetNavbarMenuItem>
        </BudgetNavbarMenu>

        <template #notifications>
          <BudgetButton size="sm" color="ghost" aria-label="Notifications">2</BudgetButton>
        </template>

        <template #user-menu>
          <BudgetButton size="sm" color="secondary">Profil</BudgetButton>
        </template>
      </BudgetNavbar>
    `
  })
};

export const Sticky: Story = {
  args: {
    position: "sticky"
  },
  render: (args) => ({
    components: { BudgetNavbar, BudgetNavbarMenu, BudgetNavbarMenuItem, BudgetButton },
    setup: () => ({ args }),
    template: `
      <div class="h-60 overflow-auto border border-slate-200">
        <BudgetNavbar v-bind="args">
          <template #brand>
            <span class="text-sm font-semibold">Budget SaaS</span>
          </template>

          <BudgetNavbarMenu>
            <BudgetNavbarMenuItem active>
              <a href="#" class="w-full">Dashboard</a>
            </BudgetNavbarMenuItem>
            <BudgetNavbarMenuItem>
              <a href="#" class="w-full">Budgets</a>
            </BudgetNavbarMenuItem>
          </BudgetNavbarMenu>

          <template #notifications>
            <BudgetButton size="sm" color="ghost" aria-label="Notifications">3</BudgetButton>
          </template>

          <template #user-menu>
            <BudgetButton size="sm" color="secondary">Profil</BudgetButton>
          </template>
        </BudgetNavbar>
        <div class="space-y-4 p-4 text-sm text-slate-600">
          <p v-for="n in 15" :key="n">Contenu {{ n }}</p>
        </div>
      </div>
    `
  })
};

export const DefaultOpenOnMobile: Story = {
  args: {
    defaultOpen: true
  },
  render: (args) => ({
    components: { BudgetNavbar, BudgetNavbarMenu, BudgetNavbarMenuItem, BudgetButton },
    setup: () => ({ args }),
    template: `
      <BudgetNavbar v-bind="args">
        <template #brand>
          <span class="text-sm font-semibold">Budget SaaS</span>
        </template>

        <BudgetNavbarMenu>
          <BudgetNavbarMenuItem active>
            <a href="#" class="w-full">Tableau</a>
          </BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem>
            <a href="#" class="w-full">Rapports</a>
          </BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem disabled>
            <a href="#" class="w-full">Administration</a>
          </BudgetNavbarMenuItem>
        </BudgetNavbarMenu>

        <template #notifications>
          <BudgetButton size="sm" color="ghost" aria-label="Notifications">1</BudgetButton>
        </template>

        <template #user-menu>
          <BudgetButton size="sm" color="secondary">Profil</BudgetButton>
        </template>
      </BudgetNavbar>
    `
  })
};

export const MenuAlignments: Story = {
  render: () => ({
    components: { BudgetNavbar, BudgetNavbarMenu, BudgetNavbarMenuItem, BudgetButton },
    template: `
      <div class="grid gap-4">
        <BudgetNavbar>
          <template #brand>
            <span class="text-sm font-semibold">Budget SaaS</span>
          </template>

          <BudgetNavbarMenu align="left">
            <BudgetNavbarMenuItem active>
              <a href="#" class="w-full">Vue gauche</a>
            </BudgetNavbarMenuItem>
            <BudgetNavbarMenuItem>
              <a href="#" class="w-full">Transactions</a>
            </BudgetNavbarMenuItem>
          </BudgetNavbarMenu>

          <template #notifications>
            <BudgetButton size="sm" color="ghost" aria-label="Notifications">4</BudgetButton>
          </template>

          <template #user-menu>
            <BudgetButton size="sm" color="secondary">Profil</BudgetButton>
          </template>
        </BudgetNavbar>

        <BudgetNavbar>
          <template #brand>
            <span class="text-sm font-semibold">Budget SaaS</span>
          </template>

          <BudgetNavbarMenu align="center">
            <BudgetNavbarMenuItem active>
              <a href="#" class="w-full">Vue centree</a>
            </BudgetNavbarMenuItem>
            <BudgetNavbarMenuItem>
              <a href="#" class="w-full">Transactions</a>
            </BudgetNavbarMenuItem>
          </BudgetNavbarMenu>

          <template #notifications>
            <BudgetButton size="sm" color="ghost" aria-label="Notifications">2</BudgetButton>
          </template>

          <template #user-menu>
            <BudgetButton size="sm" color="secondary">Profil</BudgetButton>
          </template>
        </BudgetNavbar>

        <BudgetNavbar>
          <template #brand>
            <span class="text-sm font-semibold">Budget SaaS</span>
          </template>

          <BudgetNavbarMenu align="right">
            <BudgetNavbarMenuItem active>
              <a href="#" class="w-full">Vue droite</a>
            </BudgetNavbarMenuItem>
            <BudgetNavbarMenuItem>
              <a href="#" class="w-full">Transactions</a>
            </BudgetNavbarMenuItem>
          </BudgetNavbarMenu>

          <template #notifications>
            <BudgetButton size="sm" color="ghost" aria-label="Notifications">1</BudgetButton>
          </template>

          <template #user-menu>
            <BudgetButton size="sm" color="secondary">Profil</BudgetButton>
          </template>
        </BudgetNavbar>
      </div>
    `
  })
};
