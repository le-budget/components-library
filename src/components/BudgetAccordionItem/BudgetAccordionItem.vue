<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots
} from "vue";
import { chevronDownIcon, chevronUpIcon } from "../../icons";
import { nextId } from "../../utils/id";
import { budgetAccordionContextKey } from "../BudgetAccordion/accordionContext";

defineOptions({
  name: "BudgetAccordionItem"
});

type AccordionItemColor =
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
    title: string;
    color?: AccordionItemColor;
    defaultOpen?: boolean;
    chevronLabel?: string;
    disabled?: boolean;
  }>(),
  {
    color: "primary",
    defaultOpen: false,
    chevronLabel: "Ouvrir ou fermer la section",
    disabled: false
  }
);

const accordion = inject(budgetAccordionContextKey, null);
const slots = useSlots();
const buttonRef = ref<HTMLButtonElement | null>(null);
const localOpen = ref(props.defaultOpen);
const itemId = nextId("budget-accordion-item");
const contentId = `${itemId}-content`;

const hasIconSlot = computed(() => Boolean(slots.icon));
const isOpen = computed(() => accordion?.isItemOpen(itemId) ?? localOpen.value);
const resolvedSpaced = computed(() => accordion?.spaced.value ?? true);
const chevronIcon = computed(() => (isOpen.value ? chevronUpIcon : chevronDownIcon));

const borderToneClass = computed(() => {
  switch (props.color) {
    case "secondary":
      return "border-c-blue dark:border-c-black";
    case "ghost":
      return "border-c-blue/40 dark:border-c-black/40";
    case "primary-success":
    case "secondary-success":
      return "border-c-green dark:border-c-black-success";
    case "primary-warning":
    case "secondary-warning":
      return "border-c-orange dark:border-c-black-warning";
    case "primary-error":
    case "secondary-error":
      return "border-c-red dark:border-c-black-error";
    case "primary":
    default:
      return "border-c-blue-dark dark:border-c-black";
  }
});

const wrapperClass = computed(() => {
  if (!resolvedSpaced.value && accordion) {
    return `rounded-none border-x border-b first:rounded-t-xl last:rounded-b-xl first:border-t ${borderToneClass.value}`;
  }
  return `border rounded-xl ${borderToneClass.value}`;
});

const headerToneClass = computed(() => {
  switch (props.color) {
    case "secondary":
      return "bg-white text-c-blue-dark dark:bg-slate-900 dark:text-slate-100";
    case "ghost":
      return "bg-transparent text-c-blue-dark dark:text-slate-100";
    case "primary-success":
      return "bg-c-green/15 text-c-green-dark dark:bg-c-black-success/25 dark:text-c-black-success";
    case "secondary-success":
      return "bg-white text-c-green-dark dark:bg-slate-900 dark:text-c-black-success";
    case "primary-warning":
      return "bg-c-orange/20 text-c-orange-dark dark:bg-c-black-warning/25 dark:text-c-black-warning";
    case "secondary-warning":
      return "bg-white text-c-orange-dark dark:bg-slate-900 dark:text-c-black-warning";
    case "primary-error":
      return "bg-c-red/15 text-c-red-dark dark:bg-c-black-error/25 dark:text-c-black-error";
    case "secondary-error":
      return "bg-white text-c-red-dark dark:bg-slate-900 dark:text-c-black-error";
    case "primary":
    default:
      return "bg-c-blue-light/30 text-c-blue-dark dark:bg-c-black-light/35 dark:text-slate-100";
  }
});

function toggleItem() {
  if (props.disabled) {
    return;
  }

  if (accordion) {
    accordion.toggleItem(itemId);
    return;
  }

  localOpen.value = !localOpen.value;
}

function onButtonKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    accordion?.focusByStep(itemId, 1);
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    accordion?.focusByStep(itemId, -1);
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleItem();
  }
}

onMounted(() => {
  if (!accordion || !buttonRef.value) {
    return;
  }
  accordion.registerItem(itemId, buttonRef.value, props.defaultOpen);
});

onBeforeUnmount(() => {
  if (!accordion) {
    return;
  }
  accordion.unregisterItem(itemId);
});
</script>

<template>
  <section
    class="overflow-hidden bg-white dark:bg-slate-900"
    :class="wrapperClass"
    data-testid="accordion-item"
  >
    <div
      class="flex items-center justify-between gap-3 px-4 py-3"
      :class="headerToneClass"
    >
      <div class="flex min-w-0 items-center gap-2">
        <span v-if="hasIconSlot" class="inline-flex shrink-0 items-center">
          <slot name="icon" />
        </span>
        <h3 class="truncate text-sm font-semibold">
          {{ title }}
        </h3>
      </div>

      <button
        ref="buttonRef"
        type="button"
        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-current transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/10 dark:focus-visible:ring-offset-slate-900"
        :disabled="disabled"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="contentId"
        :aria-label="chevronLabel"
        @click="toggleItem"
        @keydown="onButtonKeydown"
      >
        <FontAwesomeIcon :icon="chevronIcon" />
      </button>
    </div>

    <transition name="budget-accordion-collapse">
      <div
        v-show="isOpen"
        :id="contentId"
        class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200"
        data-testid="accordion-content"
      >
        <slot />
      </div>
    </transition>
  </section>
</template>

<style scoped>
.budget-accordion-collapse-enter-active,
.budget-accordion-collapse-leave-active {
  transition: max-height 0.24s ease, opacity 0.2s ease, transform 0.2s ease;
  overflow: hidden;
}

.budget-accordion-collapse-enter-from,
.budget-accordion-collapse-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}

.budget-accordion-collapse-enter-to,
.budget-accordion-collapse-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 640px;
}
</style>
