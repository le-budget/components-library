<script setup lang="ts">
import { computed } from "vue";
import type { BudgetRadioColor } from "../BudgetRadioGroup/radioGroupContext";

defineOptions({
  name: "BudgetDivider"
});

type BudgetDividerOrientation = "horizontal" | "vertical";
type BudgetDividerLineStyle = "solid" | "dashed" | "dotted";
type BudgetDividerThickness = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    orientation?: BudgetDividerOrientation;
    color?: BudgetRadioColor;
    lineStyle?: BudgetDividerLineStyle;
    thickness?: BudgetDividerThickness;
  }>(),
  {
    orientation: "horizontal",
    color: "primary",
    lineStyle: "solid",
    thickness: "md"
  }
);

const orientationClass = computed(() => {
  if (props.orientation === "vertical") {
    return "h-full self-stretch";
  }
  return "w-full";
});

const thicknessClass = computed(() => {
  if (props.orientation === "vertical") {
    if (props.thickness === "sm") {
      return "border-l";
    }
    if (props.thickness === "lg") {
      return "border-l-4";
    }
    return "border-l-2";
  }

  if (props.thickness === "sm") {
    return "border-t";
  }
  if (props.thickness === "lg") {
    return "border-t-4";
  }
  return "border-t-2";
});

const colorClass = computed(() => {
  switch (props.color) {
    case "neutral":
      return "border-slate-500 dark:border-slate-500";
    case "success":
      return "border-c-green-dark dark:border-c-black-success";
    case "warning":
      return "border-c-orange-dark dark:border-c-black-warning";
    case "error":
      return "border-c-red-dark dark:border-c-black-error";
    case "primary":
    default:
      return "border-c-blue-dark dark:border-c-black";
  }
});

const lineStyleClass = computed(() => {
  if (props.lineStyle === "dashed") {
    return "border-dashed";
  }
  if (props.lineStyle === "dotted") {
    return "border-dotted";
  }
  return "border-solid";
});
</script>

<template>
  <span
    role="separator"
    :aria-orientation="orientation"
    class="inline-block shrink-0 border-0"
    :class="[orientationClass, thicknessClass, colorClass, lineStyleClass]"
  />
</template>
