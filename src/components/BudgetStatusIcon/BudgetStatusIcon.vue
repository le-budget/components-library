<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { statusIconMap, statusLabelMap, type StatusIconName } from "../../icons";

type IconSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    status: StatusIconName;
    size?: IconSize;
    label?: string;
  }>(),
  {
    size: "md",
    label: undefined
  }
);

const icon = computed(() => statusIconMap[props.status]);
const ariaLabel = computed(() => props.label ?? statusLabelMap[props.status]);

const sizeClass = computed(() => {
  if (props.size === "sm") return "text-sm";
  if (props.size === "lg") return "text-lg";
  return "text-base";
});
</script>

<template>
  <span
    class="inline-flex items-center text-slate-700 dark:text-slate-200"
    :class="sizeClass"
    role="img"
    :aria-label="ariaLabel"
  >
    <FontAwesomeIcon :icon="icon" />
  </span>
</template>
