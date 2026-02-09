<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetLineChart from "../../components/BudgetLineChart/BudgetLineChart.vue";

const collapsed = ref(true);

const points = [
  { x: "2026-01-01", y: 420 },
  { x: "2026-01-02", y: 280 },
  { x: "2026-01-03", y: 95 },
  { x: "2026-01-04", y: -75 },
  { x: "2026-01-05", y: -210 },
  { x: "2026-01-06", y: -120 },
  { x: "2026-01-07", y: 40 },
  { x: "2026-01-08", y: 190 },
  { x: "2026-01-09", y: -30 },
  { x: "2026-01-10", y: 160 }
];

const colorSteps = {
  steps: [
    { min: -100000, color: "error" as const },
    { min: 0, color: "warning" as const },
    { min: 150, color: "success" as const }
  ]
};
</script>

<template>
  <BudgetCard title="Line Chart" collapsible v-model:collapsed="collapsed">
    <div class="grid gap-6">
      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Smooth par defaut (tension 0.3)
        </span>
        <BudgetLineChart
          :points="points"
          :color="colorSteps"
          :threshold="0"
          :fill="true"
          :max-x-axis-labels="6"
          :smooth="true"
          :tension="0.3"
        />
      </div>

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Smooth fort (tension 0.8)
        </span>
        <BudgetLineChart
          :points="points"
          :color="colorSteps"
          :threshold="0"
          :fill="true"
          :max-x-axis-labels="6"
          :smooth="true"
          :tension="0.8"
        />
      </div>

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Sans smooth (tension forcee a 0)
        </span>
        <BudgetLineChart
          :points="points"
          :color="colorSteps"
          :threshold="0"
          :fill="true"
          :max-x-axis-labels="6"
          :smooth="false"
          :tension="0.8"
        />
      </div>
    </div>
  </BudgetCard>
</template>

