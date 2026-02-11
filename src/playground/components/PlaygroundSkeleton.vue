<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetLoading from "../../components/BudgetLoading/BudgetLoading.vue";
import BudgetSkeleton from "../../components/BudgetSkeleton/BudgetSkeleton.vue";

const skeletonCollapsed = ref(true);
const loading = ref(true);
</script>

<template>
  <BudgetCard title="Skeleton" collapsible v-model:collapsed="skeletonCollapsed">
    <div class="grid gap-5">
      <div class="grid gap-3">
        <h4 class="text-sm font-semibold">Presets</h4>
        <BudgetSkeleton variant="text" :lines="3" />
        <BudgetSkeleton variant="rect" height="56px" />
        <BudgetSkeleton variant="circle" width="44" height="44" />
        <BudgetSkeleton variant="image" ratio="16:9" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-3">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-sm font-semibold">BudgetLoading</h4>
          <BudgetButton size="sm" color="secondary" @click="loading = !loading">
            Toggle loading
          </BudgetButton>
        </div>

        <BudgetLoading :loading="loading" :lines="2">
          <div class="rounded-md border border-slate-200 p-4 dark:border-slate-700">
            <p class="text-sm font-semibold">Apercu facture</p>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Le contenu est affiche lorsque loading est desactive.
            </p>
          </div>
        </BudgetLoading>
      </div>
    </div>
  </BudgetCard>
</template>
