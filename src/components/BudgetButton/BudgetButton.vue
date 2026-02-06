<script setup lang="ts">
import { computed } from "vue";

type ButtonSize = "sm" | "md" | "lg";
type ButtonColor =
  | "primary"
  | "secondary"
  | "ghost"
  | "primary-success"
  | "secondary-success"
  | "primary-warning"
  | "secondary-warning"
  | "primary-error"
  | "secondary-error";

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    color?: ButtonColor;
    hideIconsOnLoading?: boolean;
    ariaLabel?: string;
  }>(),
  {
    type: "button",
    size: "md",
    loading: false,
    disabled: false,
    color: "primary",
    hideIconsOnLoading: true,
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
  switch (props.color) {
    case "secondary":
      return "border-c-blue bg-white text-c-blue-dark hover:bg-c-blue-light focus-visible:ring-c-blue-dark";
    case "ghost":
      return "border-transparent bg-transparent text-c-blue-dark hover:bg-c-blue-light/20 focus-visible:ring-c-blue-dark";
    case "primary-success":
      return "border-c-green-dark bg-c-green text-white hover:bg-c-green-dark focus-visible:ring-c-green-dark";
    case "secondary-success":
      return "border-c-green bg-white text-c-green-dark hover:bg-c-green-light focus-visible:ring-c-green-dark";
    case "primary-warning":
      return "border-c-orange-dark bg-c-orange text-white hover:bg-c-orange-dark focus-visible:ring-c-orange-dark";
    case "secondary-warning":
      return "border-c-orange bg-white text-c-orange-dark hover:bg-c-orange-light focus-visible:ring-c-orange-dark";
    case "primary-error":
      return "border-c-red-dark bg-c-red text-white hover:bg-c-red-dark focus-visible:ring-c-red-dark";
    case "secondary-error":
      return "border-c-red bg-white text-c-red-dark hover:bg-c-red-light focus-visible:ring-c-red-dark";
    case "primary":
    default:
      return "border-c-blue-dark bg-c-blue text-white hover:bg-c-blue-dark focus-visible:ring-c-blue-dark";
  }
});
</script>

<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-md border-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900',
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
    <slot v-if="!(loading && hideIconsOnLoading)" name="icon" />
    <slot />
    <slot v-if="!(loading && hideIconsOnLoading)" name="iconRight" />
    <span v-if="loading" class="sr-only">Chargement</span>
  </button>
</template>
