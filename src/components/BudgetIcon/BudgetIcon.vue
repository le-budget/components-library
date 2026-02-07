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
    decorative?: boolean;
  }>(),
  {
    size: "md",
    label: undefined,
    color: "primary",
    decorative: false
  }
);

const icon = computed(() => statusIconMap[props.status]);
const ariaLabel = computed(() =>
  props.decorative ? undefined : (props.label ?? statusLabelMap[props.status])
);
const role = computed(() => (props.decorative ? undefined : "img"));
const ariaHidden = computed(() => (props.decorative ? "true" : undefined));

const sizeClass = computed(() => {
  if (props.size === "sm") return "text-sm";
  if (props.size === "lg") return "text-lg";
  if (props.size === "xl") return "text-xl";
  if (props.size === "xxl") return "text-2xl";
  return "text-base";
});

const colorClass = computed(() => statusColorMap[props.color]);
</script>

<template>
  <span
    class="inline-flex items-center"
    :class="[sizeClass, colorClass]"
    :role="role"
    :aria-label="ariaLabel"
    :aria-hidden="ariaHidden"
  >
    <FontAwesomeIcon :icon="icon" />
  </span>
</template>
