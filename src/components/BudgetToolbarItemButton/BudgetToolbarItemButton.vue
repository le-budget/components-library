<script setup lang="ts">
import { Comment, Text, computed, inject, useSlots } from "vue";
import BudgetButton from "../BudgetButton/BudgetButton.vue";
import {
  budgetToolbarContextKey,
  type BudgetToolbarSize
} from "../BudgetToolbar/toolbarContext";

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
    size?: BudgetToolbarSize;
    loading?: boolean;
    disabled?: boolean;
    color?: ButtonColor;
    hideIconsOnLoading?: boolean;
    ariaLabel?: string;
    active?: boolean;
  }>(),
  {
    type: "button",
    size: undefined,
    loading: false,
    disabled: false,
    color: "secondary",
    hideIconsOnLoading: true,
    ariaLabel: undefined,
    active: false
  }
);

const emit = defineEmits<{
  (event: "click", payload: MouseEvent): void;
}>();

const slots = useSlots();
const toolbarContext = inject(budgetToolbarContextKey, null);

const resolvedSize = computed<BudgetToolbarSize>(() =>
  props.size ?? toolbarContext?.size.value ?? "md"
);
const isDisabled = computed(
  () => props.disabled || Boolean(toolbarContext?.disabled.value)
);
const buttonClass = computed(() => {
  const orientationClass =
    toolbarContext?.orientation.value === "vertical" ? "w-full justify-start" : "";
  const activeClass = props.active ? "ring-2 ring-current ring-offset-0" : "";
  const defaultNodes = slots.default?.() ?? [];
  const hasTextContent = defaultNodes.some((node) => {
    if (node.type === Comment) {
      return false;
    }
    if (node.type === Text) {
      return String(node.children).trim().length > 0;
    }
    if (typeof node.children === "string") {
      return node.children.trim().length > 0;
    }
    return true;
  });
  const hasIconOnly = !hasTextContent && (Boolean(slots.icon) || Boolean(slots.iconRight));
  const gapClass = hasIconOnly ? "gap-0" : "";
  return `${orientationClass} ${activeClass} ${gapClass}`.trim();
});

function onClick(event: MouseEvent) {
  emit("click", event);
}
</script>

<template>
  <BudgetButton
    :type="type"
    :size="resolvedSize"
    :loading="loading"
    :disabled="isDisabled"
    :color="color"
    :hide-icons-on-loading="hideIconsOnLoading"
    :aria-label="ariaLabel"
    :class="buttonClass"
    @click="onClick"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
    <template #iconRight>
      <slot name="iconRight" />
    </template>
  </BudgetButton>
</template>
