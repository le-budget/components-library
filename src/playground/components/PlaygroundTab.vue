<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";
import BudgetTab from "../../components/BudgetTab/BudgetTab.vue";
import BudgetTabItem from "../../components/BudgetTabItem/BudgetTabItem.vue";

const tabCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Tab" collapsible v-model:collapsed="tabCollapsed">
    <div class="grid gap-4">
      <BudgetTab>
        <BudgetTabItem title="Synthese" color="primary" :default-active="true">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
          Mode colle: onglets adjacents, arrondis exterieurs en haut.
        </BudgetTabItem>
        <BudgetTabItem title="Comptes" color="secondary-success">
          <template #icon>
            <BudgetIcon status="status-success" decorative />
          </template>
          Repartition des comptes actifs.
        </BudgetTabItem>
        <BudgetTabItem title="Alertes" color="primary-warning">
          <template #icon>
            <BudgetIcon status="status-warning" decorative />
          </template>
          Alertes de depassement et actions recommandees.
        </BudgetTabItem>
      </BudgetTab>

      <hr class="border-gray-200">

      <BudgetTab :spaced="true">
        <BudgetTabItem title="Primary" color="primary" :default-active="true">
          Mode espace: chaque onglet garde ses coins arrondis.
        </BudgetTabItem>
        <BudgetTabItem title="Secondary" color="secondary">
          Couleur secondary.
        </BudgetTabItem>
        <BudgetTabItem title="Ghost" color="ghost">
          Couleur ghost.
        </BudgetTabItem>
        <BudgetTabItem title="Primary Success" color="primary-success">
          Couleur primary-success.
        </BudgetTabItem>
        <BudgetTabItem title="Secondary Success" color="secondary-success">
          Couleur secondary-success.
        </BudgetTabItem>
        <BudgetTabItem title="Primary Warning" color="primary-warning">
          Couleur primary-warning.
        </BudgetTabItem>
        <BudgetTabItem title="Secondary Warning" color="secondary-warning">
          Couleur secondary-warning.
        </BudgetTabItem>
        <BudgetTabItem title="Primary Error" color="primary-error">
          Couleur primary-error.
        </BudgetTabItem>
        <BudgetTabItem title="Secondary Error" color="secondary-error" disabled>
          Couleur secondary-error (disabled).
        </BudgetTabItem>
      </BudgetTab>
    </div>
  </BudgetCard>
</template>
