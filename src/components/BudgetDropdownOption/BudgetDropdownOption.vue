<script setup lang="ts">
import { computed, useSlots } from "vue";

defineOptions({
  name: "BudgetDropdownOption"
});

defineProps<{
  label: string;
  value: string | number;
  disabled?: boolean;
}>();

const slots = useSlots();
const hasRightSlot = computed(() => Boolean(slots.right));
</script>

<template>
  <span class="inline-flex w-full items-center justify-between gap-3">
    <span class="truncate">
      <slot />
    </span>
    <span
      v-if="hasRightSlot"
      class="shrink-0 text-xs text-slate-500 dark:text-slate-400"
    >
      <slot name="right" />
    </span>
  </span>
</template>
