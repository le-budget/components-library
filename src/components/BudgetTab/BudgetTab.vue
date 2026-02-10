<script setup lang="ts">
import { provide, ref, type ComponentPublicInstance } from "vue";
import type { BudgetTabItemColor } from "../BudgetTabItem/BudgetTabItem.vue";
import {
  budgetTabContextKey,
  type BudgetTabRegistration
} from "./tabContext";

defineOptions({
  name: "BudgetTab"
});

const props = withDefaults(
  defineProps<{
    spaced?: boolean;
    borderWidth?: "sm" | "md" | "lg";
  }>(),
  {
    spaced: false,
    borderWidth: "sm"
  }
);

const registeredItems = ref<BudgetTabRegistration[]>([]);
const activeItemId = ref<string | null>(null);
const tabButtonRefs = ref<Map<string, HTMLButtonElement>>(new Map());
const hasUserSelection = ref(false);

function getTabId(itemId: string) {
  return `${itemId}-tab`;
}

function getPanelId(itemId: string) {
  return `${itemId}-panel`;
}

function selectFallbackItem() {
  const defaultActive = registeredItems.value.find(
    (item) => item.defaultActive && !item.disabled
  );
  if (defaultActive) {
    activeItemId.value = defaultActive.id;
    return;
  }

  activeItemId.value =
    registeredItems.value.find((item) => !item.disabled)?.id ?? null;
}

function ensureActiveItem() {
  if (!hasUserSelection.value) {
    selectFallbackItem();
    return;
  }

  const activeItem = registeredItems.value.find((item) => item.id === activeItemId.value);
  if (activeItem && !activeItem.disabled) {
    return;
  }

  activeItemId.value =
    registeredItems.value.find((item) => !item.disabled)?.id ?? null;
}

function registerItem(item: BudgetTabRegistration) {
  const existingIndex = registeredItems.value.findIndex((entry) => entry.id === item.id);
  if (existingIndex === -1) {
    registeredItems.value = [...registeredItems.value, item];
  } else {
    registeredItems.value[existingIndex] = item;
  }

  ensureActiveItem();
}

function updateItem(id: string, item: Omit<BudgetTabRegistration, "id">) {
  const existingIndex = registeredItems.value.findIndex((entry) => entry.id === id);
  if (existingIndex === -1) {
    return;
  }

  registeredItems.value[existingIndex] = {
    id,
    ...item
  };
  ensureActiveItem();
}

function unregisterItem(id: string) {
  registeredItems.value = registeredItems.value.filter((item) => item.id !== id);
  tabButtonRefs.value.delete(id);

  if (activeItemId.value === id) {
    activeItemId.value = null;
  }

  ensureActiveItem();
}

function isActive(itemId: string) {
  return activeItemId.value === itemId;
}

function selectItem(itemId: string) {
  const item = registeredItems.value.find((entry) => entry.id === itemId);
  if (!item || item.disabled) {
    return;
  }

  hasUserSelection.value = true;
  activeItemId.value = item.id;
}

function setButtonRef(
  itemId: string,
  element: Element | ComponentPublicInstance | null
) {
  if (!(element instanceof HTMLButtonElement)) {
    tabButtonRefs.value.delete(itemId);
    return;
  }

  tabButtonRefs.value.set(itemId, element);
}

function focusByStep(currentId: string, step: -1 | 1) {
  const enabledItems = registeredItems.value.filter((item) => !item.disabled);
  if (enabledItems.length === 0) {
    return;
  }

  const currentIndex = enabledItems.findIndex((item) => item.id === currentId);
  const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = (fallbackIndex + step + enabledItems.length) % enabledItems.length;
  const nextItem = enabledItems[nextIndex];

  selectItem(nextItem.id);
  tabButtonRefs.value.get(nextItem.id)?.focus();
}

function focusEdge(position: "first" | "last") {
  const enabledItems = registeredItems.value.filter((item) => !item.disabled);
  if (enabledItems.length === 0) {
    return;
  }

  const edgeItem =
    position === "first"
      ? enabledItems[0]
      : enabledItems[enabledItems.length - 1];

  selectItem(edgeItem.id);
  tabButtonRefs.value.get(edgeItem.id)?.focus();
}

function onTabKeydown(event: KeyboardEvent, itemId: string) {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    focusByStep(itemId, 1);
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    focusByStep(itemId, -1);
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    focusEdge("first");
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    focusEdge("last");
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    selectItem(itemId);
  }
}

