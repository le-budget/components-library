<script setup lang="ts">
import { computed, inject } from "vue";
import {
  budgetToolbarContextKey,
  type BudgetToolbarOrientation
} from "../BudgetToolbar/toolbarContext";

const props = withDefaults(
  defineProps<{
    orientation?: BudgetToolbarOrientation;
  }>(),
  {
    orientation: undefined
  }
);

const toolbarContext = inject(budgetToolbarContextKey, null);

const resolvedOrientation = computed<BudgetToolbarOrientation>(() => {
  if (props.orientation) {
    return props.orientation;
  }
  return toolbarContext?.orientation.value === "vertical"
    ? "horizontal"
    : "vertical";
});

const separatorClass = computed(() => {
  const toolbarSize = toolbarContext?.size.value ?? "md";
  if (resolvedOrientation.value === "horizontal") {
    const sizeClass = toolbarSize === "sm" ? "my-0.5" : toolbarSize === "lg" ? "my-1.5" : "my-1";
    return `h-px w-full ${sizeClass}`;
  }
  const sizeClass = toolbarSize === "sm" ? "mx-0.5" : toolbarSize === "lg" ? "mx-1.5" : "mx-1";
  return `w-px self-stretch ${sizeClass}`;
});
</script>

<template>
  <span
    role="separator"
    :aria-orientation="resolvedOrientation"
    class="inline-flex bg-slate-300 dark:bg-slate-700"
    :class="separatorClass"
  />
</template>
