<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    active?: boolean;
    disabled?: boolean;
  }>(),
  {
    active: false,
    disabled: false
  }
);

const itemClass = computed(() => {
  const activeClass = props.active
    ? "bg-c-blue-light/25 text-c-blue-dark dark:bg-slate-800 dark:text-slate-100"
    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800";
  const disabledClass = props.disabled
    ? "cursor-not-allowed opacity-60 pointer-events-none"
    : "";

  return [
    "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors md:w-auto",
    activeClass,
    disabledClass
  ].join(" ");
});
</script>

<template>
  <li :class="itemClass" :aria-disabled="disabled ? 'true' : undefined">
    <slot />
  </li>
</template>