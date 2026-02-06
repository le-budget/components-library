<script setup lang="ts">
import { ref } from "vue";
import BudgetInputText from "../../components/BudgetInputText/BudgetInputText.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetStatusIcon from "../../components/BudgetStatusIcon/BudgetStatusIcon.vue";
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
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" label="Prefix icon" placeholder="Votre nom">
                <template #prefix>
                    <BudgetStatusIcon status="status-info" size="sm" />
                </template>
            </BudgetInputText>
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" label="Suffix icon" placeholder="Votre nom">
                <template #suffix>
                    <BudgetStatusIcon status="status-success" size="sm" color="primary" />
                </template>
            </BudgetInputText>
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" label="Prefix text" placeholder="Votre nom">
                <template #prefix>
                    <span class="text-xs font-semibold text-slate-500">@</span>
                </template>
            </BudgetInputText>
            <hr class="border-gray-200">
            <BudgetInputText v-model="name" label="Suffix text" placeholder="Votre nom">
                <template #suffix>
                    <span class="text-xs font-semibold text-slate-500">EUR</span>
                </template>
            </BudgetInputText>
        </div>
    </BudgetCard>
</template>
