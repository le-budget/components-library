<script setup lang="ts">
import { computed, ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";
import BudgetTable from "../../components/BudgetTable/BudgetTable.vue";
import BudgetTableCell from "../../components/BudgetTableCell/BudgetTableCell.vue";
import BudgetTableGroup from "../../components/BudgetTableGroup/BudgetTableGroup.vue";
import BudgetTableHeader from "../../components/BudgetTableHeader/BudgetTableHeader.vue";
import BudgetTableRow from "../../components/BudgetTableRow/BudgetTableRow.vue";
import BudgetAmountInput from "../../components/BudgetAmountInput/BudgetAmountInput.vue";

const tableCollapsed = ref(true);
const selectedRows = ref<string[]>([]);
const selectedRowsLarge = ref<string[]>([]);
const selectedRowsSingleSortable = ref<string[]>([]);
const selectedRowsSizing = ref<string[]>([]);
const selectedRowsControls = ref<string[]>([]);
const selectedRowsHeaderColors = ref<Record<string, string[]>>({
  default: [],
  gray: [],
  primary: [],
  success: [],
  warning: [],
  error: [],
  info: [],
  neutral: []
});
const selectedRowsCheckboxColors = ref<Record<string, string[]>>({
  primary: [],
  neutral: [],
  success: [],
  warning: [],
  error: []
});
const headerColorExamples: Array<{
  key: string;
  label: string;
  color?: "primary" | "success" | "warning" | "error" | "info" | "neutral" | "gray";
}> = [
  { key: "default", label: "Default (white)" },
  { key: "gray", label: "Gray", color: "gray" },
  { key: "primary", label: "Primary", color: "primary" },
  { key: "success", label: "Success", color: "success" },
  { key: "warning", label: "Warning", color: "warning" },
  { key: "error", label: "Error", color: "error" },
  { key: "info", label: "Info", color: "info" },
  { key: "neutral", label: "Neutral", color: "neutral" }
];
const groupColorExamples: Array<{
  key: string;
  label: string;
  color: "primary" | "success" | "warning" | "error" | "info" | "neutral";
}> = [
  { key: "primary", label: "Primary", color: "primary" },
  { key: "success", label: "Success", color: "success" },
  { key: "warning", label: "Warning", color: "warning" },
  { key: "error", label: "Error", color: "error" },
  { key: "info", label: "Info", color: "info" },
  { key: "neutral", label: "Neutral", color: "neutral" }
];
const checkboxColorExamples: Array<{
  key: string;
  label: string;
  color: "primary" | "neutral" | "success" | "warning" | "error";
}> = [
  { key: "primary", label: "Primary", color: "primary" },
  { key: "neutral", label: "Neutral", color: "neutral" },
  { key: "success", label: "Success", color: "success" },
  { key: "warning", label: "Warning", color: "warning" },
  { key: "error", label: "Error", color: "error" }
];
const controlRows = ref([
  {
    id: "control-1",
    category: "Housing",
    label: "Rent",
    amount: 900,
    status: "Validated"
  },
  {
    id: "control-2",
    category: "Utilities",
    label: "Electricity",
    amount: 82.5,
    status: "To review"
  },
  {
    id: "control-3",
    category: "Subscriptions",
    label: "Streaming",
    amount: 14.99,
    status: "Validated"
  }
]);

const groupedRows = computed(() =>
  Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    return {
      id: `grouped-${number}`,
      label: `Grouped row ${number}`,
      amount: 50 + number,
      status: "planned"
    };
  })
);

const ungroupedRows = computed(() =>
  Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    return {
      id: `ungrouped-${number}`,
      label: `Ungrouped row ${number}`,
      amount: 100 + number,
      status: "open"
    };
  })
);

const ungroupedRowsAfterGroup = computed(() =>
  Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    return {
      id: `ungrouped-after-${number}`,
      label: `Ungrouped row after ${number}`,
      amount: 200 + number,
      status: "open"
    };
  })
);
</script>