function getTabButtonToneClass(item: BudgetTabRegistration) {
  const active = isActive(item.id);
  const inactiveClass = "opacity-50";

  switch (item.color) {
    case "secondary":
      return active
        ? "border-c-blue bg-white text-c-blue-dark dark:border-c-black dark:bg-slate-900 dark:text-slate-100"
        : `border-c-blue bg-white text-c-blue-dark dark:border-c-black dark:bg-slate-900 dark:text-slate-100 ${inactiveClass}`;
    case "ghost":
      return active
        ? "border-c-blue/60 bg-transparent text-c-blue-dark dark:border-c-black/70 dark:text-slate-100"
        : `border-c-blue/60 bg-transparent text-c-blue-dark dark:border-c-black/70 dark:text-slate-100 ${inactiveClass}`;
    case "primary-success":
      return active
        ? "border-c-green bg-c-green/15 text-c-green-dark dark:border-c-black-success dark:bg-c-black-success/20 dark:text-c-black-success"
        : `border-c-green bg-c-green/15 text-c-green-dark dark:border-c-black-success dark:bg-c-black-success/20 dark:text-c-black-success ${inactiveClass}`;
    case "secondary-success":
      return active
        ? "border-c-green bg-white text-c-green-dark dark:border-c-black-success dark:bg-slate-900 dark:text-c-black-success"
        : `border-c-green bg-white text-c-green-dark dark:border-c-black-success dark:bg-slate-900 dark:text-c-black-success ${inactiveClass}`;
    case "primary-warning":
      return active
        ? "border-c-orange bg-c-orange/20 text-c-orange-dark dark:border-c-black-warning dark:bg-c-black-warning/20 dark:text-c-black-warning"
        : `border-c-orange bg-c-orange/20 text-c-orange-dark dark:border-c-black-warning dark:bg-c-black-warning/20 dark:text-c-black-warning ${inactiveClass}`;
    case "secondary-warning":
      return active
        ? "border-c-orange bg-white text-c-orange-dark dark:border-c-black-warning dark:bg-slate-900 dark:text-c-black-warning"
        : `border-c-orange bg-white text-c-orange-dark dark:border-c-black-warning dark:bg-slate-900 dark:text-c-black-warning ${inactiveClass}`;
    case "primary-error":
      return active
        ? "border-c-red bg-c-red/15 text-c-red-dark dark:border-c-black-error dark:bg-c-black-error/20 dark:text-c-black-error"
        : `border-c-red bg-c-red/15 text-c-red-dark dark:border-c-black-error dark:bg-c-black-error/20 dark:text-c-black-error ${inactiveClass}`;
    case "secondary-error":
      return active
        ? "border-c-red bg-white text-c-red-dark dark:border-c-black-error dark:bg-slate-900 dark:text-c-black-error"
        : `border-c-red bg-white text-c-red-dark dark:border-c-black-error dark:bg-slate-900 dark:text-c-black-error ${inactiveClass}`;
    case "primary":
    default:
      return active
        ? "border-c-blue-dark bg-c-blue-light/30 text-c-blue-dark dark:border-c-black dark:bg-c-black-light/35 dark:text-slate-100"
        : `border-c-blue-dark bg-c-blue-light/30 text-c-blue-dark dark:border-c-black dark:bg-c-black-light/35 dark:text-slate-100 ${inactiveClass}`;
  }
}

function getPanelToneClass(color: BudgetTabItemColor) {
  switch (color) {
    case "secondary":
    case "ghost":
      return "border-c-blue dark:border-c-black";
    case "primary-success":
    case "secondary-success":
      return "border-c-green dark:border-c-black-success";
    case "primary-warning":
    case "secondary-warning":
      return "border-c-orange dark:border-c-black-warning";
    case "primary-error":
    case "secondary-error":
      return "border-c-red dark:border-c-black-error";
    case "primary":
    default:
      return "border-c-blue-dark dark:border-c-black";
  }
}

function getTabListClass() {
  if (props.spaced) {
    return "flex-wrap gap-2 pb-2";
  }
  return "flex-nowrap gap-0";
}

function getTabListBorderClass() {
  const borderWidthClass = getTabListBorderWidthClass();
  return props.spaced
    ? `${borderWidthClass} border-slate-200 dark:border-slate-700`
    : "border-b-0";
}

