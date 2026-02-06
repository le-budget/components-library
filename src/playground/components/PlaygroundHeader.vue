<script setup lang="ts">
import { ref } from "vue";
import BudgetButton from "../../components/BudgetButton/BudgetButton.vue"
import BudgetStatusIcon from "../../components/BudgetStatusIcon/BudgetStatusIcon.vue";

const darkMode = ref(false);

function toggleTheme() {
    darkMode.value = !darkMode.value;
    document.documentElement.classList.toggle("dark", darkMode.value);
}

</script>
<template>
    <header class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-semibold">Playground Components</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                Espace local pour tester les composants sans Storybook.
            </p>
        </div>
        <BudgetButton size="sm" @click="toggleTheme">
            <template #icon>
                <BudgetStatusIcon :status="darkMode ? 'status-info' : 'status-success'" />
            </template>
            {{ darkMode ? "Mode clair" : "Mode sombre" }}
        </BudgetButton>
    </header>
</template>