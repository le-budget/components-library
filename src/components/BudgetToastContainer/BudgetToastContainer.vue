<script setup lang="ts">
import BudgetToast from "../BudgetToast/BudgetToast.vue";
import { useBudgetToast } from "../BudgetToast/budgetToast.store";

const { toasts, remove } = useBudgetToast();
</script>

<template>
  <!-- c8 ignore start -->
  <Teleport to="body">
    <section
      v-if="toasts.length"
      data-testid="budget-toast-container"
      class="pointer-events-none fixed right-4 top-4 z-[1000] flex w-[min(90vw,24rem)] flex-col gap-3"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="budget-toast-list" tag="div" class="flex flex-col gap-3">
        <BudgetToast
          v-for="toast in toasts"
          :id="toast.id"
          :key="toast.id"
          :title="toast.title"
          :description="toast.description"
          :variant="toast.variant"
          :color="toast.color"
          :duration="toast.duration"
          :icon="toast.icon"
          :close-label="toast.closeLabel"
          :pause-on-hover="toast.pauseOnHover"
          @close="remove"
        />
      </TransitionGroup>
    </section>
  </Teleport>
  <!-- c8 ignore stop -->
</template>

<style scoped>
.budget-toast-list-enter-active,
.budget-toast-list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.budget-toast-list-enter-from,
.budget-toast-list-leave-to {
  opacity: 0;
  transform: translateX(6px) translateY(-2px);
}
</style>
