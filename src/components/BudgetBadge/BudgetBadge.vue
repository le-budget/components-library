<script setup lang="ts">
import { computed } from "vue";

type BadgeColor =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "warning"
  | "error";
type BadgeSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    text: string;
    color?: BadgeColor;
    size?: BadgeSize;
  }>(),
  {
    color: "primary",
    size: "md"
  }
);

const sizeClass = computed(() => {
  if (props.size === "sm") return "px-3 py-0.5 text-[11px] gap-1";
  if (props.size === "lg") return "px-3.5 py-1 text-sm gap-1.5";
  return "px-3 py-0.5 text-[13px] gap-1.5";
});

const iconClass = computed(() => {
  if (props.size === "lg") return "text-lg";
  return "text-xs";
});

const colorClass = computed(() => {
  switch (props.color) {
    case "secondary":
      return "border-c-blue bg-white text-c-blue-dark hover:bg-c-blue-active hover:text-white dark:border-c-black dark:bg-white dark:text-c-black dark:hover:bg-c-black-active dark:hover:text-white";
    case "ghost":
      return "border-transparent bg-transparent text-c-blue-dark hover:bg-c-blue-active/20 dark:text-c-black dark:hover:bg-c-black-active/20";
    case "success":
      return "border-c-green-dark bg-c-green text-white hover:bg-c-green-active dark:border-c-black-success dark:bg-c-black-success dark:hover:bg-c-black-success";
    case "warning":
      return "border-c-orange-dark bg-c-orange text-white hover:bg-c-orange-active dark:border-c-black-warning dark:bg-c-black-warning dark:hover:bg-c-black-warning";
    case "error":
      return "border-c-red-dark bg-c-red text-white hover:bg-c-red-active dark:border-c-black-error dark:bg-c-black-error dark:hover:bg-c-black-error";
    case "primary":
    default:
      return "border-c-blue-dark bg-c-blue text-white hover:bg-c-blue-active dark:border-c-black dark:bg-c-black dark:hover:bg-c-black-active";
  }
});
</script>

<template>
  <span
    class="inline-flex items-center justify-center text-center rounded-full border font-medium cursor-default select-none"
    :class="[sizeClass, colorClass]"
  >
    <span v-show="$slots.icon" class="inline-flex items-center" :class="iconClass">
      <slot name="icon" />
    </span>
    {{ text }}
    <span v-show="$slots.iconRight" class="inline-flex items-center" :class="iconClass">
      <slot name="iconRight" />
    </span>
  </span>
</template>
