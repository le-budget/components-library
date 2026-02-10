<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BudgetIcon from "../BudgetIcon/BudgetIcon.vue";
import { clearIcon, type StatusIconName } from "../../icons";
import { nextId } from "../../utils/id";

type DrawerPlacement = "left" | "right";
type DrawerBorderColor = "neutral" | "primary" | "success" | "warning" | "error";
type DrawerBorderThickness = "none" | "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean | null;
    defaultOpen?: boolean;
    placement?: DrawerPlacement;
    title?: string;
    icon?: StatusIconName | false;
    closeLabel?: string;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    showOverlay?: boolean;
    widthClass?: string;
    borderColor?: DrawerBorderColor;
    borderThickness?: DrawerBorderThickness;
  }>(),
  {
    modelValue: null,
    defaultOpen: false,
    placement: "right",
    title: "",
    icon: false,
    closeLabel: "Fermer le panneau",
    closeOnOverlay: true,
    closeOnEscape: true,
    showOverlay: true,
    widthClass: "w-full max-w-md",
    borderColor: "neutral",
    borderThickness: "sm"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "close"): void;
}>();

const drawerRef = ref<HTMLElement | null>(null);
const fallbackFocusRef = ref<HTMLElement | null>(null);
const titleId = nextId("budget-drawer-title");
const lastActiveElement = ref<HTMLElement | null>(null);
const internalOpen = ref(props.defaultOpen);

const isControlled = computed(() => props.modelValue !== null);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.modelValue) : internalOpen.value
);

const panelPositionClass = computed(() =>
  props.placement === "left" ? "left-0" : "right-0"
);

const borderSideClass = computed(() => {
  if (props.borderThickness === "none") {
    return "";
  }

  if (props.placement === "left") {
    if (props.borderThickness === "md") return "border-r-2";
    if (props.borderThickness === "lg") return "border-r-4";
    return "border-r";
  }

  if (props.borderThickness === "md") return "border-l-2";
  if (props.borderThickness === "lg") return "border-l-4";
  return "border-l";
});

const borderColorClass = computed(() => {
  switch (props.borderColor) {
    case "primary":
      return "border-c-blue-dark dark:border-c-black";
    case "success":
      return "border-c-green-dark dark:border-c-black-success";
    case "warning":
      return "border-c-orange-dark dark:border-c-black-warning";
    case "error":
      return "border-c-red-dark dark:border-c-black-error";
    case "neutral":
    default:
      return "border-slate-500 dark:border-slate-500";
  }
});

const drawerBorderClass = computed(() => {
  if (props.borderThickness === "none") {
    return "";
  }
  return `${borderSideClass.value} ${borderColorClass.value}`;
});

function getFocusableElements() {
  if (!drawerRef.value) {
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

  return Array.from(drawerRef.value.querySelectorAll<HTMLElement>(selector));
}

function closeDrawer() {
  if (!isOpen.value) {
    return;
  }

  if (!isControlled.value) {
    internalOpen.value = false;
  }
  emit("update:modelValue", false);
  emit("close");
}

function onOverlayClick() {
  if (!props.closeOnOverlay) {
    return;
  }
  closeDrawer();
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    return;
  }

  if (event.key === "Escape" && props.closeOnEscape) {
    event.preventDefault();
    closeDrawer();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements();
  if (focusableElements.length === 0) {
    event.preventDefault();
    drawerRef.value?.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (!active || !drawerRef.value?.contains(active)) {
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
  (newValue) => {
    if (!isControlled.value) {
      internalOpen.value = newValue;
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
      fallbackFocusRef.value?.focus();
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
    <Transition name="budget-drawer-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50">
        <div
          v-if="showOverlay"
          class="absolute inset-0 bg-slate-900/40"
          @click="onOverlayClick"
        />

        <aside
          ref="drawerRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          tabindex="-1"
          :class="[
            'absolute top-0 flex h-full flex-col bg-white shadow-xl dark:bg-slate-900',
            panelPositionClass,
            widthClass,
            drawerBorderClass
          ]"
        >
          <header class="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <BudgetIcon
                  v-if="icon"
                  :status="icon"
                  size="md"
                  decorative
                  class="shrink-0"
                />
                <h2
                  v-if="title"
                  :id="titleId"
                  class="truncate text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  {{ title }}
                </h2>
              </div>
            </div>

            <button
              ref="fallbackFocusRef"
              type="button"
              class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue-dark focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus-visible:ring-c-black dark:focus-visible:ring-offset-slate-900"
              :aria-label="closeLabel"
              @click="closeDrawer"
            >
              <FontAwesomeIcon :icon="clearIcon" />
            </button>
          </header>

          <section class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <slot />
          </section>

          <footer
            v-if="$slots.footer"
            class="border-t border-slate-200 px-4 py-3 dark:border-slate-700"
          >
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
    <!-- c8 ignore stop -->
  </Teleport>
</template>

<style scoped>
.budget-drawer-fade-enter-active,
.budget-drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.budget-drawer-fade-enter-from,
.budget-drawer-fade-leave-to {
  opacity: 0;
}
</style>
