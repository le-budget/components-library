<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetDialog from "../../components/BudgetDialog/BudgetDialog.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

type DialogMix = {
  label: string;
  color: "neutral" | "primary" | "success" | "warning" | "error";
  maxWidthClass: string;
};

const dialogCollapsed = ref(true);
const controlledOpen = ref(false);
const mixes: DialogMix[] = [
  { label: "Neutral / sm", color: "neutral", maxWidthClass: "max-w-lg" },
  { label: "Primary / md", color: "primary", maxWidthClass: "max-w-[44rem]" },
  { label: "Success / lg", color: "success", maxWidthClass: "max-w-4xl" },
  { label: "Warning / xl", color: "warning", maxWidthClass: "max-w-[68rem]" },
  { label: "Error / 2xl", color: "error", maxWidthClass: "max-w-7xl" }
];
const selectedMix = ref<DialogMix>(mixes[0]);

function openWithMix(mix: DialogMix) {
  selectedMix.value = mix;
  controlledOpen.value = true;
}
</script>

<template>
  <BudgetCard title="Dialog" collapsible v-model:collapsed="dialogCollapsed">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <BudgetButton
        v-for="mix in mixes"
        :key="mix.label"
        size="sm"
        color="secondary"
        @click="openWithMix(mix)"
      >
        {{ mix.label }}
      </BudgetButton>
    </div>

    <BudgetDialog
      v-model:open="controlledOpen"
      :title="'Preset: ' + selectedMix.label"
      :color="selectedMix.color"
      :max-width-class="selectedMix.maxWidthClass"
      :close-on-overlay="true"
    >
      <template #icon>
        <BudgetIcon status="status-warning" decorative />
      </template>
      <div class="grid gap-2 text-sm">
        <p>Exemple de dialog avec overlay noir semi-transparent.</p>
        <p>Preset actif: {{ selectedMix.label }}</p>
        <p>Le footer est rendu via un slot dedie.</p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BudgetButton size="sm" color="secondary" @click="controlledOpen = false">Annuler</BudgetButton>
          <BudgetButton size="sm" color="primary-warning" @click="controlledOpen = false">Confirmer</BudgetButton>
        </div>
      </template>
    </BudgetDialog>
  </BudgetCard>
</template>
