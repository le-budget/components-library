<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const buttonCollapsed = ref(true);
</script>
<template>
    <BudgetCard title="Button" collapsible v-model:collapsed="buttonCollapsed">
        <div class="grid gap-4">
            <BudgetButton>Button</BudgetButton>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetButton color="primary">Primary</BudgetButton>
                <BudgetButton color="secondary">Secondary</BudgetButton>
                <BudgetButton color="ghost">Ghost</BudgetButton>
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetButton color="primary-success">Success</BudgetButton>
                <BudgetButton color="secondary-success">Success Secondary</BudgetButton>
                <BudgetButton color="primary-warning">Warning</BudgetButton>
                <BudgetButton color="secondary-warning">Warning Secondary</BudgetButton>
                <BudgetButton color="primary-error">Error</BudgetButton>
                <BudgetButton color="secondary-error">Error Secondary</BudgetButton>
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetButton size="sm">Small</BudgetButton>
                <BudgetButton size="md">Medium</BudgetButton>
                <BudgetButton size="lg">Large</BudgetButton>
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetButton loading>Loading</BudgetButton>
                <BudgetButton disabled>Disabled</BudgetButton>
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetButton>
                    <template #icon>
                        <BudgetIcon status="status-info" />
                    </template>
                    Icon Left
                </BudgetButton>
                <BudgetButton>
                    Icon Right
                    <template #iconRight>
                        <BudgetIcon status="status-success" />
                    </template>
                </BudgetButton>
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetButton loading>
                    <template #icon>
                        <BudgetIcon status="status-info" />
                    </template>
                    Loading with icon
                </BudgetButton>
                <BudgetButton loading :hide-icons-on-loading="false">
                    <template #icon>
                        <BudgetIcon status="status-info" />
                    </template>
                    Loading show icon
                </BudgetButton>
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetButton aria-label="Ajouter">
                    <template #icon>
                        <BudgetIcon status="status-info" />
                    </template>
                </BudgetButton>
            </div>
        </div>
    </BudgetCard>
</template>
