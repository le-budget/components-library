<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetDatepicker from "../../components/BudgetDatepicker/BudgetDatepicker.vue";

const datepickerCollapsed = ref(true);
const selectedDate = ref<string | null>("2026-02-08");
const boundedDate = ref<string | null>("2026-02-15");
const emptyDate = ref<string | null>(null);
const sizeSmDate = ref<string | null>(null);
const sizeMdDate = ref<string | null>(null);
const sizeLgDate = ref<string | null>(null);
</script>

<template>
  <BudgetCard title="Datepicker" collapsible v-model:collapsed="datepickerCollapsed">
    <div class="grid gap-4">
      <BudgetDatepicker
        v-model="selectedDate"
        label="Date"
        placeholder="jj/mm/aaaa"
      />

      <hr class="border-gray-200">

      <div class="grid gap-3">
        <BudgetDatepicker
          v-model="sizeSmDate"
          label="Taille sm"
          size="sm"
          placeholder="jj/mm/aaaa"
        />
        <BudgetDatepicker
          v-model="sizeMdDate"
          label="Taille md"
          size="md"
          placeholder="jj/mm/aaaa"
        />
        <BudgetDatepicker
          v-model="sizeLgDate"
          label="Taille lg"
          size="lg"
          placeholder="jj/mm/aaaa"
        />
      </div>

      <hr class="border-gray-200">

      <BudgetDatepicker
        v-model="emptyDate"
        placeholder="jj/mm/aaaa"
      />

      <hr class="border-gray-200">

      <BudgetDatepicker
        v-model="selectedDate"
        label="Alignement a droite"
        align="right"
      />

      <hr class="border-gray-200">

      <BudgetDatepicker
        v-model="boundedDate"
        label="Date avec bornes"
        min-date="2026-02-10"
        max-date="2026-02-20"
      />

      <hr class="border-gray-200">

      <div class="max-w-[180px]">
        <BudgetDatepicker
          v-model="selectedDate"
          class="playground-datepicker-compact"
          label="Input compact / calendrier large"
          placeholder="jj/mm/aaaa"
        />
      </div>

      <hr class="border-gray-200">

      <BudgetDatepicker
        v-model="selectedDate"
        label="On error"
        error
        error-message="Date invalide"
      />

      <hr class="border-gray-200">

      <BudgetDatepicker
        v-model="selectedDate"
        label="On success"
        success
      />

      <hr class="border-gray-200">

      <BudgetDatepicker
        v-model="selectedDate"
        label="Disabled"
        disabled
      />
    </div>
  </BudgetCard>
</template>

<style scoped>
.playground-datepicker-compact :deep([role="dialog"]) {
  min-width: 18rem;
}
</style>
