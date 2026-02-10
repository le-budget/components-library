<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetDrawer from "../../components/BudgetDrawer/BudgetDrawer.vue";

type DrawerMix = {
  label: string;
  borderColor: "neutral" | "primary" | "success" | "warning" | "error";
  borderThickness: "none" | "sm" | "md" | "lg";
};

const drawerCollapsed = ref(true);
const rightOpen = ref(false);
const leftOpen = ref(false);
const mixOpen = ref(false);
const mixes: DrawerMix[] = [
  { label: "Neutral sm", borderColor: "neutral", borderThickness: "sm" },
  { label: "Primary md", borderColor: "primary", borderThickness: "md" },
  { label: "Success lg", borderColor: "success", borderThickness: "lg" },
  { label: "Warning md", borderColor: "warning", borderThickness: "md" },
  { label: "Error sm", borderColor: "error", borderThickness: "sm" }
] ;
const selectedMix = ref<DrawerMix>(mixes[0]);

function openMixDrawer(mix: DrawerMix) {
  selectedMix.value = mix;
  mixOpen.value = true;
}
</script>

<template>
  <BudgetCard title="Drawer" collapsible v-model:collapsed="drawerCollapsed">
    <div class="grid gap-3 sm:grid-cols-2">
      <BudgetButton size="sm" @click="rightOpen = true">Ouvrir a droite</BudgetButton>
      <BudgetButton size="sm" color="secondary" @click="leftOpen = true">Ouvrir a gauche</BudgetButton>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <BudgetButton
        v-for="mix in mixes"
        :key="mix.label"
        size="sm"
        color="secondary"
        @click="openMixDrawer(mix)"
      >
        {{ mix.label }}
      </BudgetButton>
    </div>

    <BudgetDrawer
      v-model="rightOpen"
      title="Filtres"
      icon="status-info"
      placement="right"
      border-color="neutral"
      border-thickness="sm"
    >
      <div class="grid gap-2 text-sm">
        <p>Exemple de drawer a droite avec bordure neutre.</p>
        <p>Le contenu est rendu via le slot par defaut.</p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BudgetButton size="sm" color="secondary" @click="rightOpen = false">Fermer</BudgetButton>
          <BudgetButton size="sm" @click="rightOpen = false">Valider</BudgetButton>
        </div>
      </template>
    </BudgetDrawer>

    <BudgetDrawer
      v-model="leftOpen"
      title="Navigation"
      placement="left"
      border-color="primary"
      border-thickness="md"
    >
      <div class="grid gap-2 text-sm">
        <p>Exemple de drawer a gauche avec bordure plus epaisse.</p>
      </div>
    </BudgetDrawer>

    <BudgetDrawer
      v-model="mixOpen"
      :title="'Mix: ' + selectedMix.label"
      placement="right"
      :border-color="selectedMix.borderColor"
      :border-thickness="selectedMix.borderThickness"
    >
      <div class="grid gap-2 text-sm">
        <p>Exemple de mix couleur + epaisseur.</p>
        <p>Variante active: {{ selectedMix.label }}</p>
      </div>
    </BudgetDrawer>
  </BudgetCard>
</template>
