<script setup lang="ts">
import { ref } from "vue";
import BudgetBadge from "../../components/BudgetBadge/BudgetBadge.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";

const badgeCollapsed = ref(true);
</script>
<template>
    <BudgetCard title="Badge" collapsible v-model:collapsed="badgeCollapsed">
        <div class="grid gap-4">
            <BudgetBadge text="Badge" />
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetBadge text="Primary" color="primary" />
                <BudgetBadge text="Secondary" color="secondary" />
                <BudgetBadge text="Ghost" color="ghost" />
                <BudgetBadge text="Success" color="success" />
                <BudgetBadge text="Warning" color="warning" />
                <BudgetBadge text="Error" color="error" />
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap items-center gap-2">
                <BudgetBadge text="XS" size="xs" />
                <BudgetBadge text="MD" size="md" />
                <BudgetBadge text="LG" size="lg" />
            </div>
            <hr class="border-gray-200">
            <div class="flex flex-wrap gap-2">
                <BudgetBadge text="Left icon">
                    <template #icon>
                        <BudgetIcon status="status-info" size="sm" />
                    </template>
                </BudgetBadge>
                <BudgetBadge text="Right icon">
                    <template #iconRight>
                        <BudgetIcon status="status-success" size="sm" />
                    </template>
                </BudgetBadge>
                <BudgetBadge text="Both icons">
                    <template #icon>
                        <BudgetIcon status="status-info" size="sm" />
                    </template>
                    <template #iconRight>
                        <BudgetIcon status="status-success" size="sm" />
                    </template>
                </BudgetBadge>
            </div>
        </div>
    </BudgetCard>
</template>