<template>
  <BudgetCard title="Table" collapsible v-model:collapsed="tableCollapsed">
    <div class="grid gap-4">
      <BudgetTable v-model:selected="selectedRows" selectable :page-size="3">
        <template #header>
          <BudgetTableHeader sortable sort-key="label">
            <template #prefix>
              <BudgetIcon status="status-info" size="sm" decorative />
            </template>
            Label
          </BudgetTableHeader>
          <BudgetTableHeader sortable sort-key="amount" align="right">
            Amount
            <template #suffix>EUR</template>
          </BudgetTableHeader>
          <BudgetTableHeader sortable sort-key="status">Status</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="standalone-1" :sort-values="{ label: 'Internet', amount: 39.9, status: 'pending' }">
          <BudgetTableCell>Internet</BudgetTableCell>
          <BudgetTableCell align="right">39.90</BudgetTableCell>
          <BudgetTableCell>
            <template #suffix>Pending</template>
          </BudgetTableCell>
          <template #actions>
            <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Open</button>
          </template>
        </BudgetTableRow>

        <BudgetTableGroup title="Upcoming transactions" collapsible color="info">
          <BudgetTableRow row-id="upcoming-1" :sort-values="{ label: 'Rent', amount: 900, status: 'planned' }">
            <BudgetTableCell>Rent</BudgetTableCell>
            <BudgetTableCell align="right">900.00</BudgetTableCell>
            <BudgetTableCell>Planned</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Open</button>
            </template>
          </BudgetTableRow>
          <BudgetTableRow row-id="upcoming-2" :sort-values="{ label: 'Electricity', amount: 82, status: 'planned' }">
            <BudgetTableCell>Electricity</BudgetTableCell>
            <BudgetTableCell align="right">82.00</BudgetTableCell>
            <BudgetTableCell>Planned</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Open</button>
            </template>
          </BudgetTableRow>
        </BudgetTableGroup>

        <BudgetTableGroup
          title="Completed transactions"
          collapsible
          collapsed
          color="success"
        >
          <BudgetTableRow row-id="done-1" :sort-values="{ label: 'Salary', amount: 2200, status: 'paid' }">
            <BudgetTableCell>Salary</BudgetTableCell>
            <BudgetTableCell align="right">2200.00</BudgetTableCell>
            <BudgetTableCell>Paid</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Open</button>
            </template>
          </BudgetTableRow>
          <BudgetTableRow row-id="done-2" :sort-values="{ label: 'Phone', amount: 18, status: 'paid' }">
            <BudgetTableCell>Phone</BudgetTableCell>
            <BudgetTableCell align="right">18.00</BudgetTableCell>
            <BudgetTableCell>Paid</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Open</button>
            </template>
          </BudgetTableRow>
        </BudgetTableGroup>
      </BudgetTable>

      <hr class="border-gray-200">

      <BudgetTable v-model:selected="selectedRowsLarge" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="label">Label</BudgetTableHeader>
          <BudgetTableHeader sortable sort-key="amount" align="right">Amount</BudgetTableHeader>
          <BudgetTableHeader sortable sort-key="status">Status</BudgetTableHeader>
        </template>

        <BudgetTableRow
          v-for="row in ungroupedRows"
          :key="row.id"
          :row-id="row.id"
          :sort-values="{ label: row.label, amount: row.amount, status: row.status }"
        >
          <BudgetTableCell>{{ row.label }}</BudgetTableCell>
          <BudgetTableCell align="right">{{ row.amount.toFixed(2) }}</BudgetTableCell>
          <BudgetTableCell>{{ row.status }}</BudgetTableCell>
        </BudgetTableRow>

        <BudgetTableGroup title="Grouped rows (10)" collapsible color="primary">
          <BudgetTableRow
            v-for="row in groupedRows"
            :key="row.id"
            :row-id="row.id"
            :sort-values="{ label: row.label, amount: row.amount, status: row.status }"
          >
            <BudgetTableCell>{{ row.label }}</BudgetTableCell>
            <BudgetTableCell align="right">{{ row.amount.toFixed(2) }}</BudgetTableCell>
            <BudgetTableCell>{{ row.status }}</BudgetTableCell>
          </BudgetTableRow>
        </BudgetTableGroup>

        <BudgetTableRow
          v-for="row in ungroupedRowsAfterGroup"
          :key="row.id"
          :row-id="row.id"
          :sort-values="{ label: row.label, amount: row.amount, status: row.status }"
        >
          <BudgetTableCell>{{ row.label }}</BudgetTableCell>
          <BudgetTableCell align="right">{{ row.amount.toFixed(2) }}</BudgetTableCell>
          <BudgetTableCell>{{ row.status }}</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>

      <hr class="border-gray-200">

      <BudgetTable v-model:selected="selectedRowsSingleSortable" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="label">Label (triable)</BudgetTableHeader>
          <BudgetTableHeader>Category</BudgetTableHeader>
          <BudgetTableHeader align="right">Amount</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="single-sort-1" :sort-values="{ label: 'Charlie' }">
          <BudgetTableCell>Charlie</BudgetTableCell>
          <BudgetTableCell>Utilities</BudgetTableCell>
          <BudgetTableCell align="right">120.00</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="single-sort-2" :sort-values="{ label: 'Alpha' }">
          <BudgetTableCell>Alpha</BudgetTableCell>
          <BudgetTableCell>Housing</BudgetTableCell>
          <BudgetTableCell align="right">900.00</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="single-sort-3" :sort-values="{ label: 'Bravo' }">
          <BudgetTableCell>Bravo</BudgetTableCell>
          <BudgetTableCell>Food</BudgetTableCell>
          <BudgetTableCell align="right">65.00</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>

      <hr class="border-gray-200">

      <BudgetTable v-model:selected="selectedRowsSizing" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="label" :span="6">Label (6/12)</BudgetTableHeader>
          <BudgetTableHeader fit-content>Type (fit content)</BudgetTableHeader>
          <BudgetTableHeader align="right">Amount (auto)</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="sizing-1" :sort-values="{ label: 'Subscription' }">
          <BudgetTableCell>Subscription to online service</BudgetTableCell>
          <BudgetTableCell>Recurring</BudgetTableCell>
          <BudgetTableCell align="right">19.90</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="sizing-2" :sort-values="{ label: 'Rent' }">
          <BudgetTableCell>Rent</BudgetTableCell>
          <BudgetTableCell>Fixed</BudgetTableCell>
          <BudgetTableCell align="right">900.00</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="sizing-3" :sort-values="{ label: 'One-off expense' }">
          <BudgetTableCell>One-off expense for equipment replacement</BudgetTableCell>
          <BudgetTableCell>One-off</BudgetTableCell>
          <BudgetTableCell align="right">230.00</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>

      <hr class="border-gray-200">

      <BudgetTable>
        <template #header>
          <BudgetTableHeader size="sm">Header sm A</BudgetTableHeader>
          <BudgetTableHeader size="sm">Header sm B</BudgetTableHeader>
          <BudgetTableHeader size="sm">Header sm C</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="header-size-sm-1">
          <BudgetTableCell>Cell A</BudgetTableCell>
          <BudgetTableCell>Cell B</BudgetTableCell>
          <BudgetTableCell>Cell C</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>

      <BudgetTable>
        <template #header>
          <BudgetTableHeader size="md">Header md A</BudgetTableHeader>
          <BudgetTableHeader size="md">Header md B</BudgetTableHeader>
          <BudgetTableHeader size="md">Header md C</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="header-size-md-1">
          <BudgetTableCell>Cell A</BudgetTableCell>
          <BudgetTableCell>Cell B</BudgetTableCell>
          <BudgetTableCell>Cell C</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>

      <BudgetTable>
        <template #header>
          <BudgetTableHeader size="lg">Header lg A</BudgetTableHeader>
          <BudgetTableHeader size="lg">Header lg B</BudgetTableHeader>
          <BudgetTableHeader size="lg">Header lg C</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="header-size-lg-1">
          <BudgetTableCell>Cell A</BudgetTableCell>
          <BudgetTableCell>Cell B</BudgetTableCell>
          <BudgetTableCell>Cell C</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>

      <hr class="border-gray-200">

      <div
        v-for="example in headerColorExamples"
        :key="example.key"
        class="space-y-1"
      >
        <div class="text-sm font-medium text-slate-700 dark:text-slate-200">
          {{ example.label }}
        </div>
        <BudgetTable
          v-model:selected="selectedRowsHeaderColors[example.key]"
          selectable
          :select-all-color="example.color"
          :checkbox-color="example.color === 'gray' || example.color === 'info' ? 'neutral' : (example.color ?? 'neutral')"
        >
          <template #header>
            <BudgetTableHeader :color="example.color">Column A</BudgetTableHeader>
            <BudgetTableHeader :color="example.color">Column B</BudgetTableHeader>
            <BudgetTableHeader :color="example.color">Column C</BudgetTableHeader>
          </template>

          <BudgetTableRow :row-id="`header-color-${example.key}-1`">
            <BudgetTableCell>Row 1 A</BudgetTableCell>
            <BudgetTableCell>Row 1 B</BudgetTableCell>
            <BudgetTableCell>Row 1 C</BudgetTableCell>
          </BudgetTableRow>
          <BudgetTableRow :row-id="`header-color-${example.key}-2`">
            <BudgetTableCell>Row 2 A</BudgetTableCell>
            <BudgetTableCell>Row 2 B</BudgetTableCell>
            <BudgetTableCell>Row 2 C</BudgetTableCell>
          </BudgetTableRow>
          <BudgetTableRow :row-id="`header-color-${example.key}-3`">
            <BudgetTableCell>Row 3 A</BudgetTableCell>
            <BudgetTableCell>Row 3 B</BudgetTableCell>
            <BudgetTableCell>Row 3 C</BudgetTableCell>
          </BudgetTableRow>
        </BudgetTable>
      </div>

      <hr class="border-gray-200">

      <div
        v-for="example in checkboxColorExamples"
        :key="`checkbox-color-${example.key}`"
        class="space-y-1"
      >
        <div class="text-sm font-medium text-slate-700 dark:text-slate-200">
          Checkbox color: {{ example.label }}
        </div>
        <BudgetTable
          v-model:selected="selectedRowsCheckboxColors[example.key]"
          selectable
          :checkbox-color="example.color"
        >
          <template #header>
            <BudgetTableHeader>Column A</BudgetTableHeader>
            <BudgetTableHeader>Column B</BudgetTableHeader>
            <BudgetTableHeader>Column C</BudgetTableHeader>
          </template>

          <BudgetTableRow :row-id="`checkbox-color-${example.key}-1`">
            <BudgetTableCell>Row 1 A</BudgetTableCell>
            <BudgetTableCell>Row 1 B</BudgetTableCell>
            <BudgetTableCell>Row 1 C</BudgetTableCell>
          </BudgetTableRow>
          <BudgetTableRow :row-id="`checkbox-color-${example.key}-2`" checkbox-color="neutral">
            <BudgetTableCell>Row 2 A</BudgetTableCell>
            <BudgetTableCell>Row 2 B</BudgetTableCell>
            <BudgetTableCell>Row 2 C (row override: neutral)</BudgetTableCell>
          </BudgetTableRow>
        </BudgetTable>
      </div>

      <hr class="border-gray-200">

      <BudgetTable>
        <template #header>
          <BudgetTableHeader>Libelle</BudgetTableHeader>
          <BudgetTableHeader align="right">Montant</BudgetTableHeader>
          <BudgetTableHeader>Statut</BudgetTableHeader>
        </template>

        <BudgetTableGroup
          v-for="example in groupColorExamples"
          :key="`group-color-${example.key}`"
          :title="`Groupe ${example.label}`"
          :color="example.color"
          collapsible
          collapsed
        >
          <BudgetTableRow
            :row-id="`group-color-${example.key}-1`"
            :sort-values="{ label: `${example.label} row 1`, amount: 120, status: 'open' }"
          >
            <BudgetTableCell>{{ example.label }} row 1</BudgetTableCell>
            <BudgetTableCell align="right">120.00</BudgetTableCell>
            <BudgetTableCell>Open</BudgetTableCell>
          </BudgetTableRow>
          <BudgetTableRow
            :row-id="`group-color-${example.key}-2`"
            :sort-values="{ label: `${example.label} row 2`, amount: 80, status: 'planned' }"
          >
            <BudgetTableCell>{{ example.label }} row 2</BudgetTableCell>
            <BudgetTableCell align="right">80.00</BudgetTableCell>
            <BudgetTableCell>Planned</BudgetTableCell>
          </BudgetTableRow>
          <BudgetTableRow
            :row-id="`group-color-${example.key}-3`"
            :sort-values="{ label: `${example.label} row 3`, amount: 45, status: 'done' }"
          >
            <BudgetTableCell>{{ example.label }} row 3</BudgetTableCell>
            <BudgetTableCell align="right">45.00</BudgetTableCell>
            <BudgetTableCell>Done</BudgetTableCell>
          </BudgetTableRow>
        </BudgetTableGroup>
      </BudgetTable>

      <hr class="border-gray-200">

      <BudgetTable v-model:selected="selectedRowsControls" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="category">Category</BudgetTableHeader>
          <BudgetTableHeader>Amount input (control)</BudgetTableHeader>
          <BudgetTableHeader>Status</BudgetTableHeader>
        </template>

        <BudgetTableRow
          v-for="row in controlRows"
          :key="row.id"
          :row-id="row.id"
          :sort-values="{ category: row.category }"
        >
          <BudgetTableCell>
            <div class="font-medium">{{ row.category }}</div>
            <div class="text-xs text-slate-500">{{ row.label }}</div>
          </BudgetTableCell>
          <BudgetTableCell>
            <div class="max-w-[220px]">
              <BudgetAmountInput v-model="row.amount" />
            </div>
          </BudgetTableCell>
          <BudgetTableCell>{{ row.status }}</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>
    </div>
  </BudgetCard>
</template>
