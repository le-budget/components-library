<script setup lang="ts">
import { ref } from "vue";
import BudgetCheckbox from "../../components/BudgetCheckbox/BudgetCheckbox.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";

const checkboxCollapsed = ref(true);
const checked = ref(true);
const unchecked = ref(false);
</script>
<template>
    <BudgetCard title="Checkbox" collapsible v-model:collapsed="checkboxCollapsed">
        <div class="grid gap-4">
            <BudgetCheckbox v-model="checked" label="Activer" />
            <hr class="border-gray-200">
            <div class="flex flex-col gap-2">
                <BudgetCheckbox v-model="checked" label="Primary" color="primary" />
                <BudgetCheckbox v-model="checked" label="Neutral" color="neutral" />
                <BudgetCheckbox v-model="checked" label="Success" color="success" />
                <BudgetCheckbox v-model="checked" label="Warning" color="warning" />
                <BudgetCheckbox v-model="checked" label="Error" color="error" />
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-col gap-2">
                <BudgetCheckbox v-model="checked" label="Small" size="sm" />
                <BudgetCheckbox v-model="checked" label="Medium" size="md" />
                <BudgetCheckbox v-model="checked" label="Large" size="lg" />
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-col gap-2">
                <BudgetCheckbox v-model="unchecked" label="Unchecked" />
                <BudgetCheckbox v-model="checked" label="Checked" />
                <BudgetCheckbox v-model="checked" label="Disabled" disabled />
                <BudgetCheckbox v-model="unchecked" label="Disabled unchecked" disabled />
            </div>
        </div>
    </BudgetCard>
</template>
