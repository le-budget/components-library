<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const iconCollapsed = ref(true);
</script>

<template>
    <BudgetCard title="Icon" collapsible v-model:collapsed="iconCollapsed">
        <div class="grid gap-4">
            <BudgetIcon status="status-info" />
            <hr class="border-gray-200">
            <div class="flex items-center gap-4">
                <BudgetIcon status="status-success" />
                <BudgetIcon status="status-warning" />
                <BudgetIcon status="status-error" />
                <BudgetIcon status="status-info" />
            </div>
            <hr class="border-gray-200">
            <div class="flex items-center gap-4">
                <BudgetIcon status="status-info" color="primary" />
                <BudgetIcon status="status-success" color="success" />
                <BudgetIcon status="status-warning" color="warning" />
                <BudgetIcon status="status-error" color="error" />
                <BudgetIcon status="status-info" color="neutral" />
                <BudgetIcon status="status-info" color="white" />
            </div>
            <hr class="border-gray-200">
            <div class="flex items-center gap-4">
                <BudgetIcon status="status-info" size="sm" />
                <BudgetIcon status="status-info" size="md" />
                <BudgetIcon status="status-info" size="lg" />
                <BudgetIcon status="status-info" size="xl" />
                <BudgetIcon status="status-info" size="xxl" />
            </div>
            <hr class="border-gray-200">
            <div class="flex items-center gap-3">
                <span class="text-sm text-slate-600">Decorative</span>
                <BudgetIcon status="status-info" decorative />
                <span class="text-sm text-slate-600">Custom label</span>
                <BudgetIcon status="status-success" label="Success status" />
            </div>
        </div>
    </BudgetCard>
</template>
