<script setup lang="ts">
import { computed, provide, toRef } from "vue";
import {
  budgetToolbarContextKey,
  type BudgetToolbarOrientation,
  type BudgetToolbarSize
} from "./toolbarContext";

const props = withDefaults(
  defineProps<{
    label?: string;
    orientation?: BudgetToolbarOrientation;
    size?: BudgetToolbarSize;
    align?: "left" | "right";
    disabled?: boolean;
    wrap?: boolean;
  }>(),
  {
    label: undefined,
    orientation: "horizontal",
    size: "md",
    align: "left",
    disabled: false,
    wrap: false
  }
);

const containerClass = computed(() => {
  const orientationClass =
    props.orientation === "vertical"
      ? "flex-col items-stretch"
      : "flex-row items-center";
  const alignClass =
    props.orientation === "horizontal"
      ? (props.align === "right" ? "justify-end" : "justify-start")
      : "";
  const widthClass =
    props.orientation === "horizontal" && props.align === "right" ? "w-full" : "";
  const wrapClass =
    props.orientation === "horizontal" && props.wrap ? "flex-wrap" : "flex-nowrap";
  const sizeClass = {
    sm: "gap-1 p-1",
    md: "gap-1.5 p-1.5",
    lg: "gap-2 p-2"
  }[props.size];

  return `${orientationClass} ${alignClass} ${widthClass} ${wrapClass} ${sizeClass}`;
});

provide(budgetToolbarContextKey, {
  size: toRef(props, "size"),
  orientation: toRef(props, "orientation"),
  disabled: toRef(props, "disabled")
});
</script>

<template>
  <div
    role="toolbar"
    :aria-label="label"
    :aria-orientation="orientation"
    class="inline-flex rounded-md border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    :class="[containerClass, disabled ? 'opacity-60' : '']"
  >
    <slot />
  </div>
</template>
