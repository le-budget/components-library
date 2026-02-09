<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetButtonGroup from "../../components/BudgetButtonGroup/BudgetButtonGroup.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const buttonGroupCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Button Group" collapsible v-model:collapsed="buttonGroupCollapsed">
    <div class="grid gap-4">
      <BudgetButtonGroup>
        <BudgetButton color="secondary">Jour</BudgetButton>
        <BudgetButton color="secondary">Semaine</BudgetButton>
        <BudgetButton color="secondary">Mois</BudgetButton>
      </BudgetButtonGroup>

      <hr class="border-gray-200">

      <BudgetButtonGroup>
        <BudgetButton color="primary">Principal</BudgetButton>
        <BudgetButton color="secondary">Secondaire</BudgetButton>
        <BudgetButton color="ghost">Ghost</BudgetButton>
      </BudgetButtonGroup>

      <hr class="border-gray-200">

      <BudgetButtonGroup>
        <BudgetButton color="primary-success">Succes</BudgetButton>
        <BudgetButton color="secondary-warning">Alerte</BudgetButton>
        <BudgetButton color="secondary-error">Erreur</BudgetButton>
      </BudgetButtonGroup>

      <hr class="border-gray-200">

      <BudgetButtonGroup>
        <BudgetButton color="primary">Unique</BudgetButton>
      </BudgetButtonGroup>

      <hr class="border-gray-200">

      <BudgetButtonGroup>
        <BudgetButton color="secondary" loading>Chargement</BudgetButton>
        <BudgetButton color="secondary">Pret</BudgetButton>
        <BudgetButton color="secondary">Termine</BudgetButton>
      </BudgetButtonGroup>

      <hr class="border-gray-200">

      <BudgetButtonGroup>
        <BudgetButton color="primary">
          <template #icon>
            <BudgetIcon status="status-info" />
          </template>
          Filtrer
        </BudgetButton>
        <BudgetButton color="primary-success">
          Exporter
          <template #iconRight>
            <BudgetIcon status="status-success" />
          </template>
        </BudgetButton>
        <BudgetButton color="secondary-warning">
          <template #icon>
            <BudgetIcon status="status-warning" />
          </template>
          Alerte
        </BudgetButton>
      </BudgetButtonGroup>

      <hr class="border-gray-200">

      <BudgetButtonGroup>
        <BudgetButton color="secondary" aria-label="Ajouter">
          <template #icon>
            <BudgetIcon status="status-info" />
          </template>
        </BudgetButton>
        <BudgetButton color="secondary-success" aria-label="Valider">
          <template #icon>
            <BudgetIcon status="status-success" />
          </template>
        </BudgetButton>
        <BudgetButton color="secondary-error" aria-label="Supprimer">
          <template #icon>
            <BudgetIcon status="status-error" />
          </template>
        </BudgetButton>
      </BudgetButtonGroup>
    </div>
  </BudgetCard>
</template>
