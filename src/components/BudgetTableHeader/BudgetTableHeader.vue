<script setup lang="ts">
import { computed, inject, useSlots } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { sortArrowDownIcon, sortArrowUpIcon } from "../../icons";
import { budgetTableContextKey } from "../BudgetTable/tableContext";

const props = withDefaults(
  defineProps<{
    sortable?: boolean;
    sortKey?: string;
    sortFn?: (a: unknown, b: unknown) => number;
    align?: "left" | "center" | "right";
    span?: number;
    fitContent?: boolean;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "success" | "warning" | "error" | "info" | "neutral" | "gray";
  }>(),
  {
    sortable: false,
    sortKey: undefined,
    sortFn: undefined,
    align: "left",
    span: undefined,
    fitContent: false,
    size: "sm",
    color: undefined
  }
);

const slots = useSlots();
const tableContext = inject(budgetTableContextKey, null);

const hasPrefix = computed(() => Boolean(slots.prefix));
const hasSuffix = computed(() => Boolean(slots.suffix));
const clampedSpan = computed(() => {
  if (props.span === undefined) {
    return null;
  }
  return Math.min(12, Math.max(1, Math.round(props.span)));
});
const headerStyle = computed(() => {
  if (props.fitContent) {
    return {
      width: "1%"
    };
  }
  if (clampedSpan.value !== null) {
    return {
      width: `${(clampedSpan.value / 12) * 100}%`
    };
  }
  return undefined;
});
const fitContentClass = computed(() =>
  props.fitContent ? "w-px whitespace-nowrap" : ""
);
const sizeClass = computed(() => {
  if (props.size === "lg") {
    return {
      header: "px-5 py-3 text-base",
      icon: "text-xs"
    };
  }
  if (props.size === "md") {
    return {
      header: "px-4 py-2.5 text-sm",
      icon: "text-[11px]"
    };
  }
  return {
    header: "px-3 py-2 text-xs",
    icon: "text-[10px]"
  };
});
const colorClass = computed(() => {
  if (props.color === "primary") {
    return "border-c-blue/40 bg-c-blue-light/20 text-c-blue-dark dark:border-c-black-light dark:bg-c-black-light dark:text-slate-100";
  }
  if (props.color === "success") {
    return "border-c-green/40 bg-c-green/10 text-c-green-dark dark:border-c-green/30 dark:bg-c-green/20 dark:text-c-green";
  }
  if (props.color === "warning") {
    return "border-c-orange/40 bg-c-orange/10 text-c-orange-dark dark:border-c-orange/30 dark:bg-c-orange/20 dark:text-c-orange";
  }
  if (props.color === "error") {
    return "border-c-red/40 bg-c-red/10 text-c-red-dark dark:border-c-red/30 dark:bg-c-red/20 dark:text-c-red";
  }
  if (props.color === "info") {
    return "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-300";
  }
  if (props.color === "neutral") {
    return "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
  if (props.color === "gray") {
    return "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
  return "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
});
const alignmentClass = computed(() => {
  if (props.align === "right") {
    return "justify-end text-right";
  }
  if (props.align === "center") {
    return "justify-center text-center";
  }
  return "justify-start text-left";
});

const sortDirection = computed(() =>
  tableContext?.getSortDirection(props.sortKey)
);

const ariaSort = computed(() => {
  if (!props.sortable || !sortDirection.value) {
    return "none";
  }
  return sortDirection.value === "asc" ? "ascending" : "descending";
});

function onSort() {
  tableContext?.toggleSort({
    key: props.sortKey,
    sortFn: props.sortFn
  });
}
</script>

<template>
  <th
    scope="col"
    class="border-b font-semibold uppercase tracking-wide"
    :class="[fitContentClass, sizeClass.header, colorClass]"
    :style="headerStyle"
    :aria-sort="ariaSort"
  >
    <button
      v-if="sortable"
      type="button"
      class="flex w-full items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue"
      :class="alignmentClass"
      @click="onSort"
    >
      <span v-if="hasPrefix" class="shrink-0 text-slate-500 dark:text-slate-400">
        <slot name="prefix" />
      </span>
      <span class="min-w-0 truncate">
        <slot />
      </span>
      <span class="shrink-0 text-slate-500 dark:text-slate-400" data-testid="sort-icon">
        <FontAwesomeIcon
          :icon="sortDirection === 'asc' ? sortArrowUpIcon : sortArrowDownIcon"
          :class="sizeClass.icon"
        />
      </span>
      <span v-if="hasSuffix" class="shrink-0 text-slate-500 dark:text-slate-400">
        <slot name="suffix" />
      </span>
    </button>
    <span v-else class="flex items-center gap-2" :class="alignmentClass">
      <span v-if="hasPrefix" class="shrink-0 text-slate-500 dark:text-slate-400">
        <slot name="prefix" />
      </span>
      <span class="min-w-0 truncate">
        <slot />
      </span>
      <span v-if="hasSuffix" class="shrink-0 text-slate-500 dark:text-slate-400">
        <slot name="suffix" />
      </span>
    </span>
  </th>
</template>
