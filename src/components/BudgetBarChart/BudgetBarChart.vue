<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions
} from "chart.js";
import { Bar } from "vue-chartjs";
import { useChartColorResolver, type BudgetChartColor } from "../BudgetCharts/chartColors";
import {
  formatDayMonth,
  formatEuroAmount,
  shouldDisplayXAxisLabel
} from "../BudgetCharts/chartFormatters";

defineOptions({
  name: "BudgetBarChart"
});

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type BudgetBarPoint = {
  x: string | Date;
  y: number;
};

const props = withDefaults(
  defineProps<{
    points: BudgetBarPoint[];
    color?: BudgetChartColor;
    seriesLabel?: string;
    maxXAxisLabels?: number;
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
    seriesLabel: "Montant",
    maxXAxisLabels: 6,
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

const colorResolver = useChartColorResolver(computed(() => props.color), "BudgetBarChart");

const showLoading = computed(() => props.loading);
const showError = computed(() => !props.loading && props.error);
const showEmpty = computed(() => !props.loading && !props.error && props.points.length === 0);
const chartHeight = computed(() => `${Math.max(props.height, 120)}px`);

const labels = computed(() => props.points.map((point) => formatDayMonth(point.x)));
const values = computed(() => props.points.map((point) => point.y));

const barColors = computed(() => values.value.map((value) => colorResolver.resolveHex(value)));

const chartData = computed<ChartData<"bar">>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: props.seriesLabel,
      data: values.value,
      backgroundColor: barColors.value,
      borderColor: barColors.value,
      borderWidth: 1,
      borderRadius: 4
    }
  ]
}));

const chartOptions = computed<ChartOptions<"bar">>(() => ({
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
          const label = context.dataset.label ? `${context.dataset.label}: ` : "";
          return `${label}${formatEuroAmount(Number(context.parsed.y ?? 0))}`;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        maxRotation: isMobile.value ? 50 : 0,
        minRotation: isMobile.value ? 50 : 0,
        callback(_value, index) {
          if (!shouldDisplayXAxisLabel(index, labels.value.length, props.maxXAxisLabels)) {
            return "";
          }

          return labels.value[index] ?? "";
        }
      },
      grid: {
        display: false
      }
    },
    y: {
      ticks: {
        callback(value) {
          return formatEuroAmount(Number(value));
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
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

