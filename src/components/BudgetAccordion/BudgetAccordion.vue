<script setup lang="ts">
import { provide, ref, toRef, watch } from "vue";
import {
  budgetAccordionContextKey
} from "./accordionContext";

defineOptions({
  name: "BudgetAccordion"
});

const props = withDefaults(
  defineProps<{
    multiple?: boolean;
    spaced?: boolean;
  }>(),
  {
    multiple: false,
    spaced: false
  }
);

type RegisteredItem = {
  id: string;
  button: HTMLButtonElement;
};

const openedItemIds = ref<string[]>([]);
const registeredItems = ref<RegisteredItem[]>([]);

function isItemOpen(id: string) {
  return openedItemIds.value.includes(id);
}

function toggleItem(id: string) {
  if (props.multiple) {
    if (isItemOpen(id)) {
      openedItemIds.value = openedItemIds.value.filter((itemId) => itemId !== id);
      return;
    }
    openedItemIds.value = [...openedItemIds.value, id];
    return;
  }

  if (isItemOpen(id)) {
    openedItemIds.value = [];
    return;
  }

  openedItemIds.value = [id];
}

function registerItem(id: string, button: HTMLButtonElement, defaultOpen: boolean) {
  const existing = registeredItems.value.find((item) => item.id === id);
  if (existing) {
    existing.button = button;
  } else {
    registeredItems.value = [...registeredItems.value, { id, button }];
  }

  if (!defaultOpen || isItemOpen(id)) {
    return;
  }

  if (props.multiple) {
    openedItemIds.value = [...openedItemIds.value, id];
    return;
  }

  if (openedItemIds.value.length === 0) {
    openedItemIds.value = [id];
  }
}

function unregisterItem(id: string) {
  registeredItems.value = registeredItems.value.filter((item) => item.id !== id);
  openedItemIds.value = openedItemIds.value.filter((openedId) => openedId !== id);
}

function focusByStep(currentId: string, step: -1 | 1) {
  const enabledItems = registeredItems.value.filter((item) => !item.button.disabled);
  if (enabledItems.length === 0) {
    return;
  }

  const currentIndex = enabledItems.findIndex((item) => item.id === currentId);
  const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = (fallbackIndex + step + enabledItems.length) % enabledItems.length;
  enabledItems[nextIndex].button.focus();
}

watch(
  () => props.multiple,
  (multiple) => {
    if (multiple || openedItemIds.value.length <= 1) {
      return;
    }
    openedItemIds.value = [openedItemIds.value[0]];
  }
);

provide(budgetAccordionContextKey, {
  multiple: toRef(props, "multiple"),
  spaced: toRef(props, "spaced"),
  isItemOpen,
  toggleItem,
  registerItem,
  unregisterItem,
  focusByStep
});
</script>

<template>
  <div
    class="flex flex-col"
    :class="spaced ? 'gap-[10px]' : 'rounded-xl'"
    data-testid="accordion-root"
  >
    <slot />
  </div>
</template>
