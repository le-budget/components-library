<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  budgetBreadcrumbContextKey,
  type BudgetBreadcrumbRegistration
} from "./breadcrumbContext";
import { chevronRightIcon } from "../../icons";

defineOptions({
  name: "BudgetBreadcrumb"
});

type BreadcrumbSegment =
  | {
      type: "item";
      item: BudgetBreadcrumbRegistration;
    }
  | {
      type: "ellipsis";
    };

const props = withDefaults(
  defineProps<{
    maxItems?: number;
    ariaLabel?: string;
  }>(),
  {
    maxItems: 3,
    ariaLabel: "Fil d'ariane"
  }
);

const registeredItems = ref<BudgetBreadcrumbRegistration[]>([]);

const visibleSegments = computed<BreadcrumbSegment[]>(() => {
  if (registeredItems.value.length <= props.maxItems) {
    return registeredItems.value.map((item) => ({
      type: "item",
      item
    }));
  }

  const firstItem = registeredItems.value[0];
  const lastItem = registeredItems.value[registeredItems.value.length - 1];

  return [
    {
      type: "item",
      item: firstItem
    },
    {
      type: "ellipsis"
    },
    {
      type: "item",
      item: lastItem
    }
  ];
});

function registerItem(item: BudgetBreadcrumbRegistration) {
  const existingIndex = registeredItems.value.findIndex(
    (entry) => entry.id === item.id
  );
  if (existingIndex === -1) {
    registeredItems.value = [...registeredItems.value, item];
    return;
  }
  registeredItems.value[existingIndex] = item;
}

function updateItem(id: string, item: Omit<BudgetBreadcrumbRegistration, "id">) {
  const existingIndex = registeredItems.value.findIndex((entry) => entry.id === id);
  if (existingIndex === -1) {
    return;
  }
  registeredItems.value[existingIndex] = {
    id,
    ...item
  };
}

function unregisterItem(id: string) {
  registeredItems.value = registeredItems.value.filter((item) => item.id !== id);
}

provide(budgetBreadcrumbContextKey, {
  registerItem,
  updateItem,
  unregisterItem
});
</script>

<template>
  <nav :aria-label="ariaLabel">
    <ol class="flex list-none items-center gap-2 p-0 text-sm text-slate-700 dark:text-slate-200">
      <li
        v-for="(segment, index) in visibleSegments"
        :key="segment.type === 'ellipsis' ? `ellipsis-${index}` : segment.item.id"
        class="inline-flex items-center gap-2"
      >
        <span
          v-if="index > 0"
          class="inline-flex items-center text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        >
          <FontAwesomeIcon :icon="chevronRightIcon" />
        </span>

        <span v-if="segment.type === 'ellipsis'" aria-hidden="true">...</span>

        <template v-else>
          <component
            :is="segment.item.href ? 'a' : 'span'"
            :href="segment.item.href"
            class="inline-flex items-center gap-1.5 rounded-sm px-0.5 py-0.5"
            :class="segment.item.href
              ? 'text-c-blue-dark underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue dark:text-c-black'
              : 'text-slate-700 dark:text-slate-200'"
          >
            <span v-if="segment.item.iconSlot" class="inline-flex shrink-0 items-center">
              <component :is="segment.item.iconSlot" />
            </span>
            <span>{{ segment.item.label }}</span>
          </component>
        </template>
      </li>
    </ol>

    <div class="hidden" aria-hidden="true">
      <slot />
    </div>
  </nav>
</template>
