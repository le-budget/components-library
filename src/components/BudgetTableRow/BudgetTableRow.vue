<script setup lang="ts">
import { computed, inject, useSlots, watchEffect } from "vue";
import { budgetTableContextKey } from "../BudgetTable/tableContext";

const props = defineProps<{
  rowId: string;
  sortValues?: Record<string, unknown>;
}>();

const tableContext = inject(budgetTableContextKey, null);
const slots = useSlots();

const hasActionsSlot = computed(() => Boolean(slots.actions));
const isSelectable = computed(() => tableContext?.selectable.value ?? false);
const hasActionsColumn = computed(() => tableContext?.hasActionsColumn.value ?? false);
const isSelected = computed(() => tableContext?.isRowSelected(props.rowId) ?? false);

watchEffect(() => {
  void isSelected.value;
});

function onToggle(event: Event) {
  const target = event.target as HTMLInputElement;
  tableContext?.toggleRowSelection(props.rowId, target.checked);
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
      <input
        :checked="isSelected"
        type="checkbox"
        class="h-4 w-4 rounded border-slate-300 text-c-blue focus-visible:ring-c-blue"
        :aria-label="`Selectionner la ligne ${rowId}`"
        @change="onToggle"
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



