<script setup lang="ts">
import { ref } from "vue";
import BudgetAccordion from "../../components/BudgetAccordion/BudgetAccordion.vue";
import BudgetAccordionItem from "../../components/BudgetAccordionItem/BudgetAccordionItem.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const accordionCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Accordion" collapsible v-model:collapsed="accordionCollapsed">
    <div class="grid gap-4">
      <BudgetAccordion>
        <BudgetAccordionItem title="Section principale" color="primary" :default-open="true">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
          Une seule section reste ouverte a la fois.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Section secondaire" color="primary-warning">
          Contenu de la section secondaire.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Section risque" color="primary-error">
          Contenu de la section risque.
        </BudgetAccordionItem>
      </BudgetAccordion>

      <hr class="border-gray-200">

      <BudgetAccordion :multiple="true" :spaced="true">
        <BudgetAccordionItem title="Comptes actifs" color="secondary-success" :default-open="true">
          <template #icon>
            <BudgetIcon status="status-success" decorative />
          </template>
          Plusieurs sections peuvent rester ouvertes.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="En attente" color="secondary">
          Demandes en attente de validation.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Bloque" color="secondary-error" disabled>
          Cette section est desactivee.
        </BudgetAccordionItem>
      </BudgetAccordion>

      <hr class="border-gray-200">

      <BudgetAccordion :multiple="true" :spaced="true">
        <BudgetAccordionItem title="Primary" color="primary" :default-open="true">
          Couleur d'entete primary.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Secondary" color="secondary">
          Couleur d'entete secondary.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Ghost" color="ghost">
          Couleur d'entete ghost.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Primary Success" color="primary-success">
          Couleur d'entete primary-success.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Secondary Success" color="secondary-success">
          Couleur d'entete secondary-success.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Primary Warning" color="primary-warning">
          Couleur d'entete primary-warning.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Secondary Warning" color="secondary-warning">
          Couleur d'entete secondary-warning.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Primary Error" color="primary-error">
          Couleur d'entete primary-error.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Secondary Error" color="secondary-error">
          Couleur d'entete secondary-error.
        </BudgetAccordionItem>
      </BudgetAccordion>
    </div>
  </BudgetCard>
</template>
