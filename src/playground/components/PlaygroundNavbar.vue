<script setup lang="ts">
import { ref } from "vue";
import BudgetBadge from "../../components/BudgetBadge/BudgetBadge.vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetNavbar from "../../components/BudgetNavbar/BudgetNavbar.vue";
import BudgetNavbarMenu from "../../components/BudgetNavbarMenu/BudgetNavbarMenu.vue";
import BudgetNavbarMenuItem from "../../components/BudgetNavbarMenuItem/BudgetNavbarMenuItem.vue";

const navbarCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Navbar" collapsible v-model:collapsed="navbarCollapsed">
    <div class="grid gap-4">
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
          <BudgetNavbarMenuItem>
            <a href="#" class="w-full">Rapports</a>
          </BudgetNavbarMenuItem>
        </BudgetNavbarMenu>

        <template #notifications>
          <BudgetButton size="sm" color="ghost" aria-label="Notifications">
            <span class="mr-2">Notifications</span>
            <BudgetBadge text="2" color="primary" size="sm" />
          </BudgetButton>
        </template>

        <template #user-menu>
          <BudgetButton size="sm" color="secondary">Menu utilisateur</BudgetButton>
        </template>
      </BudgetNavbar>

      <hr class="border-gray-200">

      <BudgetNavbar position="sticky">
        <template #brand>
          <span class="text-sm font-semibold">Budget SaaS</span>
        </template>

        <BudgetNavbarMenu align="center">
          <BudgetNavbarMenuItem active>
            <a href="#" class="w-full">Vue centree</a>
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

      <hr class="border-gray-200">

      <BudgetNavbar :default-open="true">
        <template #brand>
          <span class="text-sm font-semibold">Mobile ouvert</span>
        </template>

        <BudgetNavbarMenu align="right">
          <BudgetNavbarMenuItem active>
            <a href="#" class="w-full">Vue droite</a>
          </BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem>
            <a href="#" class="w-full">Historique</a>
          </BudgetNavbarMenuItem>
          <BudgetNavbarMenuItem disabled>
            <a href="#" class="w-full">Administration</a>
          </BudgetNavbarMenuItem>
        </BudgetNavbarMenu>

        <template #notifications>
          <BudgetButton size="sm" color="ghost" aria-label="Notifications">1</BudgetButton>
        </template>

        <template #user-menu>
          <BudgetButton size="sm" color="secondary">Avatar placeholder</BudgetButton>
        </template>
      </BudgetNavbar>
    </div>
  </BudgetCard>
</template>