function getRootClass() {
  return props.spaced ? "gap-3" : "gap-0";
}

function getPanelShapeClass() {
  return props.spaced ? "rounded-xl" : "rounded-b-xl rounded-t-none";
}

function getTabListBorderWidthClass() {
  switch (props.borderWidth) {
    case "md":
      return "border-b-2";
    case "lg":
      return "border-b-4";
    case "sm":
    default:
      return "border-b";
  }
}

function getPanelBorderWidthClass() {
  switch (props.borderWidth) {
    case "md":
      return "border-2";
    case "lg":
      return "border-4";
    case "sm":
    default:
      return "border";
  }
}

function getTabButtonLayoutClass(itemId: string, index: number, total: number) {
  const borderClasses = getTabButtonBorderWidthClass(itemId, index, total);

  if (props.spaced) {
    return `rounded-lg ${borderClasses}`;
  }

  const isFirst = index === 0;
  const isLast = index === total - 1;

  return [
    "rounded-none",
    borderClasses,
    isFirst ? "rounded-tl-lg border-l" : "",
    isLast ? "rounded-tr-lg" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function getTabButtonBorderWidthClass(itemId: string, index: number, total: number) {
  if (props.spaced) {
    switch (props.borderWidth) {
      case "md":
        return "border-2";
      case "lg":
        return "border-4";
      case "sm":
      default:
        return "border";
    }
  }

  const isLast = index === total - 1;
  const active = isActive(itemId);
  const previousItem = index > 0 ? registeredItems.value[index - 1] : null;
  const previousIsActive = previousItem ? isActive(previousItem.id) : false;
  const rightBorderClass = isLast || active ? "border-r" : "border-r-0";

  switch (props.borderWidth) {
    case "md":
      return `border-t-2 ${index === 0 ? "border-l-2" : previousIsActive ? "border-l-0" : "border-l-2"} ${rightBorderClass === "border-r" ? "border-r-2" : rightBorderClass}`;
    case "lg":
      return `border-t-4 ${index === 0 ? "border-l-4" : previousIsActive ? "border-l-0" : "border-l-4"} ${rightBorderClass === "border-r" ? "border-r-4" : rightBorderClass}`;
    case "sm":
    default:
      return `border-t ${index === 0 ? "border-l" : previousIsActive ? "border-l-0" : "border-l"} ${rightBorderClass}`;
  }
}

provide(budgetTabContextKey, {
  registerItem,
  updateItem,
  unregisterItem
});
</script>

<template>
  <div class="flex flex-col" :class="getRootClass()" data-testid="tab-root">
    <div
      role="tablist"
      aria-orientation="horizontal"
      class="flex items-end"
      :class="[getTabListClass(), getTabListBorderClass()]"
      data-testid="tab-list"
    >
      <button
        v-for="(item, index) in registeredItems"
        :key="item.id"
        :ref="(element) => setButtonRef(item.id, element)"
        type="button"
        role="tab"
        :id="getTabId(item.id)"
        :aria-selected="isActive(item.id) ? 'true' : 'false'"
        :aria-controls="getPanelId(item.id)"
        :tabindex="isActive(item.id) ? 0 : -1"
        :disabled="item.disabled"
        class="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-55 dark:focus-visible:ring-offset-slate-900"
        :class="[getTabButtonLayoutClass(item.id, index, registeredItems.length), getTabButtonToneClass(item)]"
        @click="selectItem(item.id)"
        @keydown="onTabKeydown($event, item.id)"
      >
        <span v-if="item.iconSlot" class="inline-flex shrink-0 items-center">
          <component :is="item.iconSlot" />
        </span>
        <span class="truncate">{{ item.title }}</span>
      </button>
    </div>

    <div data-testid="tab-panels">
      <section
        v-for="item in registeredItems"
        :key="getPanelId(item.id)"
        v-show="isActive(item.id)"
        role="tabpanel"
        :id="getPanelId(item.id)"
        :aria-labelledby="getTabId(item.id)"
        class="bg-white p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200"
        :class="[getPanelBorderWidthClass(), getPanelShapeClass(), getPanelToneClass(item.color)]"
        data-testid="tab-panel"
      >
        <component :is="item.contentSlot" v-if="item.contentSlot" />
      </section>
    </div>

    <div class="hidden" aria-hidden="true">
      <slot />
    </div>
  </div>
</template>
