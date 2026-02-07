<script setup lang="ts">
defineOptions({
  name: "BudgetDropdownGroup"
});

defineProps<{
  label: string;
}>();
</script>

<template>
  <slot />
</template>
