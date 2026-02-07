<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetDropdown from "../../components/BudgetDropdown/BudgetDropdown.vue";
import BudgetDropdownGroup from "../../components/BudgetDropdownGroup/BudgetDropdownGroup.vue";
import BudgetDropdownOption from "../../components/BudgetDropdownOption/BudgetDropdownOption.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const dropdownCollapsed = ref(true);
const selectedCategory = ref<string | number | null>(null);
const customValue = ref<string | number | null>(null);
const suffixExampleValue = ref<string | number | null>(null);
</script>

<template>
  <BudgetCard title="Dropdown" collapsible v-model:collapsed="dropdownCollapsed">
    <div class="grid gap-4">
      <BudgetDropdown
        v-model="selectedCategory"
        label="Categorie"
        placeholder="Selectionner une categorie"
      >
        <BudgetDropdownGroup label="Revenus">
          <BudgetDropdownOption label="Salaire" value="salary" />
          <BudgetDropdownOption label="Freelance" value="freelance" />
        </BudgetDropdownGroup>
        <BudgetDropdownGroup label="Depenses">
          <BudgetDropdownOption label="Épargne" value="epargne" />
          <BudgetDropdownOption label="Loyer" value="rent" />
          <BudgetDropdownOption label="Transport" value="transport" disabled />
        </BudgetDropdownGroup>
      </BudgetDropdown>

      <hr class="border-gray-200">

      <BudgetDropdown
        v-model="customValue"
        label="Recherche + valeur libre"
        placeholder="Saisir une valeur"
        :allow-custom-value="true"
      >
        <template #prefix>
          <BudgetIcon status="status-info" decorative />
        </template>
        <BudgetDropdownGroup label="Suggestions">
          <BudgetDropdownOption label="Économie" value="economie" />
          <BudgetDropdownOption label="Épargne" value="epargne" />
          <BudgetDropdownOption label="Impôts" value="impots" />
        </BudgetDropdownGroup>
      </BudgetDropdown>

      <hr class="border-gray-200">

      <BudgetDropdown
        v-model="suffixExampleValue"
        label="Avec slot suffix"
        placeholder="Choisir un element"
      >
        <template #suffix>
          <BudgetIcon status="status-info" decorative />
        </template>
        <BudgetDropdownGroup label="Actions">
          <BudgetDropdownOption label="Ajouter" value="add">
            <template #right>+120,00 €</template>
          </BudgetDropdownOption>
          <BudgetDropdownOption label="Modifier" value="edit">
            <template #right>+45,00 €</template>
          </BudgetDropdownOption>
          <BudgetDropdownOption label="Supprimer" value="delete">
            <template #right>-30,00 €</template>
          </BudgetDropdownOption>
        </BudgetDropdownGroup>
      </BudgetDropdown>
    </div>
  </BudgetCard>
</template>
