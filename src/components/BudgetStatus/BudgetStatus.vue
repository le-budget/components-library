<script setup lang="ts">
import { computed } from "vue";
import type { BudgetRadioColor } from "../BudgetRadioGroup/radioGroupContext";

defineOptions({
  name: "BudgetStatus"
});

type BudgetStatusSize = "sm" | "md" | "lg" | "xl" | "xxl";
type BudgetStatusAnimation = "bounce" | "pulse" | "ping";

const props = withDefaults(
  defineProps<{
    color?: BudgetRadioColor;
    size?: BudgetStatusSize;
    animation?: BudgetStatusAnimation | null;
    label?: string;
  }>(),
  {
    color: "primary",
    size: "md",
    animation: null,
    label: undefined
  }
);

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-2 w-2";
    case "md":
      return "h-3 w-3";
    case "lg":
      return "h-4 w-4";
    case "xl":
      return "h-[18px] w-[18px]";
    case "xxl":
      return "h-5 w-5";
    default:
      return "h-3 w-3";
  }
});

const colorClass = computed(() => {
  switch (props.color) {
    case "neutral":
      return "bg-slate-500 dark:bg-slate-500";
    case "success":
      return "bg-c-green dark:bg-c-black-success";
    case "warning":
      return "bg-c-orange dark:bg-c-black-warning";
    case "error":
      return "bg-c-red dark:bg-c-black-error";
    case "primary":
    default:
      return "bg-c-blue dark:bg-c-black";
  }
});

const dotAnimationClass = computed(() => {
  if (props.animation === "bounce") {
    return "animate-bounce";
  }
  if (props.animation === "pulse") {
    return "animate-pulse";
  }
  return "";
});

const showPing = computed(() => props.animation === "ping");
const isDecorative = computed(() => !props.label || props.label.trim().length === 0);
</script>

<template>
  <span
    class="budget-status relative inline-flex shrink-0 rounded-full"
    :class="sizeClass"
    :role="isDecorative ? undefined : 'status'"
    :aria-label="isDecorative ? undefined : label"
    :aria-hidden="isDecorative ? 'true' : undefined"
  >
    <span
      class="budget-status__ping absolute inset-0 rounded-full"
      :class="[colorClass, showPing ? 'opacity-70 animate-ping' : 'opacity-0']"
      aria-hidden="true"
    />
    <span
      class="budget-status__dot relative inline-flex h-full w-full rounded-full"
      :class="[colorClass, dotAnimationClass]"
      aria-hidden="true"
    />
  </span>
</template>
