<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetBarChart from "../../components/BudgetBarChart/BudgetBarChart.vue";

const collapsed = ref(true);

const points = [
  { x: "2026-01-01", y: 320 },
  { x: "2026-01-02", y: -120 },
  { x: "2026-01-03", y: 180 },
  { x: "2026-01-04", y: -260 },
  { x: "2026-01-05", y: 410 },
  { x: "2026-01-06", y: -80 },
  { x: "2026-01-07", y: 290 },
  { x: "2026-01-08", y: 75 }
];

const colorSteps = {
  steps: [
    { min: -100000, color: "error" as const },
    { min: 0, color: "warning" as const },
    { min: 250, color: "success" as const }
  ]
};
</script>

<template>
  <BudgetCard title="Bar Chart" collapsible v-model:collapsed="collapsed">
    <BudgetBarChart
      :points="points"
      :color="colorSteps"
      series-label="Flux journalier"
      :max-x-axis-labels="5"
    />
  </BudgetCard>
</template>

