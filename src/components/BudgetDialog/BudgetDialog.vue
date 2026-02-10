<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { clearIcon } from "../../icons";
import { nextId } from "../../utils/id";

type DialogColor = "neutral" | "primary" | "success" | "warning" | "error";

const props = withDefaults(
  defineProps<{
    open?: boolean | null;
    defaultOpen?: boolean;
    title?: string;
    closeLabel?: string;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    showOverlay?: boolean;
    showClose?: boolean;
    color?: DialogColor;
    maxWidthClass?: string;
  }>(),
  {
    open: null,
    defaultOpen: false,
    title: "",
    closeLabel: "Fermer la fenetre",
    closeOnOverlay: true,
    closeOnEscape: true,
    showOverlay: true,
    showClose: true,
    color: "neutral",
    maxWidthClass: "max-w-lg"
  }
);

const emit = defineEmits<{
  (event: "update:open", value: boolean): void;
  (event: "close"): void;
}>();

const dialogRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const titleId = nextId("budget-dialog-title");
const lastActiveElement = ref<HTMLElement | null>(null);
const internalOpen = ref(props.defaultOpen);

const isControlled = computed(() => props.open !== null);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.open) : internalOpen.value
);

const colorClass = computed(() => {
  switch (props.color) {
    case "primary":
      return "border-t-c-blue-dark dark:border-t-c-black";
    case "success":
      return "border-t-c-green-dark dark:border-t-c-black-success";
    case "warning":
      return "border-t-c-orange-dark dark:border-t-c-black-warning";
    case "error":
      return "border-t-c-red-dark dark:border-t-c-black-error";
    case "neutral":
    default:
      return "border-t-slate-500 dark:border-t-slate-500";
  }
});

function getFocusableElements() {
  if (!dialogRef.value) {
    return [];
  }

  const selector = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(selector));
}

function closeDialog() {
  if (!isOpen.value) {
    return;
  }

  if (!isControlled.value) {
    internalOpen.value = false;
  }

  emit("update:open", false);
  emit("close");
}

function onOverlayClick() {
  if (!props.closeOnOverlay) {
    return;
  }

  closeDialog();
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    return;
  }

  if (event.key === "Escape" && props.closeOnEscape) {
    event.preventDefault();
    closeDialog();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements();

  if (focusableElements.length === 0) {
    event.preventDefault();
    dialogRef.value?.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (!active || !dialogRef.value?.contains(active)) {
    event.preventDefault();
    first.focus();
    return;
  }

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.defaultOpen,
  (nextOpen) => {
    if (!isControlled.value) {
      internalOpen.value = nextOpen;
    }
  }
);

watch(
  isOpen,
  async (open) => {
    if (open) {
      lastActiveElement.value = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", onDocumentKeydown);

      await nextTick();
      if (props.showClose) {
        closeButtonRef.value?.focus();
      } else {
        dialogRef.value?.focus();
      }
      return;
    }

    document.removeEventListener("keydown", onDocumentKeydown);
    lastActiveElement.value?.focus();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>

<template>
  <Teleport to="body">
    <!-- c8 ignore start -->
    <Transition name="budget-dialog-fade-scale">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          v-if="showOverlay"
          class="absolute inset-0 bg-black/50"
          @click="onOverlayClick"
        />

        <section
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          tabindex="-1"
          :class="[
            'relative z-10 w-full overflow-hidden rounded-lg border border-slate-200 border-t-4 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900',
            maxWidthClass,
            colorClass
          ]"
        >
          <header class="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div class="min-w-0 flex items-center gap-2">
              <slot name="icon" />
              <h2
                v-if="title"
                :id="titleId"
                class="truncate text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ title }}
              </h2>
            </div>

            <button
              v-if="showClose"
              ref="closeButtonRef"
              type="button"
              :aria-label="closeLabel"
              class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue-dark focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus-visible:ring-c-black dark:focus-visible:ring-offset-slate-900"
              @click="closeDialog"
            >
              <FontAwesomeIcon :icon="clearIcon" />
            </button>
          </header>

          <div class="max-h-[75vh] overflow-y-auto px-4 py-3">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="border-t border-slate-200 px-4 py-3 dark:border-slate-700"
          >
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
    <!-- c8 ignore stop -->
  </Teleport>
</template>

<style scoped>
.budget-dialog-fade-scale-enter-active,
.budget-dialog-fade-scale-leave-active {
  transition: opacity 0.2s ease;
}

.budget-dialog-fade-scale-enter-active section,
.budget-dialog-fade-scale-leave-active section {
  transition: transform 0.2s ease;
}

.budget-dialog-fade-scale-enter-from,
.budget-dialog-fade-scale-leave-to {
  opacity: 0;
}

.budget-dialog-fade-scale-enter-from section,
.budget-dialog-fade-scale-leave-to section {
  transform: scale(0.98);
}
</style>
