<script setup lang="ts">
import { computed } from "vue";

type ButtonSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    error?: boolean;
    ariaLabel?: string;
  }>(),
  {
    type: "button",
    size: "md",
    loading: false,
    disabled: false,
    error: false,
    ariaLabel: undefined
  }
);

const isDisabled = computed(() => props.disabled || props.loading);

const sizeClass = computed(() => {
  if (props.size === "sm") return "h-8 px-3 text-sm";
  if (props.size === "lg") return "h-12 px-5 text-base";
  return "h-10 px-4 text-sm";
});

const toneClass = computed(() => {
  if (props.error) {
    return "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500";
  }
  return "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
});
</script>

<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900',
      sizeClass,
      toneClass
    ]"
    :disabled="isDisabled"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot name="icon" />
    <slot />
    <slot name="iconRight" />
    <span v-if="loading" class="sr-only">Chargement</span>
  </button>
</template>
