<script setup lang="ts">
import { computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    align?: "left" | "center" | "right";
  }>(),
  {
    align: "left"
  }
);

const slots = useSlots();

const hasPrefix = computed(() => Boolean(slots.prefix));
const hasSuffix = computed(() => Boolean(slots.suffix));
const alignmentClass = computed(() => {
  if (props.align === "right") {
    return "justify-end text-right";
  }
  if (props.align === "center") {
    return "justify-center text-center";
  }
  return "justify-start text-left";
});
</script>

<template>
  <td class="border-b border-slate-200 px-3 py-2 align-middle text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
    <span class="flex items-center gap-2" :class="alignmentClass">
      <span v-if="hasPrefix" class="shrink-0 text-slate-500 dark:text-slate-400">
        <slot name="prefix" />
      </span>
      <span class="min-w-0 truncate">
        <slot />
      </span>
      <span v-if="hasSuffix" class="shrink-0 text-slate-500 dark:text-slate-400">
        <slot name="suffix" />
      </span>
    </span>
  </td>
</template>

