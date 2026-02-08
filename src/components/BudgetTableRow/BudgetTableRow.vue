<script setup lang="ts">
import { computed, inject, useSlots, watchEffect } from "vue";
import BudgetCheckbox from "../BudgetCheckbox/BudgetCheckbox.vue";
import { budgetTableContextKey } from "../BudgetTable/tableContext";

const props = withDefaults(
  defineProps<{
    rowId: string;
    sortValues?: Record<string, unknown>;
    checkboxColor?: "primary" | "success" | "warning" | "error" | "neutral";
  }>(),
  {
    checkboxColor: undefined
  }
);

const tableContext = inject(budgetTableContextKey, null);
const slots = useSlots();

const hasActionsSlot = computed(() => Boolean(slots.actions));
const isSelectable = computed(() => tableContext?.selectable.value ?? false);
const hasActionsColumn = computed(() => tableContext?.hasActionsColumn.value ?? false);
const isSelected = computed(() => tableContext?.isRowSelected(props.rowId) ?? false);
const resolvedCheckboxColor = computed(
  () => props.checkboxColor ?? tableContext?.checkboxColor?.value ?? "neutral"
);

watchEffect(() => {
  void isSelected.value;
});

function onToggle(checked: boolean) {
  tableContext?.toggleRowSelection(props.rowId, checked);
}
</script>

<template>
  <!-- v8 ignore start -->
  <tr
    :data-row-id="rowId"
    class="transition-colors hover:bg-slate-50 focus-within:bg-c-blue-light/15 dark:hover:bg-slate-800/60 dark:focus-within:bg-c-black-light"
  >
    <td
      v-if="isSelectable"
      class="border-b border-slate-200 px-3 py-2 align-middle dark:border-slate-700"
    >
      <BudgetCheckbox
        :model-value="isSelected"
        :color="resolvedCheckboxColor"
        :aria-label="`Selectionner la ligne ${rowId}`"
        @update:model-value="onToggle"
      />
    </td>
    <slot />
    <td
      v-if="hasActionsColumn"
      class="border-b border-slate-200 px-3 py-2 align-middle text-right dark:border-slate-700"
    >
      <slot v-if="hasActionsSlot" name="actions" />
    </td>
  </tr>
  <!-- v8 ignore stop -->
</template>

