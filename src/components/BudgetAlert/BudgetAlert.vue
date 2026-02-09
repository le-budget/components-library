<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { clearIcon } from "../../icons";

type AlertSize = "sm" | "md" | "lg";
type AlertColor =
  | "primary"
  | "secondary"
  | "ghost"
  | "primary-success"
  | "secondary-success"
  | "primary-warning"
  | "secondary-warning"
  | "primary-error"
  | "secondary-error";

const props = withDefaults(
  defineProps<{
    text?: string;
    size?: AlertSize;
    color?: AlertColor;
    dismissible?: boolean;
    closeLabel?: string;
    autoDismiss?: boolean;
    dismissAfter?: number;
    pauseOnHover?: boolean;
  }>(),
  {
    text: "",
    size: "md",
    color: "primary",
    dismissible: false,
    closeLabel: "Fermer l'alerte",
    autoDismiss: false,
    dismissAfter: 5000,
    pauseOnHover: true
  }
);

const emit = defineEmits<{
  (event: "dismiss"): void;
}>();

const isVisible = ref(true);
const remainingMs = ref(0);
const startedAt = ref<number | null>(null);
let dismissTimeout: ReturnType<typeof setTimeout> | undefined;

const sizeClass = computed(() => {
  if (props.size === "sm") return "px-3 py-2 text-sm gap-2";
  if (props.size === "lg") return "px-5 py-4 text-base gap-3";
  return "px-4 py-3 text-sm gap-2.5";
});

const closeButtonClass = computed(() => {
  if (props.size === "sm") return "top-1.5 right-1.5 text-sm";
  if (props.size === "lg") return "top-3 right-3 text-lg";
  return "top-2.5 right-2.5 text-base";
});

const contentPaddingClass = computed(() => (props.dismissible ? "pr-7" : ""));

const toneClass = computed(() => {
  switch (props.color) {
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

function dismissAlert() {
  if (!isVisible.value) {
    return;
  }
  clearDismissTimer();
  isVisible.value = false;
  emit("dismiss");
}

function clearDismissTimer() {
  if (dismissTimeout !== undefined) {
    clearTimeout(dismissTimeout);
    dismissTimeout = undefined;
  }
  startedAt.value = null;
}

function startDismissTimer(duration: number) {
  if (duration <= 0) {
    dismissAlert();
    return;
  }

  clearDismissTimer();
  remainingMs.value = duration;
  startedAt.value = Date.now();
  dismissTimeout = setTimeout(() => {
    dismissAlert();
  }, duration);
}

function resetDismissTimer() {
  if (!props.autoDismiss || !isVisible.value) {
    clearDismissTimer();
    return;
  }
  startDismissTimer(Math.max(0, props.dismissAfter));
}

function pauseDismissTimer() {
  if (!props.autoDismiss || !props.pauseOnHover || dismissTimeout === undefined) {
    return;
  }

  const elapsed = Date.now() - (startedAt.value as number);
  remainingMs.value = Math.max(0, remainingMs.value - elapsed);
  clearDismissTimer();
}

function resumeDismissTimer() {
  if (!props.autoDismiss || !props.pauseOnHover || !isVisible.value) {
    return;
  }
  startDismissTimer(remainingMs.value);
}

watch(() => props.autoDismiss, resetDismissTimer);
watch(() => props.dismissAfter, resetDismissTimer);

onMounted(() => {
  resetDismissTimer();
});

onBeforeUnmount(() => {
  clearDismissTimer();
});
</script>

<template>
  <!-- c8 ignore start -->
  <Transition name="budget-alert-fade">
    <div
      v-if="isVisible"
      role="status"
      :class="[
        'relative w-full rounded-xl border font-medium',
        sizeClass,
        toneClass
      ]"
      @mouseenter="pauseDismissTimer"
      @mouseleave="resumeDismissTimer"
    >
      <div class="flex items-center" :class="contentPaddingClass">
        <span v-if="$slots.prefix" class="mr-2 inline-flex shrink-0 items-center">
          <slot name="prefix" />
        </span>
        <p class="min-w-0 flex-1">
          <slot>{{ text }}</slot>
        </p>
        <span v-if="$slots.suffix" class="ml-2 inline-flex shrink-0 items-center">
          <slot name="suffix" />
        </span>
      </div>
      <button
        v-if="dismissible"
        type="button"
        :class="[
          'absolute inline-flex h-6 w-6 items-center justify-center rounded-md text-current transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:hover:bg-white/10 dark:focus-visible:ring-offset-slate-900',
          closeButtonClass
        ]"
        :aria-label="closeLabel"
        @click="dismissAlert"
      >
        <FontAwesomeIcon :icon="clearIcon" />
      </button>
    </div>
  </Transition>
  <!-- c8 ignore stop -->
</template>

<style scoped>
.budget-alert-fade-enter-active,
.budget-alert-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.budget-alert-fade-enter-from,
.budget-alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>
