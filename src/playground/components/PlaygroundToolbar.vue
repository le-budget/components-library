<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";
import BudgetToolbar from "../../components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItem from "../../components/BudgetToolbarItem/BudgetToolbarItem.vue";
import BudgetToolbarItemButton from "../../components/BudgetToolbarItemButton/BudgetToolbarItemButton.vue";
import BudgetToolbarItemSeparator from "../../components/BudgetToolbarItemSeparator/BudgetToolbarItemSeparator.vue";

const toolbarCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Toolbar" collapsible v-model:collapsed="toolbarCollapsed">
    <div class="grid gap-4">
      <BudgetToolbar label="Actions principales">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton>Ajouter</BudgetToolbarItemButton>
        </BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem>
          <BudgetToolbarItemButton color="secondary">Exporter</BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>

      <hr class="border-gray-200">

      <BudgetToolbar label="Actions avec icones" size="sm">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton aria-label="Filtrer">
            <template #icon>
              <BudgetIcon status="status-info" decorative />
            </template>
          </BudgetToolbarItemButton>
        </BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem>
          <BudgetToolbarItemButton color="primary-success">
            <template #icon>
              <BudgetIcon status="status-success" decorative />
            </template>
            Valider
          </BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>

      <hr class="border-gray-200">

      <BudgetToolbar label="Actions verticales" orientation="vertical" size="lg">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton active>Action 1</BudgetToolbarItemButton>
        </BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem>
          <BudgetToolbarItemButton color="secondary-warning">Action 2</BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>

      <hr class="border-gray-200">

      <BudgetToolbar label="Actions desactivees" disabled>
        <BudgetToolbarItem>
          <BudgetToolbarItemButton>Bloque</BudgetToolbarItemButton>
        </BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem>
          <BudgetToolbarItemButton color="secondary-error">Supprimer</BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>

      <hr class="border-gray-200">

      <div class="w-full">
        <BudgetToolbar label="Actions alignees a droite" align="right">
          <BudgetToolbarItem>
            <BudgetToolbarItemButton>Annuler</BudgetToolbarItemButton>
          </BudgetToolbarItem>
          <BudgetToolbarItemSeparator />
          <BudgetToolbarItem>
            <BudgetToolbarItemButton color="primary-success">Valider</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        </BudgetToolbar>
      </div>
    </div>
  </BudgetCard>
</template>
