<script setup lang="ts">
import { ref } from "vue";
import BudgetBreadcrumb from "../../components/BudgetBreadcrumb/BudgetBreadcrumb.vue";
import BudgetBreadcrumbItem from "../../components/BudgetBreadcrumbItem/BudgetBreadcrumbItem.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const breadcrumbCollapsed = ref(true);
</script>

<template>
  <BudgetCard title="Breadcrumb" collapsible v-model:collapsed="breadcrumbCollapsed">
    <div class="grid gap-4">
      <BudgetBreadcrumb>
        <BudgetBreadcrumbItem label="Accueil" href="#" />
        <BudgetBreadcrumbItem label="Comptes" href="#" />
        <BudgetBreadcrumbItem label="Compte courant" />
      </BudgetBreadcrumb>

      <hr class="border-gray-200">

      <BudgetBreadcrumb>
        <BudgetBreadcrumbItem label="Accueil" href="#">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
        </BudgetBreadcrumbItem>
        <BudgetBreadcrumbItem label="Categories" href="#">
          <template #icon>
            <BudgetIcon status="status-question" decorative />
          </template>
        </BudgetBreadcrumbItem>
        <BudgetBreadcrumbItem label="Details" />
      </BudgetBreadcrumb>

      <hr class="border-gray-200">

      <BudgetBreadcrumb :max-items="3">
        <BudgetBreadcrumbItem label="Accueil" href="#" />
        <BudgetBreadcrumbItem label="Administration" href="#" />
        <BudgetBreadcrumbItem label="Clients" href="#" />
        <BudgetBreadcrumbItem label="Profil" />
      </BudgetBreadcrumb>
    </div>
  </BudgetCard>
</template>
