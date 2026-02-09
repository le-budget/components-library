<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type ScriptableLineSegmentContext
} from "chart.js";
import { Line } from "vue-chartjs";
import { useChartColorResolver, type BudgetChartColor } from "../BudgetCharts/chartColors";
import {
  formatDayMonth,
  formatEuroAmount,
  shouldDisplayXAxisLabel
} from "../BudgetCharts/chartFormatters";

defineOptions({
  name: "BudgetLineChart"
});

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type BudgetLinePoint = {
  x: string | Date;
  y: number;
};

const props = withDefaults(
  defineProps<{
    points: BudgetLinePoint[];
    color?: BudgetChartColor;
    threshold?: number;
    fill?: boolean;
    smooth?: boolean;
    tension?: number;
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
    threshold: 0,
    fill: false,
    smooth: true,
    tension: 0.3,
    seriesLabel: "Solde",
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

const colorResolver = useChartColorResolver(computed(() => props.color), "BudgetLineChart");

const showLoading = computed(() => props.loading);
const showError = computed(() => !props.loading && props.error);
const showEmpty = computed(() => !props.loading && !props.error && props.points.length === 0);
const chartHeight = computed(() => `${Math.max(props.height, 120)}px`);

const labels = computed(() => props.points.map((point) => formatDayMonth(point.x)));
const values = computed(() => props.points.map((point) => point.y));

const lineColors = computed(() => values.value.map((value) => colorResolver.resolveHex(value)));
const pointBackgroundColors = computed(() => [...lineColors.value]);
const pointBorderColors = computed(() => [...lineColors.value]);
const resolvedTension = computed(() => {
  if (!props.smooth) {
    return 0;
  }
  return Math.min(Math.max(props.tension, 0), 1);
});

const fillConfig = computed(() => {
  if (!props.fill) {
    return false;
  }

  const epsilon = 0.000001;

  return {
    target: { value: props.threshold },
    above: colorResolver.resolveHexWithAlpha(props.threshold + epsilon, 0.2),
    below: colorResolver.resolveHexWithAlpha(props.threshold - epsilon, 0.2)
  };
});

function resolveSegmentBorderColor(context: ScriptableLineSegmentContext) {
  const y0 = Number(context.p0.parsed.y ?? 0);
  const y1 = Number(context.p1.parsed.y ?? 0);
  const color0 = colorResolver.resolveHex(y0);
  const color1 = colorResolver.resolveHex(y1);

  if ((y0 - props.threshold) * (y1 - props.threshold) >= 0 || y0 === y1) {
    return color1;
  }

  const ratio = (props.threshold - y0) / (y1 - y0);
  const split = Math.min(Math.max(ratio, 0), 1);
  const chartWithCtx = context as ScriptableLineSegmentContext & {
    chart: { ctx: CanvasRenderingContext2D };
  };
  const gradient = chartWithCtx.chart.ctx.createLinearGradient(
    context.p0.x,
    context.p0.y,
    context.p1.x,
    context.p1.y
  );

  gradient.addColorStop(0, color0);
  gradient.addColorStop(split, color0);
  gradient.addColorStop(split, color1);
  gradient.addColorStop(1, color1);

  return gradient;
}

const chartData = computed<ChartData<"line">>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: props.seriesLabel,
      data: values.value,
      fill: fillConfig.value,
      borderColor: colorResolver.resolveHex(props.threshold),
      backgroundColor: colorResolver.resolveHexWithAlpha(props.threshold + 0.000001, 0.2),
      pointBackgroundColor: pointBackgroundColors.value,
      pointBorderColor: pointBorderColors.value,
      pointRadius: 3,
      pointHoverRadius: 4,
      tension: resolvedTension.value,
      segment: {
        borderColor(context: ScriptableLineSegmentContext) {
          return resolveSegmentBorderColor(context);
        }
      }
    }
  ]
}));

const chartOptions = computed<ChartOptions<"line">>(() => ({
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
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

