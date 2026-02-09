<script setup lang="ts">
import { ref } from "vue";
import BudgetAlert from "../../components/BudgetAlert/BudgetAlert.vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const alertCollapsed = ref(true);
const showAutoDismissDemo = ref(false);
const autoDismissKey = ref(0);

function showAutoDismissAlert() {
  showAutoDismissDemo.value = true;
  autoDismissKey.value += 1;
}
</script>

<template>
  <BudgetCard title="Alert" collapsible v-model:collapsed="alertCollapsed">
    <div class="grid gap-4">
      <BudgetAlert text="Alerte par defaut." />

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <BudgetAlert color="primary" text="Primary" />
        <BudgetAlert color="secondary" text="Secondary" />
        <BudgetAlert color="ghost" text="Ghost" />
        <BudgetAlert color="primary-success" text="Primary Success" />
        <BudgetAlert color="secondary-success" text="Secondary Success" />
        <BudgetAlert color="primary-warning" text="Primary Warning" />
        <BudgetAlert color="secondary-warning" text="Secondary Warning" />
        <BudgetAlert color="primary-error" text="Primary Error" />
        <BudgetAlert color="secondary-error" text="Secondary Error" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-2">
        <BudgetAlert size="sm" text="Alerte taille sm" />
        <BudgetAlert size="md" text="Alerte taille md" />
        <BudgetAlert size="lg" text="Alerte taille lg" />
      </div>

      <hr class="border-gray-200">

      <BudgetAlert dismissible text="Alerte fermable (dismissible)." />

      <hr class="border-gray-200">

      <BudgetAlert color="primary-warning" dismissible>
        <template #prefix>
          <BudgetIcon status="status-warning" decorative />
        </template>
        Alerte avec slot prefix.
      </BudgetAlert>

      <BudgetAlert color="secondary-success">
        <template #prefix>
          <BudgetIcon status="status-success" decorative />
        </template>
        Alerte avec prefix et suffix.
        <template #suffix>
          <BudgetIcon status="status-info" decorative />
        </template>
      </BudgetAlert>

      <hr class="border-gray-200">

      <div class="grid gap-3">
        <BudgetButton size="sm" color="secondary" @click="showAutoDismissAlert">
          Afficher l'alerte auto-dismiss
        </BudgetButton>
        <BudgetAlert
          v-if="showAutoDismissDemo"
          :key="autoDismissKey"
          color="primary-success"
          :auto-dismiss="true"
          :dismiss-after="3000"
          text="Cette alerte disparait avec un fade apres 3 secondes."
        />
      </div>
    </div>
  </BudgetCard>
</template>
