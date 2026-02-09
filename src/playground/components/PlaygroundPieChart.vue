<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetPieChart from "../../components/BudgetPieChart/BudgetPieChart.vue";

const collapsed = ref(true);

const slices = [
  { label: "Logement", value: 920 },
  { label: "Alimentation", value: 430 },
  { label: "Transport", value: 160 },
  { label: "Charges", value: 270 },
  { label: "Loisirs", value: 210 }
];
</script>

<template>
  <BudgetCard title="Pie Chart" collapsible v-model:collapsed="collapsed">
    <BudgetPieChart :slices="slices" color="primary" series-label="Depenses mensuelles" />
  </BudgetCard>
</template>

