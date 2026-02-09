<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions
} from "chart.js";
import { Pie } from "vue-chartjs";
import type { BudgetRadioColor } from "../BudgetRadioGroup/radioGroupContext";
import { buildPiePalette, resolveVariantHex } from "../BudgetCharts/chartColors";
import { formatEuroAmount } from "../BudgetCharts/chartFormatters";

defineOptions({
  name: "BudgetPieChart"
});

ChartJS.register(ArcElement, Tooltip, Legend);

type BudgetPieSlice = {
  label: string;
  value: number;
};

const props = withDefaults(
  defineProps<{
    slices: BudgetPieSlice[];
    color?: BudgetRadioColor;
    seriesLabel?: string;
    height?: number;
    showLegend?: boolean;
    loading?: boolean;
    error?: boolean;
    loadingMessage?: string;
    emptyMessage?: string;
    errorMessage?: string;
  }>(),
  {
    color: "primary",
    seriesLabel: "Repartition",
    height: 320,
    showLegend: true,
    loading: false,
    error: false,
    loadingMessage: "Chargement...",
    emptyMessage: "Aucune donnee a afficher.",
    errorMessage: "Une erreur est survenue."
  }
);

const isMobile = ref(false);

const showLoading = computed(() => props.loading);
const showError = computed(() => !props.loading && props.error);
const showEmpty = computed(() => !props.loading && !props.error && props.slices.length === 0);
const chartHeight = computed(() => `${Math.max(props.height, 120)}px`);

const labels = computed(() => props.slices.map((slice) => slice.label));
const values = computed(() => props.slices.map((slice) => slice.value));

const backgroundColors = computed(() => buildPiePalette(props.color, props.slices.length));
const borderColors = computed(() => {
  const border = resolveVariantHex(props.color);
  return props.slices.map(() => border);
});

const chartData = computed<ChartData<"pie">>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: props.seriesLabel,
      data: values.value,
      backgroundColor: backgroundColors.value,
      borderColor: borderColors.value,
      borderWidth: 1
    }
  ]
}));

const chartOptions = computed<ChartOptions<"pie">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: props.showLegend && !isMobile.value,
      position: "bottom"
    },
    tooltip: {
      callbacks: {
        label(context) {
          const label = context.label ? `${context.label}: ` : "";
          return `${label}${formatEuroAmount(context.parsed)}`;
        }
      }
    }
  }
}));

function updateIsMobile() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsMobile);
});
</script>

<template>
  <div class="w-full">
    <div
      v-if="showLoading"
      class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600"
    >
      <slot name="loading">{{ loadingMessage }}</slot>
    </div>

    <div
      v-else-if="showError"
      class="flex min-h-24 items-center justify-center rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      <slot name="error">{{ errorMessage }}</slot>
    </div>

    <div
      v-else-if="showEmpty"
      class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600"
    >
      <slot name="empty">{{ emptyMessage }}</slot>
    </div>

    <div v-else class="w-full" :style="{ height: chartHeight }">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

