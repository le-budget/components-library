<script setup lang="ts">
defineOptions({
  name: "BudgetTableGroup"
});

defineProps<{
  title: string;
  collapsible?: boolean;
  collapsed?: boolean;
  color?: "primary" | "success" | "warning" | "error" | "info" | "neutral";
}>();
</script>

<template>
  <slot />
</template>

