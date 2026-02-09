<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetStatus from "../../components/BudgetStatus/BudgetStatus.vue";

const statusCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Status" collapsible v-model:collapsed="statusCollapsed">
    <div class="grid gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <BudgetStatus color="primary" label="Primary status" />
        <BudgetStatus color="neutral" label="Neutral status" />
        <BudgetStatus color="success" label="Success status" />
        <BudgetStatus color="warning" label="Warning status" />
        <BudgetStatus color="error" label="Error status" />
      </div>

      <hr class="border-gray-200">

      <div class="flex flex-wrap items-center gap-3">
        <BudgetStatus size="sm" label="Small status" />
        <BudgetStatus size="md" label="Medium status" />
        <BudgetStatus size="lg" label="Large status" />
        <BudgetStatus size="xl" label="Extra large status" />
        <BudgetStatus size="xxl" label="2X large status" />
      </div>

      <hr class="border-gray-200">

      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-2">
          <BudgetStatus animation="bounce" label="Bounce status" />
          <span class="text-sm">Bounce</span>
        </div>
        <div class="flex items-center gap-2">
          <BudgetStatus animation="pulse" label="Pulse status" />
          <span class="text-sm">Pulse</span>
        </div>
        <div class="flex items-center gap-2">
          <BudgetStatus animation="ping" label="Ping status" />
          <span class="text-sm">Ping</span>
        </div>
      </div>
    </div>
  </BudgetCard>
</template>
