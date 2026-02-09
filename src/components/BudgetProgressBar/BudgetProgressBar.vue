<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { BudgetRadioColor } from "../BudgetRadioGroup/radioGroupContext";

defineOptions({
  name: "BudgetProgressBar"
});

type BudgetProgressBarColorStep = {
  min: number;
  color: BudgetRadioColor;
};

type BudgetProgressBarColorConfig = {
  steps: BudgetProgressBarColorStep[];
};

type BudgetProgressBarColor = BudgetRadioColor | BudgetProgressBarColorConfig;

type BudgetProgressBarValuePosition =
  | "onBar"
  | "top"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

const props = withDefaults(
  defineProps<{
    value: number;
    color?: BudgetProgressBarColor;
    thickness?: number;
    animated?: boolean;
    animationDuration?: number;
    displayValue?: boolean;
    displayValuePosition?: BudgetProgressBarValuePosition;
  }>(),
  {
    color: "primary",
    thickness: 8,
    animated: true,
    animationDuration: 450,
    displayValue: false,
    displayValuePosition: "onBar"
  }
);

const normalizedValue = computed(() => Math.min(Math.max(props.value, 0), 100));
const displayedValue = ref(normalizedValue.value);

let frameId: number | null = null;
let warnedNoMatchForCurrentConfig = false;

function isColorConfig(
  color: BudgetProgressBarColor
): color is BudgetProgressBarColorConfig {
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
        "[BudgetProgressBar] Duplicate color steps detected. The last declared step for a given min value will be used."
      );
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  stopAnimation();
});

const resolvedThicknessPx = computed(() => Math.min(Math.max(props.thickness, 2), 48));
const trackStyle = computed(() => ({
  height: `${resolvedThicknessPx.value}px`
}));

const fillStyle = computed(() => ({
  width: `${displayedValue.value}%`
}));

const valueLabel = computed(() => `${Math.round(displayedValue.value)}%`);
const showValueLabel = computed(() => props.displayValue);
const isOnBarLabel = computed(
  () => showValueLabel.value && props.displayValuePosition === "onBar"
);
const isTopLabel = computed(
  () =>
    showValueLabel.value &&
    (props.displayValuePosition === "top" ||
      props.displayValuePosition === "topLeft" ||
      props.displayValuePosition === "topRight")
);
const isBottomLabel = computed(
  () =>
    showValueLabel.value &&
    (props.displayValuePosition === "bottom" ||
      props.displayValuePosition === "bottomLeft" ||
      props.displayValuePosition === "bottomRight")
);

const topLabelAlignmentClass = computed(() => {
  switch (props.displayValuePosition) {
    case "topLeft":
      return "justify-start";
    case "topRight":
      return "justify-end";
    case "top":
    default:
      return "justify-center";
  }
});

const bottomLabelAlignmentClass = computed(() => {
  switch (props.displayValuePosition) {
    case "bottomLeft":
      return "justify-start";
    case "bottomRight":
      return "justify-end";
    case "bottom":
    default:
      return "justify-center";
  }
});

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
      "[BudgetProgressBar] No color step matched the current value. Falling back to 'neutral'."
    );
    warnedNoMatchForCurrentConfig = true;
  }
  return "neutral";
});

const progressColorClass = computed(() => {
  switch (resolvedColor.value) {
    case "neutral":
      return "bg-slate-500 dark:bg-slate-500";
    case "success":
      return "bg-c-green-dark dark:bg-c-black-success";
    case "warning":
      return "bg-c-orange-dark dark:bg-c-black-warning";
    case "error":
      return "bg-c-red-dark dark:bg-c-black-error";
    case "primary":
    default:
      return "bg-c-blue-dark dark:bg-c-black";
  }
});
</script>

<template>
  <div class="w-full">
    <div
      v-show="isTopLabel"
      class="mb-1 flex text-xs font-medium leading-none text-slate-700 dark:text-slate-200"
      :class="topLabelAlignmentClass"
    >
      <span v-if="isTopLabel">{{ valueLabel }}</span>
    </div>

    <div
      role="progressbar"
      class="relative w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
      :style="trackStyle"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="Math.round(normalizedValue)"
    >
      <div
        class="h-full rounded-full transition-[width] duration-300 ease-out"
        :class="progressColorClass"
        :style="fillStyle"
      />

      <span
        v-if="isOnBarLabel"
        class="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium leading-none text-white"
      >
        {{ valueLabel }}
      </span>
    </div>

    <div
      v-show="isBottomLabel"
      class="mt-1 flex text-xs font-medium leading-none text-slate-700 dark:text-slate-200"
      :class="bottomLabelAlignmentClass"
    >
      <span v-if="isBottomLabel">{{ valueLabel }}</span>
    </div>
  </div>
</template>
