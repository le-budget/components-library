<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetDivider from "../../components/BudgetDivider/BudgetDivider.vue";

const dividerCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Divider" collapsible v-model:collapsed="dividerCollapsed">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Horizontal</span>
        <BudgetDivider />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Couleurs</span>
        <BudgetDivider color="primary" />
        <BudgetDivider color="neutral" />
        <BudgetDivider color="success" />
        <BudgetDivider color="warning" />
        <BudgetDivider color="error" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Styles de ligne</span>
        <BudgetDivider line-style="solid" />
        <BudgetDivider line-style="dashed" />
        <BudgetDivider line-style="dotted" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Epaisseur</span>
        <BudgetDivider thickness="sm" />
        <BudgetDivider thickness="md" />
        <BudgetDivider thickness="lg" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Vertical</span>
        <div class="flex h-20 items-stretch gap-4 rounded border border-slate-200 p-3">
          <span class="text-sm">A</span>
          <BudgetDivider orientation="vertical" color="primary" />
          <span class="text-sm">B</span>
          <BudgetDivider orientation="vertical" color="warning" line-style="dashed" thickness="lg" />
          <span class="text-sm">C</span>
        </div>
      </div>
    </div>
  </BudgetCard>
</template>
