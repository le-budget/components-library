<script setup lang="ts">
import { ref } from "vue";
import BudgetAmountInput from "../../components/BudgetAmountInput/BudgetAmountInput.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const inputAmountCollapsed = ref(true);

const amount = ref(1250.5);
const amountEmpty = ref<number | null>(null);
</script>

<template>
  <BudgetCard title="Input Amount" collapsible v-model:collapsed="inputAmountCollapsed">
    <div class="grid gap-4">
      <BudgetAmountInput v-model="amount" label="Montant" placeholder="0,00" />
      <hr class="border-gray-200">
      <div class="grid gap-3">
        <BudgetAmountInput v-model="amount" label="Taille sm" size="sm" />
        <BudgetAmountInput v-model="amount" label="Taille md" size="md" />
        <BudgetAmountInput v-model="amount" label="Taille lg" size="lg" />
      </div>
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amount" placeholder="0,00" />
      <hr class="border-gray-200">
      <BudgetAmountInput
        v-model="amount"
        label="Alignement a droite"
        align="right"
      />
      <hr class="border-gray-200">
      <BudgetAmountInput
        v-model="amount"
        label="On error"
        error
        error-message="Montant invalide"
      />
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amount" label="On success" success />
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amount" label="Disabled" disabled />
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amountEmpty" label="Allow empty" :allow-empty="true" />
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amount" label="Prefix icon">
        <template #prefix>
          <BudgetIcon status="status-info" size="sm" />
        </template>
      </BudgetAmountInput>
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amount" label="Suffix icon">
        <template #suffix>
          <BudgetIcon status="status-success" size="sm" />
        </template>
      </BudgetAmountInput>
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amount" label="Prefix text">
        <template #prefix>
          <span class="text-xs font-semibold text-slate-500">EUR</span>
        </template>
      </BudgetAmountInput>
      <hr class="border-gray-200">
      <BudgetAmountInput v-model="amount" label="Suffix text">
        <template #suffix>
          <span class="text-xs font-semibold text-slate-500">TTC</span>
        </template>
      </BudgetAmountInput>
    </div>
  </BudgetCard>
</template>
