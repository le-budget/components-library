<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { BudgetRadioColor } from "../BudgetRadioGroup/radioGroupContext";

defineOptions({
  name: "BudgetRadialProgress"
});

type BudgetRadialProgressSize = "sm" | "md" | "lg" | "xl" | "xxl";
type BudgetRadialProgressColorStep = {
  min: number;
  color: BudgetRadioColor;
};

type BudgetRadialProgressColorConfig = {
  steps: BudgetRadialProgressColorStep[];
};

type BudgetRadialProgressColor = BudgetRadioColor | BudgetRadialProgressColorConfig;

const SIZE_MAP: Record<BudgetRadialProgressSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 64,
  xxl: 92
};

const props = withDefaults(
  defineProps<{
    value: number;
    size?: BudgetRadialProgressSize;
    color?: BudgetRadialProgressColor;
    strokeWidth?: number;
    animated?: boolean;
    animationDuration?: number;
  }>(),
  {
    size: "md",
    color: "primary",
    strokeWidth: undefined,
    animated: true,
    animationDuration: 450
  }
);

const sizePx = computed(() => SIZE_MAP[props.size]);
const normalizedValue = computed(() => Math.min(Math.max(props.value, 0), 100));
const displayedValue = ref(normalizedValue.value);

let frameId: number | null = null;
let warnedNoMatchForCurrentConfig = false;

function isColorConfig(
  color: BudgetRadialProgressColor
): color is BudgetRadialProgressColorConfig {
  return typeof color === "object" && color !== null && "steps" in color;
}

function stopAnimation() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
}

function animateValue(targetValue: number) {
  stopAnimation();

  if (!props.animated || props.animationDuration <= 0) {
    displayedValue.value = targetValue;
    return;
  }

  const startValue = displayedValue.value;
  const delta = targetValue - startValue;
  if (delta === 0) {
    return;
  }

  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }
    const progress = Math.min((timestamp - startTime) / props.animationDuration, 1);
    const easedProgress = 1 - (1 - progress) ** 3;

    displayedValue.value = startValue + delta * easedProgress;

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
      return;
    }

    displayedValue.value = targetValue;
    frameId = null;
  };

  frameId = requestAnimationFrame(step);
}

watch(
  normalizedValue,
  (nextValue) => {
    animateValue(nextValue);
  },
  { immediate: true }
);

watch(
  () => props.color,
  (nextColor) => {
    warnedNoMatchForCurrentConfig = false;
    if (!isColorConfig(nextColor)) {
      return;
    }

    const seen = new Set<number>();
    let hasDuplicate = false;
    for (const step of nextColor.steps) {
      if (seen.has(step.min)) {
        hasDuplicate = true;
        break;
      }
      seen.add(step.min);
    }

    if (hasDuplicate) {
      console.warn(
        "[BudgetRadialProgress] Duplicate color steps detected. The last declared step for a given min value will be used."
      );
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  stopAnimation();
});
const resolvedStrokeWidthPx = computed(() => {
  const maxStroke = Math.max(1, sizePx.value / 2 - 1);
  const defaultStroke = Math.max(2, Math.round(sizePx.value * 0.12));
  const candidate = props.strokeWidth ?? defaultStroke;
  return Math.min(Math.max(candidate, 1), maxStroke);
});
const svgStrokeWidth = computed(() => (resolvedStrokeWidthPx.value * 100) / sizePx.value);
const radius = computed(() => Math.max(0, 50 - svgStrokeWidth.value / 2));
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => circumference.value * (1 - displayedValue.value / 100));
const showValueLabel = computed(() => props.size === "xl" || props.size === "xxl");
const valueLabel = computed(() => `${Math.round(displayedValue.value)}%`);
const wrapperStyle = computed(() => ({
  width: `${sizePx.value}px`,
  height: `${sizePx.value}px`
}));

const valueClass = computed(() => (props.size === "xxl" ? "text-sm" : "text-xs"));

const resolvedColor = computed<BudgetRadioColor>(() => {
  if (!isColorConfig(props.color)) {
    return props.color;
  }

  const sortedSteps = [...props.color.steps].sort((a, b) => a.min - b.min);
  let selectedColor: BudgetRadioColor | null = null;
  for (const step of sortedSteps) {
    if (displayedValue.value >= step.min) {
      selectedColor = step.color;
    }
  }

  if (selectedColor !== null) {
    return selectedColor;
  }

  if (!warnedNoMatchForCurrentConfig) {
    console.warn(
      "[BudgetRadialProgress] No color step matched the current value. Falling back to 'neutral'."
    );
    warnedNoMatchForCurrentConfig = true;
  }
  return "neutral";
});

const progressColorClass = computed(() => {
  switch (resolvedColor.value) {
    case "neutral":
      return "text-slate-500 dark:text-slate-500";
    case "success":
      return "text-c-green-dark dark:text-c-black-success";
    case "warning":
      return "text-c-orange-dark dark:text-c-black-warning";
    case "error":
      return "text-c-red-dark dark:text-c-black-error";
    case "primary":
    default:
      return "text-c-blue-dark dark:text-c-black";
  }
});
</script>

<template>
  <div
    role="progressbar"
    class="relative inline-flex items-center justify-center"
    :style="wrapperStyle"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="Math.round(normalizedValue)"
  >
    <svg
      class="-rotate-90"
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        :r="radius"
        fill="none"
        stroke="currentColor"
        class="text-slate-200 dark:text-slate-700"
        :stroke-width="svgStrokeWidth"
      />
      <circle
        cx="50"
        cy="50"
        :r="radius"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        class="transition-[stroke-dashoffset] duration-300 ease-out"
        :class="progressColorClass"
        :stroke-width="svgStrokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <span
      v-if="showValueLabel"
      class="pointer-events-none absolute font-medium leading-none text-slate-700 dark:text-slate-200"
      :class="valueClass"
    >
      {{ valueLabel }}
    </span>
  </div>
</template>
