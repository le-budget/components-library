<script setup lang="ts">
import { ref } from "vue";
import BudgetAvatar from "../../components/BudgetAvatar/BudgetAvatar.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";

const avatarCollapsed = ref(true);

const sampleImage = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#dbeafe"/>
        <stop offset="100%" stop-color="#93c5fd"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#g)" />
    <circle cx="300" cy="240" r="110" fill="#1e3a8a" opacity="0.85" />
    <rect x="120" y="360" width="360" height="180" rx="90" fill="#1d4ed8" opacity="0.9" />
  </svg>`
)}`;
</script>

<template>
  <BudgetCard title="Avatar" collapsible v-model:collapsed="avatarCollapsed">
    <div class="grid gap-4">
      <BudgetAvatar :image="sampleImage" alt="Avatar utilisateur" />

      <hr class="border-gray-200">

      <div class="flex flex-wrap items-center gap-4">
        <BudgetAvatar :image="sampleImage" shape="circle" alt="Avatar cercle" />
        <BudgetAvatar :image="sampleImage" shape="rounded" alt="Avatar arrondi" />
        <BudgetAvatar :image="sampleImage" shape="square" alt="Avatar carre" />
      </div>

      <hr class="border-gray-200">

      <div class="flex flex-wrap items-end gap-4">
        <BudgetAvatar :image="sampleImage" size="sm" alt="Avatar sm" />
        <BudgetAvatar :image="sampleImage" size="md" alt="Avatar md" />
        <BudgetAvatar :image="sampleImage" size="lg" alt="Avatar lg" />
        <BudgetAvatar :image="sampleImage" size="xl" alt="Avatar xl" />
      </div>

      <div class="grid gap-4">
        <BudgetAvatar :image="sampleImage" size="xxl" alt="Avatar xxl" />
      </div>

      <hr class="border-gray-200">

      <div class="flex flex-wrap items-center gap-4">
        <BudgetAvatar :image="sampleImage" thickness="sm" alt="Avatar border sm" />
        <BudgetAvatar :image="sampleImage" thickness="md" alt="Avatar border md" />
        <BudgetAvatar :image="sampleImage" thickness="lg" alt="Avatar border lg" />
      </div>

      <hr class="border-gray-200">

      <div class="flex flex-wrap items-center gap-4">
        <BudgetAvatar :image="sampleImage" color="primary" alt="Avatar primary" />
        <BudgetAvatar :image="sampleImage" color="secondary" alt="Avatar secondary" />
        <BudgetAvatar :image="sampleImage" color="ghost" alt="Avatar ghost" />
        <BudgetAvatar
          :image="sampleImage"
          color="primary-success"
          alt="Avatar primary success"
        />
        <BudgetAvatar
          :image="sampleImage"
          color="secondary-success"
          alt="Avatar secondary success"
        />
        <BudgetAvatar
          :image="sampleImage"
          color="primary-warning"
          alt="Avatar primary warning"
        />
        <BudgetAvatar
          :image="sampleImage"
          color="secondary-warning"
          alt="Avatar secondary warning"
        />
        <BudgetAvatar :image="sampleImage" color="primary-error" alt="Avatar primary error" />
        <BudgetAvatar
          :image="sampleImage"
          color="secondary-error"
          alt="Avatar secondary error"
        />
      </div>
    </div>
  </BudgetCard>
</template>
