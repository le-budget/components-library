<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetCategoryContainer from "../../components/BudgetCategoryContainer/BudgetCategoryContainer.vue";
import type {
  BudgetCategoryContainerGroup,
  BudgetCategoryContainerOrderEntry
} from "../../components/BudgetCategoryContainer/budgetCategoryContainer.types";

const categoryContainerCollapsed = ref(true);
const lastOrder = ref<BudgetCategoryContainerOrderEntry[]>([]);
const groups = ref<BudgetCategoryContainerGroup[]>([
  {
    id: "group-factures",
    title: "Factures",
    assigned: "821,07 EUR",
    activity: "-627,23 EUR",
    available: "313,84 EUR",
    selected: false,
    collapsed: false,
    indeterminate: true,
    items: [
      {
        id: "item-electricite",
        label: "Electricite",
        assigned: "301,33 EUR",
        activity: "-301,33 EUR",
        available: "0,00 EUR",
        progress: 100,
        progressLabel: "Totalement depense",
        tone: "neutral",
        selected: false,
        prefixText: "ELEC"
      },
      {
        id: "item-eau",
        label: "Eau",
        assigned: "30,00 EUR",
        activity: "0,00 EUR",
        available: "150,00 EUR",
        progress: 20,
        progressLabel: "Finance",
        tone: "success",
        selected: true,
        prefixText: "EAU"
      }
    ]
  },
  {
    id: "group-credits",
    title: "Credits",
    assigned: "1489,81 EUR",
    activity: "-1374,58 EUR",
    available: "115,23 EUR",
    selected: false,
    collapsed: false,
    items: [
      {
        id: "item-auto",
        label: "Credit automobile",
        assigned: "536,90 EUR",
        activity: "-536,90 EUR",
        available: "0,00 EUR",
        progress: 100,
        progressLabel: "Totalement depense",
        tone: "neutral",
        selected: false,
        prefixText: "AUTO"
      }
    ]
  },
  {
    id: "group-epargne",
    title: "Epargne",
    assigned: "200,00 EUR",
    activity: "0,00 EUR",
    available: "200,00 EUR",
    selected: false,
    collapsed: false,
    items: []
  }
]);

function onGroupsUpdate(value: BudgetCategoryContainerGroup[]) {
  groups.value = value;
}

function onReorder(value: BudgetCategoryContainerOrderEntry[]) {
  lastOrder.value = value;
}
</script>

<template>
  <BudgetCard
    title="Category Container"
    collapsible
    v-model:collapsed="categoryContainerCollapsed"
  >
    <div class="grid gap-4">
      <div class="rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryContainer
          :groups="groups"
          size="md"
          @update:groups="onGroupsUpdate"
          @reorder="onReorder"
        />
      </div>

      <pre class="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{{
        JSON.stringify(lastOrder, null, 2)
      }}</pre>
    </div>
  </BudgetCard>
</template>
