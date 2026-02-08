<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetRadio from "../../components/BudgetRadio/BudgetRadio.vue";
import BudgetRadioGroup from "../../components/BudgetRadioGroup/BudgetRadioGroup.vue";

const radioCollapsed = ref(true);
const frequency = ref("monthly");
const verticalFrequency = ref("weekly");
const colorValue = ref("primary");
</script>

<template>
  <BudgetCard title="Radio" collapsible v-model:collapsed="radioCollapsed">
    <div class="grid gap-4">
      <BudgetRadioGroup v-model="frequency" label="Frequence">
        <BudgetRadio value="weekly" label="Hebdomadaire" />
        <BudgetRadio value="monthly" label="Mensuel" />
        <BudgetRadio value="yearly" label="Annuel" />
      </BudgetRadioGroup>

      <hr class="border-gray-200">

      <BudgetRadioGroup v-model="verticalFrequency" label="Vertical" orientation="vertical">
        <BudgetRadio value="weekly" label="Hebdomadaire" />
        <BudgetRadio value="monthly" label="Mensuel" />
        <BudgetRadio value="yearly" label="Annuel" />
      </BudgetRadioGroup>

      <hr class="border-gray-200">

      <BudgetRadioGroup v-model="colorValue" label="Couleurs">
        <BudgetRadio value="primary" label="Primary" color="primary" />
        <BudgetRadio value="neutral" label="Neutral" color="neutral" />
        <BudgetRadio value="success" label="Success" color="success" />
        <BudgetRadio value="warning" label="Warning" color="warning" />
        <BudgetRadio value="error" label="Error" color="error" />
      </BudgetRadioGroup>

      <hr class="border-gray-200">

      <BudgetRadioGroup v-model="frequency" label="Tailles">
        <BudgetRadio value="weekly" label="Small" size="sm" />
        <BudgetRadio value="monthly" label="Medium" size="md" />
        <BudgetRadio value="yearly" label="Large" size="lg" />
      </BudgetRadioGroup>

      <hr class="border-gray-200">

      <BudgetRadioGroup v-model="frequency" label="Validation" error error-message="Selection obligatoire">
        <BudgetRadio value="weekly" label="Hebdomadaire" />
        <BudgetRadio value="monthly" label="Mensuel" />
      </BudgetRadioGroup>
    </div>
  </BudgetCard>
</template>
