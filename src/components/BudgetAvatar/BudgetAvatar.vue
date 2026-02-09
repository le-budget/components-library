<script setup lang="ts">
import { computed } from "vue";

type AvatarShape = "circle" | "rounded" | "square";
type AvatarSize = "sm" | "md" | "lg" | "xl" | "xxl";
type AvatarThickness = "sm" | "md" | "lg";
type AvatarColor =
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
    image: string;
    shape?: AvatarShape;
    size?: AvatarSize;
    thickness?: AvatarThickness;
    color?: AvatarColor;
    alt?: string;
  }>(),
  {
    shape: "circle",
    size: "md",
    thickness: "md",
    color: "primary",
    alt: "Avatar"
  }
);

const shapeClass = computed(() => {
  if (props.shape === "square") return "rounded-none";
  if (props.shape === "rounded") return "rounded-xl";
  return "rounded-full";
});

const sizeClass = computed(() => {
  if (props.size === "sm") return "h-[48px] w-[48px]";
  if (props.size === "lg") return "h-[92px] w-[92px]";
  if (props.size === "xl") return "h-[128px] w-[128px]";
  if (props.size === "xxl") return "h-[256px] w-[256px]";
  return "h-[64px] w-[64px]";
});

const thicknessClass = computed(() => {
  if (props.thickness === "sm") return "border";
  if (props.thickness === "lg") return "border-4";
  return "border-2";
});

const toneClass = computed(() => {
  switch (props.color) {
    case "secondary":
      return "border-c-blue bg-white";
    case "ghost":
      return "border-c-blue/40 bg-transparent";
    case "primary-success":
      return "border-c-green-dark bg-c-green/15";
    case "secondary-success":
      return "border-c-green bg-white";
    case "primary-warning":
      return "border-c-orange-dark bg-c-orange/20";
    case "secondary-warning":
      return "border-c-orange bg-white";
    case "primary-error":
      return "border-c-red-dark bg-c-red/15";
    case "secondary-error":
      return "border-c-red bg-white";
    case "primary":
    default:
      return "border-c-blue-dark bg-c-blue-light/30";
  }
});
</script>

<template>
  <div
    :class="[
      'inline-flex shrink-0 overflow-hidden',
      shapeClass,
      sizeClass,
      thicknessClass,
      toneClass
    ]"
  >
    <img :src="image" :alt="alt" class="h-full w-full object-cover" />
  </div>
</template>
