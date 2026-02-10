<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useSlots, watch } from "vue";
import { nextId } from "../../utils/id";
import { budgetTabContextKey } from "../BudgetTab/tabContext";

defineOptions({
  name: "BudgetTabItem"
});

export type BudgetTabItemColor =
  | "primary"
  | "neutral"
  | "secondary-neutral"
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
    title: string;
    color?: BudgetTabItemColor;
    disabled?: boolean;
    defaultActive?: boolean;
  }>(),
  {
    color: "primary",
    disabled: false,
    defaultActive: false
  }
);

const slots = useSlots();
const tab = inject(budgetTabContextKey, null);
const itemId = nextId("budget-tab-item");

function registerOrUpdate() {
  if (!tab) {
    return;
  }

  tab.updateItem(itemId, {
    title: props.title,
    color: props.color,
    disabled: props.disabled,
    defaultActive: props.defaultActive,
    iconSlot: slots.icon,
    contentSlot: slots.default
  });
}

onMounted(() => {
  if (!tab) {
    return;
  }

  tab.registerItem({
    id: itemId,
    title: props.title,
    color: props.color,
    disabled: props.disabled,
    defaultActive: props.defaultActive,
    iconSlot: slots.icon,
    contentSlot: slots.default
  });
});

watch(
  () => [props.title, props.color, props.disabled, props.defaultActive],
  () => {
    registerOrUpdate();
  }
);

onBeforeUnmount(() => {
  if (!tab) {
    return;
  }
  tab.unregisterItem(itemId);
});
</script>

<template />
