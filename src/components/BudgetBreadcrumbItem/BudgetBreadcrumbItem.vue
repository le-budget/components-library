<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useSlots, watch } from "vue";
import { nextId } from "../../utils/id";
import { budgetBreadcrumbContextKey } from "../BudgetBreadcrumb/breadcrumbContext";

defineOptions({
  name: "BudgetBreadcrumbItem"
});

const props = defineProps<{
  label: string;
  href?: string;
}>();

const slots = useSlots();
const breadcrumb = inject(budgetBreadcrumbContextKey, null);
const itemId = nextId("budget-breadcrumb-item");

function registerOrUpdate() {
  if (!breadcrumb) {
    return;
  }
  breadcrumb.updateItem(itemId, {
    label: props.label,
    href: props.href,
    iconSlot: slots.icon
  });
}

onMounted(() => {
  if (!breadcrumb) {
    return;
  }
  breadcrumb.registerItem({
    id: itemId,
    label: props.label,
    href: props.href,
    iconSlot: slots.icon
  });
});

watch(
  () => [props.label, props.href],
  () => {
    registerOrUpdate();
  }
);

onBeforeUnmount(() => {
  if (!breadcrumb) {
    return;
  }
  breadcrumb.unregisterItem(itemId);
});
</script>

<template />
