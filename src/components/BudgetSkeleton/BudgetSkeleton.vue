<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "BudgetSkeleton"
});

export type BudgetSkeletonVariant = "text" | "rect" | "circle" | "image";
export type BudgetSkeletonSize = "sm" | "md" | "lg";
export type BudgetSkeletonRounded = "none" | "sm" | "md" | "lg" | "full";
export type BudgetSkeletonAnimation = "pulse" | "shimmer";
export type BudgetSkeletonRatio = "1:1" | "4:3" | "16:9";

const props = withDefaults(
  defineProps<{
    variant?: BudgetSkeletonVariant;
    size?: BudgetSkeletonSize;
    width?: string | number;
    height?: string | number;
    lines?: number;
    rounded?: BudgetSkeletonRounded;
    animated?: boolean;
    animation?: BudgetSkeletonAnimation;
    ratio?: BudgetSkeletonRatio;
  }>(),
  {
    variant: "text",
    size: "md",
    width: undefined,
    height: undefined,
    lines: 1,
    rounded: "md",
    animated: true,
    animation: "pulse",
    ratio: "16:9"
  }
);

function normalizeDimension(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}px`;
  return value;
}

const lineCount = computed(() => {
  if (props.variant !== "text") return 1;

  const parsed = Math.floor(Number(props.lines));
  if (!Number.isFinite(parsed) || parsed < 1) return 1;

  return parsed;
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-3";
    case "md":
      return "h-4";
    case "lg":
      return "h-5";
    default:
      return "h-4";
  }
});

const roundedClass = computed(() => {
  switch (props.rounded) {
    case "none":
      return "rounded-none";
    case "sm":
      return "rounded-sm";
    case "md":
      return "rounded-md";
    case "lg":
      return "rounded-lg";
    case "full":
      return "rounded-full";
    default:
      return "rounded-md";
  }
});

const animationClass = computed(() => {
  if (!props.animated) return "";
  if (props.animation === "shimmer") return "budget-skeleton--shimmer";
  return "animate-pulse";
});

const shapeClass = computed(() => {
  switch (props.variant) {
    case "circle":
      return "rounded-full";
    case "rect":
    case "image":
      return roundedClass.value;
    case "text":
    default:
      return "";
  }
});

const blockBaseClass = computed(() => {
  switch (props.variant) {
    case "circle":
      return "h-10 w-10";
    case "image":
      return "w-full";
    case "rect":
    default:
      return "h-6 w-full";
  }
});

const aspectRatioValue = computed(() => {
  switch (props.ratio) {
    case "1:1":
      return "1 / 1";
    case "4:3":
      return "4 / 3";
    case "16:9":
    default:
      return "16 / 9";
  }
});

const textContainerStyle = computed(() => {
  const width = normalizeDimension(props.width);
  if (!width) return undefined;
  return { width };
});

const blockStyle = computed(() => {
  const styles: Record<string, string> = {};
  const width = normalizeDimension(props.width);
  const height = normalizeDimension(props.height);

  if (width) styles.width = width;
  if (height) styles.height = height;
  if (props.variant === "image" && !height) {
    styles.aspectRatio = aspectRatioValue.value;
  }

  if (Object.keys(styles).length === 0) return undefined;
  return styles;
});

function lineStyle(index: number) {
  const styles: Record<string, string> = {};
  const width = normalizeDimension(props.width);
  const height = normalizeDimension(props.height);

  if (width) {
    styles.width = width;
  } else if (lineCount.value > 1 && index === lineCount.value - 1) {
    styles.width = "75%";
  }

  if (height) styles.height = height;

  return styles;
}
</script>

<template>
  <div class="budget-skeleton block" aria-hidden="true">
    <div
      v-if="props.variant === 'text'"
      class="budget-skeleton__text flex flex-col gap-2"
      :style="textContainerStyle"
    >
      <span
        v-for="index in lineCount"
        :key="`line-${index}`"
        class="budget-skeleton__line block w-full bg-slate-200 dark:bg-slate-700"
        :class="[sizeClass, roundedClass, animationClass]"
        :style="lineStyle(index - 1)"
      />
    </div>

    <span
      v-else
      class="budget-skeleton__block block bg-slate-200 dark:bg-slate-700"
      :class="[blockBaseClass, shapeClass, animationClass]"
      :style="blockStyle"
    />
  </div>
</template>

<style scoped>
.budget-skeleton--shimmer {
  background-image: linear-gradient(
    110deg,
    rgba(255, 255, 255, 0) 35%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 65%
  );
  background-size: 200% 100%;
  animation: budget-skeleton-shimmer 1.4s linear infinite;
}

@keyframes budget-skeleton-shimmer {
  from {
    background-position-x: 200%;
  }
  to {
    background-position-x: -200%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .budget-skeleton--shimmer,
  .animate-pulse {
    animation: none !important;
  }
}
</style>
