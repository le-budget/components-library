<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetCategoryItem from "../../components/BudgetCategoryItem/BudgetCategoryItem.vue";

const categoryItemCollapsed = ref(true);
const selectedDefault = ref(false);
const selectedSpent = ref(true);
const selectedFunded = ref(false);
</script>

<template>
  <BudgetCard title="Category Item" collapsible v-model:collapsed="categoryItemCollapsed">
    <div class="grid gap-4">
      <div class="rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryItem
          v-model="selectedDefault"
          :has-drag-handle="true"
          label="Internet et mobiles"
          assigned="201,96 EUR"
          activity="-126,98 EUR"
          available="74,98 EUR"
          :progress="63"
          progress-label="Depense 126,98 EUR sur 201,96 EUR"
          tone="warning"
        >
          <template #prefix>
            <span class="font-semibold text-slate-500">NET</span>
          </template>

          <template #dragHandle>
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
              DR
            </span>
          </template>
        </BudgetCategoryItem>

        <BudgetCategoryItem
          v-model="selectedSpent"
          label="Louis"
          assigned="20,00 EUR"
          activity="-20,00 EUR"
          available="0,00 EUR"
          :progress="100"
          progress-label="Totalement depense"
          tone="neutral"
        >
          <template #prefix>
            <span class="font-semibold text-slate-500">LOU</span>
          </template>
        </BudgetCategoryItem>

        <BudgetCategoryItem
          v-model="selectedFunded"
          label="Eau"
          assigned="30,00 EUR"
          activity="0,00 EUR"
          available="150,00 EUR"
          :progress="20"
          progress-label="Finance"
          tone="success"
        >
          <template #prefix>
            <span class="font-semibold text-slate-500">EAU</span>
          </template>
        </BudgetCategoryItem>
      </div>

      <div class="rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryItem
          v-model="selectedDefault"
          size="md"
          :has-drag-handle="true"
          label="Internet et mobiles"
          assigned="201,96 EUR"
          activity="-126,98 EUR"
          available="74,98 EUR"
          :progress="63"
          progress-label="Depense 126,98 EUR sur 201,96 EUR"
          tone="warning"
        >
          <template #prefix>
            <span class="font-semibold text-slate-500">NET</span>
          </template>
        </BudgetCategoryItem>
      </div>

      <div class="rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryItem
          v-model="selectedFunded"
          size="sm"
          :has-drag-handle="true"
          label="Eau"
          assigned="30,00 EUR"
          activity="0,00 EUR"
          available="150,00 EUR"
          :progress="20"
          progress-label="Finance"
          tone="success"
        >
          <template #prefix>
            <span class="font-semibold text-slate-500">EAU</span>
          </template>
        </BudgetCategoryItem>
      </div>
    </div>
  </BudgetCard>
</template>
