<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetRadialProgress from "../../components/BudgetRadialProgress/BudgetRadialProgress.vue";

const radialCollapsed = ref(true);
const animatedValue = ref(42);
const steppedColor = {
  steps: [
    { min: 0, color: "error" as const },
    { min: 30, color: "warning" as const },
    { min: 60, color: "success" as const }
  ]
};

function setRandomValue() {
  animatedValue.value = Math.floor(Math.random() * 101);
}
</script>

<template>
  <BudgetCard title="Radial Progress" collapsible v-model:collapsed="radialCollapsed">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Animation</span>
        <div class="flex items-center gap-4">
          <BudgetRadialProgress
            :value="animatedValue"
            size="xxl"
            :color="steppedColor"
            :animation-duration="900"
          />
          <div class="flex flex-col gap-2">
            <span class="text-sm text-slate-600">Valeur: {{ animatedValue }}%</span>
            <span class="text-xs text-slate-500">0+ error, 30+ warning, 60+ success</span>
            <BudgetButton color="secondary" size="sm" @click="setRandomValue">
              Valeur aleatoire
            </BudgetButton>
          </div>
        </div>
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Tailles</span>
        <div class="flex items-end gap-4">
          <BudgetRadialProgress :value="65" size="sm" />
          <BudgetRadialProgress :value="65" size="md" />
          <BudgetRadialProgress :value="65" size="lg" />
          <BudgetRadialProgress :value="65" size="xl" />
          <BudgetRadialProgress :value="65" size="xxl" />
        </div>
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Couleurs</span>
        <div class="flex items-center gap-4">
          <BudgetRadialProgress :value="20" color="primary" size="xl" />
          <BudgetRadialProgress :value="40" color="neutral" size="xl" />
          <BudgetRadialProgress :value="60" color="success" size="xl" />
          <BudgetRadialProgress :value="80" color="warning" size="xl" />
          <BudgetRadialProgress :value="100" color="error" size="xl" />
        </div>
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Epaisseur</span>
        <div class="flex items-center gap-4">
          <BudgetRadialProgress :value="72" size="xl" :stroke-width="3" />
          <BudgetRadialProgress :value="72" size="xl" :stroke-width="6" />
          <BudgetRadialProgress :value="72" size="xl" :stroke-width="10" />
        </div>
      </div>
    </div>
  </BudgetCard>
</template>
