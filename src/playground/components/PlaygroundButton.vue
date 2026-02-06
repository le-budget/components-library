<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetIcon from "../../components/BudgetIcon/BudgetIcon.vue";
const name = ref("");

const buttonCollapsed = ref(true);
</script>
<template>
    <BudgetCard title="Button" collapsible v-model:collapsed="buttonCollapsed">
        <div class="grid gap-4">
            <BudgetButton>Button</BudgetButton>
            <hr class="border-gray-200">
        </div>
    </BudgetCard>
</template>