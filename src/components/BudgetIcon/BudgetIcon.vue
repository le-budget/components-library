<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { statusIconMap, statusLabelMap, type StatusIconName } from "../../icons";
import { statusColorMap, type StatusColorName } from "../../utils/statusColors";

type IconSize = "sm" | "md" | "lg" | "xl" | "xxl";

const props = withDefaults(
  defineProps<{
    status: StatusIconName;
    size?: IconSize;
    label?: string;
    color?: StatusColorName;
  }>(),
  {
    size: "md",
    label: undefined,
    color: undefined
  }
);

const icon = computed(() => statusIconMap[props.status]);
const ariaLabel = computed(() => props.label ?? statusLabelMap[props.status]);

const sizeClass = computed(() => {
  if (props.size === "sm") return "text-sm";
  if (props.size === "lg") return "text-lg";
  if (props.size === "xl") return "text-xl";
  if (props.size === "xxl") return "text-2xl";
  return "text-base";
});

const colorClass = computed(() =>
  props.color ? statusColorMap[props.color] : undefined
);
</script>

<template>
  <span
    class="inline-flex items-center"
    :class="[sizeClass, colorClass]"
    role="img"
    :aria-label="ariaLabel"
  >
    <FontAwesomeIcon :icon="icon" :class="[sizeClass, colorClass]" />
  </span>
</template>
