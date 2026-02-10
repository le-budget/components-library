<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetToggle from "../../components/BudgetToggle/BudgetToggle.vue";

const toggleCollapsed = ref(true);
const enabled = ref(false);
const colorValue = ref(true);
const sizeSm = ref(true);
const sizeMd = ref(true);
const sizeLg = ref(true);
const sizeXl = ref(true);
const disabledOn = ref(true);
const disabledOff = ref(false);
</script>

<template>
  <BudgetCard title="Toggle" collapsible v-model:collapsed="toggleCollapsed">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Etat</span>
        <BudgetToggle
          v-model="enabled"
          active-text="Actif"
          inactive-text="Inactif"
        />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Couleurs</span>
        <BudgetToggle v-model="colorValue" color="primary" active-text="Primary" />
        <BudgetToggle v-model="colorValue" color="neutral" active-text="Neutral" />
        <BudgetToggle v-model="colorValue" color="success" active-text="Success" />
        <BudgetToggle v-model="colorValue" color="warning" active-text="Warning" />
        <BudgetToggle v-model="colorValue" color="error" active-text="Error" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Tailles</span>
        <BudgetToggle v-model="sizeSm" size="sm" active-text="Small" />
        <BudgetToggle v-model="sizeMd" size="md" active-text="Medium" />
        <BudgetToggle v-model="sizeLg" size="lg" active-text="Large" />
        <BudgetToggle v-model="sizeXl" size="xl" active-text="Extra large" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Disabled</span>
        <BudgetToggle
          v-model="disabledOn"
          disabled
          active-text="Actif (disabled)"
          inactive-text="Inactif (disabled)"
        />
        <BudgetToggle
          v-model="disabledOff"
          disabled
          active-text="Actif (disabled)"
          inactive-text="Inactif (disabled)"
        />
      </div>
    </div>
  </BudgetCard>
</template>
