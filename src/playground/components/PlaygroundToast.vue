<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetToastContainer from "../../components/BudgetToastContainer/BudgetToastContainer.vue";
import { budgetToast } from "../../components/BudgetToast/budgetToast.store";

const toastCollapsed = ref(true);

function pushColor(
  color:
    | "primary"
    | "secondary"
    | "ghost"
    | "primary-success"
    | "secondary-success"
    | "primary-warning"
    | "secondary-warning"
    | "primary-error"
    | "secondary-error",
  duration?: number
) {
  const variant =
    color.includes("success") ? "success" : color.includes("warning") ? "warning" : color.includes("error") ? "error" : "info";

  budgetToast.push({
    title: `Couleur ${color}`,
    description: "Exemple de couleur alignee sur BudgetAlert.",
    variant,
    color,
    duration
  });
}

function pushAllVariants() {
  budgetToast.clear();
  pushColor("primary");
  pushColor("secondary");
  pushColor("ghost");
  pushColor("primary-success");
  pushColor("secondary-success");
  pushColor("primary-warning");
  pushColor("secondary-warning");
  pushColor("primary-error");
  pushColor("secondary-error");
}

function clearToasts() {
  budgetToast.clear();
}
</script>

<template>
  <BudgetCard title="Toast" collapsible v-model:collapsed="toastCollapsed">
    <div class="grid gap-3 sm:grid-cols-2">
      <BudgetButton size="sm" color="primary" class="sm:col-span-2" @click="pushAllVariants">
        Afficher toutes les variantes
      </BudgetButton>
    </div>
    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <BudgetButton size="sm" color="primary" @click="pushColor('primary')">primary</BudgetButton>
      <BudgetButton size="sm" color="secondary" @click="pushColor('secondary')">secondary</BudgetButton>
      <BudgetButton size="sm" color="ghost" @click="pushColor('ghost')">ghost</BudgetButton>
      <BudgetButton size="sm" color="primary-success" @click="pushColor('primary-success')">primary-success</BudgetButton>
      <BudgetButton size="sm" color="secondary-success" @click="pushColor('secondary-success')">secondary-success</BudgetButton>
      <BudgetButton size="sm" color="primary-warning" @click="pushColor('primary-warning')">primary-warning</BudgetButton>
      <BudgetButton size="sm" color="secondary-warning" @click="pushColor('secondary-warning')">secondary-warning</BudgetButton>
      <BudgetButton size="sm" color="primary-error" @click="pushColor('primary-error')">primary-error</BudgetButton>
      <BudgetButton size="sm" color="secondary-error" @click="pushColor('secondary-error')">secondary-error</BudgetButton>
      <BudgetButton size="sm" color="ghost" class="sm:col-span-3" @click="clearToasts">Vider</BudgetButton>
    </div>
    <BudgetToastContainer />
  </BudgetCard>
</template>
