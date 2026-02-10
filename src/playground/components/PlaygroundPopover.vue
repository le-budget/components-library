<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetPopover from "../../components/BudgetPopover/BudgetPopover.vue";

const popoverCollapsed = ref(true);
const placements: Array<"top" | "bottom" | "left" | "right"> = [
  "top",
  "bottom",
  "left",
  "right"
];
const colors: Array<"neutral" | "primary" | "success" | "warning" | "error"> = [
  "neutral",
  "primary",
  "success",
  "warning",
  "error"
];
</script>

<template>
  <BudgetCard title="Popover" collapsible v-model:collapsed="popoverCollapsed">
    <div class="grid gap-4">
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BudgetPopover
          v-for="placement in placements"
          :key="placement"
          :placement="placement"
          :title="'Placement ' + placement"
          icon="status-question"
          color="primary"
        >
          <template #trigger>
            <BudgetButton size="sm" color="secondary">{{ placement }}</BudgetButton>
          </template>
          Ce popover s'adapte automatiquement a l'espace disponible.
        </BudgetPopover>
      </div>

      <hr class="border-gray-200">

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <BudgetPopover
          v-for="color in colors"
          :key="color"
          :title="'Color ' + color"
          :color="color"
          icon="status-info"
        >
          <template #trigger>
            <BudgetButton size="sm" color="secondary">{{ color }}</BudgetButton>
          </template>
          Exemple de style colore avec titre et icone.
        </BudgetPopover>
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-3">
        <BudgetPopover placement="top" color="neutral">
          <template #trigger>
            <BudgetButton size="sm" color="secondary">Sans titre ni icone</BudgetButton>
          </template>
          Popover minimal sans en-tete.
        </BudgetPopover>
      </div>
    </div>
  </BudgetCard>
</template>
