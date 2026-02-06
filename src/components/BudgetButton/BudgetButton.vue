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

const iconSizeClass = computed(() => {
  if (props.size === "sm") return "text-sm [&_svg]:text-sm";
  if (props.size === "lg") return "text-lg [&_svg]:text-lg";
  return "text-base [&_svg]:text-base";
});

const toneClass = computed(() => {
  switch (props.color) {
    case "secondary":
      return "border-c-blue bg-white text-c-blue-dark hover:bg-c-blue-dark hover:text-white enabled:active:bg-c-blue-active enabled:active:text-white focus-visible:ring-c-blue-dark dark:border-c-black dark:bg-white dark:text-c-black dark:hover:bg-c-black dark:hover:text-white dark:enabled:active:bg-c-black-active dark:enabled:active:text-white dark:focus-visible:ring-c-black";
    case "ghost":
      return "border-transparent bg-transparent text-c-blue-dark hover:bg-c-blue-light/20 enabled:active:bg-c-blue-active/20 focus-visible:ring-c-blue-dark dark:text-c-black dark:hover:bg-c-black-light dark:enabled:active:bg-c-black-active/20 dark:focus-visible:ring-c-black";
    case "primary-success":
      return "border-c-green-dark bg-c-green text-white hover:bg-c-green-dark enabled:active:bg-c-green-active focus-visible:ring-c-green-dark dark:border-c-black-success dark:bg-c-black-success dark:hover:bg-c-black-success-dark dark:enabled:active:bg-c-black-success dark:focus-visible:ring-c-black-success";
    case "secondary-success":
      return "border-c-green bg-white text-c-green-dark hover:bg-c-green-dark hover:text-white enabled:active:bg-c-green-active enabled:active:text-white focus-visible:ring-c-green-dark dark:border-c-black-success dark:bg-white dark:text-c-black-success dark:hover:bg-c-black-success dark:hover:text-white dark:enabled:active:bg-c-black-success dark:enabled:active:text-white dark:focus-visible:ring-c-black-success";
    case "primary-warning":
      return "border-c-orange-dark bg-c-orange text-white hover:bg-c-orange-dark enabled:active:bg-c-orange-active focus-visible:ring-c-orange-dark dark:border-c-black-warning dark:bg-c-black-warning dark:hover:bg-c-black-warning-dark dark:enabled:active:bg-c-black-warning dark:focus-visible:ring-c-black-warning";
    case "secondary-warning":
      return "border-c-orange bg-white text-c-orange-dark hover:bg-c-orange-dark hover:text-white enabled:active:bg-c-orange-active enabled:active:text-white focus-visible:ring-c-orange-dark dark:border-c-black-warning dark:bg-white dark:text-c-black-warning dark:hover:bg-c-black-warning dark:hover:text-white dark:enabled:active:bg-c-black-warning dark:enabled:active:text-white dark:focus-visible:ring-c-black-warning";
    case "primary-error":
      return "border-c-red-dark bg-c-red text-white hover:bg-c-red-dark enabled:active:bg-c-red-active focus-visible:ring-c-red-dark dark:border-c-black-error dark:bg-c-black-error dark:hover:bg-c-black-error-dark dark:enabled:active:bg-c-black-error dark:focus-visible:ring-c-black-error";
    case "secondary-error":
      return "border-c-red bg-white text-c-red-dark hover:bg-c-red-dark hover:text-white enabled:active:bg-c-red-active enabled:active:text-white focus-visible:ring-c-red-dark dark:border-c-black-error dark:bg-white dark:text-c-black-error dark:hover:bg-c-black-error dark:hover:text-white dark:enabled:active:bg-c-black-error dark:enabled:active:text-white dark:focus-visible:ring-c-black-error";
    case "primary":
    default:
      return "border-c-blue-dark bg-c-blue text-white hover:bg-c-blue-dark enabled:active:bg-c-blue-active focus-visible:ring-c-blue-dark dark:border-c-black dark:bg-c-black dark:hover:bg-c-black-dark dark:enabled:active:bg-c-black-active dark:focus-visible:ring-c-black";
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
    <span
      v-show="!(loading && hideIconsOnLoading)"
      class="inline-flex items-center"
      :class="iconSizeClass"
    >
      <slot name="icon" />
    </span>
    <slot />
    <span
      v-show="!(loading && hideIconsOnLoading)"
      class="inline-flex items-center"
      :class="iconSizeClass"
    >
      <slot name="iconRight" />
    </span>
    <span v-if="loading" class="sr-only">Chargement</span>
  </button>
</template>
