<script setup lang="ts">
import {
  cloneVNode,
  computed,
  provide,
  ref,
  useSlots,
  watch,
  watchEffect,
  type VNode
} from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BudgetTableGroup from "../BudgetTableGroup/BudgetTableGroup.vue";
import BudgetTableRow from "../BudgetTableRow/BudgetTableRow.vue";
import { chevronDownIcon, chevronUpIcon } from "../../icons";
import type { BudgetTableSortDirection, BudgetTableSortFn } from "./tableContext";
import { budgetTableContextKey } from "./tableContext";
import {
  buildPaginableUnits,
  flattenNodes,
  getNextPage,
  getNextSortState,
  getPreviousPage,
  getSortDirection as resolveSortDirection,
  getToneClass,
  getTotalPages,
  parseContent,
  type PaginableUnit,
  type RowEntry
} from "./budgetTable.logic";

type DisplayUnit =
  | {
      type: "row";
      row: RowEntry;
    }
  | {
      type: "group";
      key: string;
      title: string;
      collapsible: boolean;
      isCollapsed: boolean;
      toneClass: string;
      rows: RowEntry[];
    };

function areRecordsEqual(left: Record<string, boolean>, right: Record<string, boolean>) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  return leftKeys.every((key) => right[key] === left[key]);
}

const props = withDefaults(
  defineProps<{
    selected?: string[];
    selectable?: boolean;
    selectAllColor?: "primary" | "success" | "warning" | "error" | "info" | "neutral" | "gray";
    pageSize?: number;
    loading?: boolean;
    emptyText?: string;
  }>(),
  {
    selected: () => [],
    selectable: false,
    selectAllColor: undefined,
    pageSize: undefined,
    loading: false,
    emptyText: "Aucune ligne"
  }
);

const emit = defineEmits<{
  (event: "update:selected", value: string[]): void;
}>();

const slots = useSlots();
const currentPage = ref(1);
const activeSortKey = ref<string | null>(null);
const activeSortDirection = ref<BudgetTableSortDirection>("asc");
const activeSortFn = ref<BudgetTableSortFn | undefined>(undefined);
const collapsedByGroup = ref<Record<string, boolean>>({});
const selectAllRef = ref<HTMLInputElement | null>(null);

const parsedContent = computed(() => {
  const rootNodes = flattenNodes(slots.default?.() ?? []);
  const parsed = parseContent(
    rootNodes,
    BudgetTableGroup,
    BudgetTableRow,
    collapsedByGroup.value
  );
  if (!areRecordsEqual(parsed.collapsedByGroup, collapsedByGroup.value)) {
    collapsedByGroup.value = parsed.collapsedByGroup;
  }
  return {
    rows: parsed.rows,
    groups: parsed.groups,
    hasActionsColumn: parsed.hasActionsColumn
  };
});

