<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BudgetIcon from "../BudgetIcon/BudgetIcon.vue";
import { clearIcon, type StatusIconName } from "../../icons";
import type { BudgetToastColor, BudgetToastVariant } from "./budgetToast.store";

type ToastColor = "primary" | "success" | "warning" | "error";

const props = withDefaults(
  defineProps<{
    id: string;
    title: string;
    description?: string;
    variant?: BudgetToastVariant;
    color?: BudgetToastColor;
    duration?: number;
    icon?: StatusIconName | false;
    closeLabel?: string;
    pauseOnHover?: boolean;
  }>(),
  {
    description: "",
    variant: "info",
    duration: 4000,
    icon: "status-info",
    closeLabel: "Fermer la notification",
    pauseOnHover: true
  }
);

const emit = defineEmits<{
  (event: "close", id: string): void;
}>();

const remainingMs = ref(0);
const startedAt = ref<number | null>(null);
let dismissTimeout: ReturnType<typeof setTimeout> | undefined;

const variantColorMap: Record<BudgetToastVariant, BudgetToastColor> = {
  info: "secondary",
  warning: "secondary-warning",
  question: "primary",
  error: "secondary-error",
  success: "secondary-success"
};

const resolvedColor = computed(() => props.color ?? variantColorMap[props.variant]);

const toneClass = computed(() => {
  switch (resolvedColor.value) {
    case "secondary":
      return "border-c-blue bg-white text-c-blue-dark dark:border-c-black dark:bg-slate-900 dark:text-slate-100";
    case "ghost":
      return "border-c-blue/40 bg-transparent text-c-blue-dark dark:border-c-black/40 dark:text-slate-100";
    case "primary-success":
      return "border-c-green-dark bg-c-green/15 text-c-green-dark dark:border-c-black-success dark:bg-c-black-success/25 dark:text-c-black-success";
    case "secondary-success":
      return "border-c-green bg-white text-c-green-dark dark:border-c-black-success dark:bg-slate-900 dark:text-c-black-success";
    case "primary-warning":
      return "border-c-orange-dark bg-c-orange/20 text-c-orange-dark dark:border-c-black-warning dark:bg-c-black-warning/25 dark:text-c-black-warning";
    case "secondary-warning":
      return "border-c-orange bg-white text-c-orange-dark dark:border-c-black-warning dark:bg-slate-900 dark:text-c-black-warning";
    case "primary-error":
      return "border-c-red-dark bg-c-red/15 text-c-red-dark dark:border-c-black-error dark:bg-c-black-error/25 dark:text-c-black-error";
    case "secondary-error":
      return "border-c-red bg-white text-c-red-dark dark:border-c-black-error dark:bg-slate-900 dark:text-c-black-error";
    case "primary":
    default:
      return "border-c-blue-dark bg-c-blue-light/30 text-c-blue-dark dark:border-c-black dark:bg-c-black-light/35 dark:text-slate-100";
  }
});

const iconColor = computed<ToastColor>(() => {
  if (props.variant === "success") return "success";
  if (props.variant === "warning") return "warning";
  if (props.variant === "error") return "error";
  return "primary";
});

const live = computed(() => (props.variant === "error" ? "assertive" : "polite"));

function clearDismissTimer() {
  if (dismissTimeout !== undefined) {
    clearTimeout(dismissTimeout);
    dismissTimeout = undefined;
  }
  startedAt.value = null;
}

function closeToast() {
  clearDismissTimer();
  emit("close", props.id);
}

function startDismissTimer(duration: number) {
  if (duration <= 0) {
    clearDismissTimer();
    return;
  }

  clearDismissTimer();
  remainingMs.value = duration;
  startedAt.value = Date.now();
  dismissTimeout = setTimeout(() => {
    closeToast();
  }, duration);
}

function resetDismissTimer() {
  startDismissTimer(Math.max(0, props.duration));
}

function pauseDismissTimer() {
  if (!props.pauseOnHover || dismissTimeout === undefined || startedAt.value === null) {
    return;
  }

  const elapsed = Date.now() - startedAt.value;
  remainingMs.value = Math.max(0, remainingMs.value - elapsed);
  clearDismissTimer();
}

function resumeDismissTimer() {
  if (!props.pauseOnHover) {
    return;
  }

  startDismissTimer(remainingMs.value);
}

watch(() => props.duration, resetDismissTimer);

onMounted(() => {
  resetDismissTimer();
});

onBeforeUnmount(() => {
  clearDismissTimer();
});
</script>

<template>
  <article
    class="pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-md"
    :class="toneClass"
    role="status"
    :aria-live="live"
    @mouseenter="pauseDismissTimer"
    @mouseleave="resumeDismissTimer"
  >
    <BudgetIcon
      v-if="icon"
      class="mt-0.5 shrink-0"
      :status="icon"
      :color="iconColor"
      decorative
      size="lg"
    />

    <div class="min-w-0 flex-1">
      <p class="font-semibold leading-5">{{ title }}</p>
      <p v-if="description" class="mt-1 text-sm leading-5 opacity-90">{{ description }}</p>
    </div>

    <button
      type="button"
      class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-current transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:hover:bg-white/10 dark:focus-visible:ring-offset-slate-900"
      :aria-label="closeLabel"
      @click="closeToast"
    >
      <FontAwesomeIcon :icon="clearIcon" />
    </button>
  </article>
</template>
