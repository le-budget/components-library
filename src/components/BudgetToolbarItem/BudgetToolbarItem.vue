<script setup lang="ts">
import { computed, inject } from "vue";
import { budgetToolbarContextKey } from "../BudgetToolbar/toolbarContext";

const toolbarContext = inject(budgetToolbarContextKey, null);
const itemClass = computed(() =>
  toolbarContext?.orientation.value === "vertical"
    ? "inline-flex w-full items-center"
    : "inline-flex items-center"
);
</script>

<template>
  <div :class="itemClass">
    <slot />
  </div>
</template>