const headerNodes = computed(() => flattenNodes(slots.header?.() ?? []));
const selectAllColorClass = computed(() => {
  if (props.selectAllColor === "primary") {
    return "border-c-blue/40 bg-c-blue-light/20 text-c-blue-dark dark:border-c-black-light dark:bg-c-black-light dark:text-slate-100";
  }
  if (props.selectAllColor === "success") {
    return "border-c-green/40 bg-c-green/10 text-c-green-dark dark:border-c-green/30 dark:bg-c-green/20 dark:text-c-green";
  }
  if (props.selectAllColor === "warning") {
    return "border-c-orange/40 bg-c-orange/10 text-c-orange-dark dark:border-c-orange/30 dark:bg-c-orange/20 dark:text-c-orange";
  }
  if (props.selectAllColor === "error") {
    return "border-c-red/40 bg-c-red/10 text-c-red-dark dark:border-c-red/30 dark:bg-c-red/20 dark:text-c-red";
  }
  if (props.selectAllColor === "info") {
    return "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-300";
  }
  if (props.selectAllColor === "neutral") {
    return "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
  if (props.selectAllColor === "gray") {
    return "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
  return "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
});

const columnCount = computed(() => {
  const baseCount = Math.max(headerNodes.value.length, 1);
  const selectionCount = props.selectable ? 1 : 0;
  const actionCount = parsedContent.value.hasActionsColumn ? 1 : 0;
  return baseCount + selectionCount + actionCount;
});

const paginableUnits = computed<PaginableUnit[]>(() => {
  const rootNodes = flattenNodes(slots.default?.() ?? []);
  return buildPaginableUnits(
    rootNodes,
    parsedContent.value.groups,
    parsedContent.value.rows,
    BudgetTableGroup,
    BudgetTableRow,
    activeSortKey.value,
    activeSortDirection.value,
    activeSortFn.value
  );
});

const totalPages = computed(() => {
  return getTotalPages(props.pageSize, paginableUnits.value.length);
});

watch(
  () => props.pageSize,
  () => {
    currentPage.value = 1;
  }
);

const resolvedCurrentPage = computed(() => Math.min(currentPage.value, totalPages.value));

const pagedUnits = computed(() => {
  if (!props.pageSize || props.pageSize <= 0) {
    return paginableUnits.value;
  }
  const start = (resolvedCurrentPage.value - 1) * props.pageSize;
  return paginableUnits.value.slice(start, start + props.pageSize);
});

const visibleRows = computed(() =>
  pagedUnits.value.flatMap((unit) => {
    if (unit.type === "row") {
      return [unit.row];
    }
    const isCollapsed = unit.group.collapsible && collapsedByGroup.value[unit.group.key];
    return isCollapsed ? [] : unit.rows;
  })
);

const pageRowIds = computed(() => visibleRows.value.map((row) => row.rowId));

const displayUnits = computed<DisplayUnit[]>(() =>
  pagedUnits.value.map((unit) => {
    if (unit.type === "row") {
      return {
        type: "row",
        row: unit.row
      };
    }
    const isCollapsed = unit.group.collapsible && collapsedByGroup.value[unit.group.key];
    return {
      type: "group",
      key: unit.group.key,
      title: unit.group.title,
      collapsible: unit.group.collapsible,
      isCollapsed,
      toneClass: getToneClass(unit.group.color),
      rows: unit.rows
    };
  })
);

const allVisibleSelected = computed(() => {
  const pageIds = pageRowIds.value;
  if (pageIds.length === 0) {
    return false;
  }
  return pageIds.every((rowId) => props.selected.includes(rowId));
});

const partiallySelected = computed(() => {
  const pageIds = pageRowIds.value;
  if (pageIds.length === 0) {
    return false;
  }
  const selectedCount = pageIds.filter((rowId) => props.selected.includes(rowId)).length;
  return selectedCount > 0 && selectedCount < pageIds.length;
});

watchEffect(() => {
  if (selectAllRef.value) {
    selectAllRef.value.indeterminate = partiallySelected.value;
  }
});

const hasRowsToDisplay = computed(() => pagedUnits.value.length > 0);

function getSortDirection(key?: string) {
  return resolveSortDirection(key, activeSortKey.value, activeSortDirection.value);
}

function toggleSort(payload: { key?: string; sortFn?: BudgetTableSortFn }) {
  const nextState = getNextSortState(payload, activeSortKey.value, activeSortDirection.value);
  if (!nextState) {
    return;
  }
  activeSortKey.value = nextState.key;
  activeSortDirection.value = nextState.direction;
  activeSortFn.value = nextState.sortFn;
  currentPage.value = 1;
}

function isRowSelected(rowId: string) {
  return props.selected.includes(rowId);
}

function toggleRowSelection(rowId: string, checked: boolean) {
  const next = new Set(props.selected);
  if (checked) {
    next.add(rowId);
  } else {
    next.delete(rowId);
  }
  emit("update:selected", Array.from(next));
}

function toggleSelectAll(event: Event) {
  const target = event.target as HTMLInputElement;
  const next = new Set(props.selected);

  for (const rowId of pageRowIds.value) {
    if (target.checked) {
      next.add(rowId);
    } else {
      next.delete(rowId);
    }
  }

  emit("update:selected", Array.from(next));
}

function toggleGroupCollapse(groupKey: string) {
  collapsedByGroup.value = {
    ...collapsedByGroup.value,
    [groupKey]: !collapsedByGroup.value[groupKey]
  };
  currentPage.value = 1;
}

function goPreviousPage() {
  currentPage.value = getPreviousPage(currentPage.value);
}

function goNextPage() {
  currentPage.value = getNextPage(currentPage.value, totalPages.value);
}

provide(budgetTableContextKey, {
  selectable: computed(() => props.selectable),
  hasActionsColumn: computed(() => parsedContent.value.hasActionsColumn),
  activeSortKey,
  activeSortDirection,
  getSortDirection,
  toggleSort,
  isRowSelected,
  toggleRowSelection
});
</script>

<template>
  <div class="space-y-3">
    <div class="overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700">
      <table class="min-w-full border-collapse bg-white dark:bg-slate-900">
        <thead>
          <tr>
            <!-- v8 ignore start -->
            <th
              v-if="selectable"
              scope="col"
              class="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide"
              :class="selectAllColorClass"
            >
              <input
                ref="selectAllRef"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-c-blue focus-visible:ring-c-blue"
                :checked="allVisibleSelected"
                aria-label="Selectionner toutes les lignes visibles"
                @change="toggleSelectAll"
              />
            </th>
            <template v-for="(headerNode, index) in headerNodes" :key="`header-${index}`">
              <component :is="cloneVNode(headerNode)" />
            </template>
            <th
              v-if="parsedContent.hasActionsColumn"
              scope="col"
              class="border-b border-slate-300 bg-slate-100 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <slot name="actionsHeader">Actions</slot>
              </th>
            <!-- v8 ignore stop -->
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td
              :colspan="columnCount"
              class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              Chargement...
            </td>
          </tr>
          <template v-else>
            <template v-for="unit in displayUnits" :key="unit.type === 'row' ? `row-${unit.row.rowId}` : unit.key">
              <component v-if="unit.type === 'row'" :is="cloneVNode(unit.row.node)" />
              <template v-else>
                <tr>
                  <td
                    :colspan="columnCount"
                    class="border-b border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700"
                    :class="unit.toneClass"
                  >
                    <button
                      v-if="unit.collapsible"
                      type="button"
                      class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-1 py-0.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue"
                      :aria-label="unit.isCollapsed ? `Afficher ${unit.title}` : `Replier ${unit.title}`"
                      @click="toggleGroupCollapse(unit.key)"
                    >
                      <span>{{ unit.title }}</span>
                      <span class="inline-flex h-7 w-7 items-center justify-center text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-200">
                        <FontAwesomeIcon :icon="unit.isCollapsed ? chevronDownIcon : chevronUpIcon" />
                      </span>
                    </button>
                    <div v-else class="flex items-center justify-between gap-3">
                      <span>{{ unit.title }}</span>
                    </div>
                  </td>
                </tr>
                <template v-for="row in unit.rows" :key="`group-row-${unit.key}-${row.rowId}`">
                  <Transition name="budget-table-group-row">
                    <component :is="cloneVNode(row.node)" v-if="!unit.isCollapsed" />
                  </Transition>
                </template>
              </template>
            </template>

            <tr v-if="!hasRowsToDisplay">
              <td
                :colspan="columnCount"
                class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                {{ emptyText }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="pageSize && pageSize > 0 && !loading"
      class="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300"
    >
      <button
        type="button"
        class="rounded border border-slate-300 px-3 py-1.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
        :disabled="currentPage === 1"
        @click="goPreviousPage"
      >
        Precedent
      </button>
      <button
        type="button"
        class="rounded border border-slate-300 px-3 py-1.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
        :disabled="currentPage === totalPages"
        @click="goNextPage"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<style scoped>
.budget-table-group-row-enter-active,
.budget-table-group-row-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.budget-table-group-row-enter-from,
.budget-table-group-row-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

