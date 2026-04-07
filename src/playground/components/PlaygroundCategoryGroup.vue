<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetCategoryGroup from "../../components/BudgetCategoryGroup/BudgetCategoryGroup.vue";
import BudgetCategoryItem from "../../components/BudgetCategoryItem/BudgetCategoryItem.vue";

const categoryGroupCollapsed = ref(true);
const groupSelected = ref(false);
const groupOpen = ref(false);
const itemASelected = ref(false);
const itemBSelected = ref(true);
const itemCSelected = ref(false);
const compactGroupSelected = ref(false);
const compactGroupOpen = ref(false);
const compactItemSelected = ref(false);
</script>

<template>
  <BudgetCard title="Category Group" collapsible v-model:collapsed="categoryGroupCollapsed">
    <div class="grid gap-4">
      <div class="rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryGroup
          v-model="groupSelected"
          v-model:collapsed="groupOpen"
          :has-drag-handle="true"
          title="Factures"
          assigned="821,07 EUR"
          activity="-627,23 EUR"
          available="313,84 EUR"
          :indeterminate="true"
        >
          <template #dragHandle>
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
              DR
            </span>
          </template>

          <BudgetCategoryItem
            v-model="itemASelected"
            label="Electricite"
            assigned="301,33 EUR"
            activity="-301,33 EUR"
            available="0,00 EUR"
            :progress="100"
            progress-label="Totalement depense"
            tone="neutral"
          >
            <template #prefix>
              <span class="font-semibold text-slate-500">ELEC</span>
            </template>
          </BudgetCategoryItem>

          <BudgetCategoryItem
            v-model="itemBSelected"
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

          <BudgetCategoryItem
            v-model="itemCSelected"
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
        </BudgetCategoryGroup>
      </div>

      <div class="rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryGroup
          v-model="compactGroupSelected"
          v-model:collapsed="compactGroupOpen"
          size="sm"
          :has-drag-handle="true"
          title="Credits"
          assigned="1489,81 EUR"
          activity="-1374,58 EUR"
          available="115,23 EUR"
        >
          <BudgetCategoryItem
            v-model="compactItemSelected"
            label="Credit automobile"
            assigned="536,90 EUR"
            activity="-536,90 EUR"
            available="0,00 EUR"
            :progress="100"
            progress-label="Totalement depense"
            tone="neutral"
          >
            <template #prefix>
              <span class="font-semibold text-slate-500">AUTO</span>
            </template>
          </BudgetCategoryItem>
        </BudgetCategoryGroup>
      </div>
    </div>
  </BudgetCard>
</template>
