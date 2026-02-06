<script setup lang="ts">
import { ref } from "vue";
import BudgetInputText from "../../components/BudgetInputText/BudgetInputText.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
const name = ref("");
</script>
<template>
    <BudgetCard title="Input Text" collapsible>
        <div class="grid gap-4">
            <BudgetInputText v-model="name" label="Nom" placeholder="Votre nom"></BudgetInputText>
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" placeholder="Votre nom"></BudgetInputText>
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" label="On error" placeholder="Votre nom" error error-message="Vous devez saisir votre nom"></BudgetInputText>
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" label="On success" placeholder="Votre nom" success></BudgetInputText>
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" label="Disabled" placeholder="Votre nom" disabled></BudgetInputText>
        </div>
    </BudgetCard>
</template>
