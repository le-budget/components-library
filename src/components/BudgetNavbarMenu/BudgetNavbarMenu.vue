<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    align?: "left" | "center" | "right";
  }>(),
  {
    ariaLabel: "Menu principal",
    align: "left"
  }
);

const menuClass = computed(() => {
  const alignClass =
    props.align === "center"
      ? "md:justify-center"
      : props.align === "right"
        ? "md:justify-end"
        : "md:justify-start";

  return `m-0 flex list-none flex-col gap-1 p-0 md:flex-row md:items-center md:gap-2 ${alignClass}`;
});
</script>

<template>
  <ul :aria-label="ariaLabel" class="w-full" :class="menuClass">
    <slot />
  </ul>
</template>
