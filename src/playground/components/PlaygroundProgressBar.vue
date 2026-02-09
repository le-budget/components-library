<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetProgressBar from "../../components/BudgetProgressBar/BudgetProgressBar.vue";

const progressCollapsed = ref(true);
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
  <BudgetCard title="Progress Bar" collapsible v-model:collapsed="progressCollapsed">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Animation</span>
        <div class="grid gap-3">
          <BudgetProgressBar
            :value="animatedValue"
            :color="steppedColor"
            :display-value="true"
            display-value-position="topRight"
            :animation-duration="900"
            :thickness="12"
          />
          <div class="flex items-center gap-3">
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
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Couleurs</span>
        <div class="grid gap-3">
          <BudgetProgressBar :value="20" color="primary" />
          <BudgetProgressBar :value="40" color="neutral" />
          <BudgetProgressBar :value="60" color="success" />
          <BudgetProgressBar :value="80" color="warning" />
          <BudgetProgressBar :value="100" color="error" />
        </div>
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Epaisseur</span>
        <div class="grid gap-3">
          <BudgetProgressBar :value="72" :thickness="6" />
          <BudgetProgressBar :value="72" :thickness="10" />
          <BudgetProgressBar :value="72" :thickness="16" />
        </div>
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Position de la valeur
        </span>
        <div class="grid gap-4">
          <BudgetProgressBar :value="65" :display-value="true" display-value-position="onBar" />
          <BudgetProgressBar :value="65" :display-value="true" display-value-position="top" />
          <BudgetProgressBar :value="65" :display-value="true" display-value-position="topLeft" />
          <BudgetProgressBar :value="65" :display-value="true" display-value-position="topRight" />
          <BudgetProgressBar :value="65" :display-value="true" display-value-position="bottom" />
          <BudgetProgressBar
            :value="65"
            :display-value="true"
            display-value-position="bottomLeft"
          />
          <BudgetProgressBar
            :value="65"
            :display-value="true"
            display-value-position="bottomRight"
          />
        </div>
      </div>
    </div>
  </BudgetCard>
</template>
