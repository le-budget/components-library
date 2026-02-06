<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string;
    colorClass?: string;
  }>(),
  {
    colorClass: "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
  }
);
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="props.colorClass"
  >
    {{ text }}
  </span>
</template>
