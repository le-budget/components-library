<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, provide, ref, useSlots, watch } from "vue";
import BudgetCheckbox from "../BudgetCheckbox/BudgetCheckbox.vue";
import { chevronDownIcon, chevronUpIcon, dragHandleIcon } from "../../icons";
import { nextId } from "../../utils/id";
import {
  budgetCategoryGridClass,
  budgetCategorySizeKey,
  resolveBudgetCategoryGroupSize,
  type BudgetCategorySize
} from "../BudgetCategory/budgetCategory.shared";

defineOptions({
  name: "BudgetCategoryGroup"
});

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    assigned: string;
    activity: string;
    available: string;
    size?: BudgetCategorySize;
    hasDragHandle?: boolean;
    hasCheckbox?: boolean;
    collapsed?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    checkboxColor?: "primary" | "success" | "warning" | "error" | "neutral";
  }>(),
  {
    size: "lg",
    hasDragHandle: false,
    hasCheckbox: true,
    collapsed: undefined,
    indeterminate: false,
    disabled: false,
    checkboxColor: "neutral"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "update:collapsed", value: boolean): void;
}>();

const slots = useSlots();
const contentId = nextId("budget-category-group");
const internalCollapsed = ref(false);
const hasPrefix = computed(() => Boolean(slots.prefix));
const resolvedSize = computed<BudgetCategorySize>(() => props.size);
const sizeClasses = computed(() => resolveBudgetCategoryGroupSize(resolvedSize.value));
const assignedText = computed(() => formatFrenchCurrency(props.assigned));
const activityText = computed(() => formatFrenchCurrency(props.activity));
const availableText = computed(() => formatFrenchCurrency(props.available));
const isControlled = computed(() => props.collapsed !== undefined);
const isCollapsed = computed(() => {
  if (isControlled.value) {
    return props.collapsed as boolean;
  }
  return internalCollapsed.value;
});
const chevronIcon = computed(() =>
  isCollapsed.value ? chevronDownIcon : chevronUpIcon
);

provide(budgetCategorySizeKey, resolvedSize);

watch(
  () => props.collapsed,
  (value) => {
    if (value === undefined) {
      return;
    }
    internalCollapsed.value = value;
  },
  { immediate: true }
);

function onToggleSelection(value: boolean) {
  emit("update:modelValue", value);
}

function formatFrenchCurrency(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return value;
  }

  if (trimmedValue === "-") {
    return trimmedValue;
  }

  const normalizedValue = trimmedValue
    .replace(/\s*€/gu, "")
    .replace(/\s*EUR/giu, "")
    .replace(/\u00A0/gu, " ")
    .replace(/\s+/gu, "")
    .replace(/,/gu, ".");

  const parsedValue = Number(normalizedValue);
  if (Number.isNaN(parsedValue)) {
    return value;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parsedValue);
}

function toggleCollapse() {
  if (props.disabled) {
    return;
  }

  const nextValue = !isCollapsed.value;
  if (!isControlled.value) {
    internalCollapsed.value = nextValue;
  }
  emit("update:collapsed", nextValue);
}
</script>

<template>
  <section
    class="border-b border-[#f1eadf]"
    data-testid="budget-category-group"
    :data-size="resolvedSize"
  >
    <div
      :class="[
        budgetCategoryGridClass,
        sizeClasses.container,
        'bg-[#f4f4f4] font-semibold text-[#39342f]',
        disabled ? 'opacity-60' : ''
      ]"
      :data-size="resolvedSize"
    >
      <div class="flex items-center" :class="sizeClasses.row">
        <span
          v-if="props.hasDragHandle"
          class="inline-flex shrink-0 items-center justify-center rounded-md text-[#b9b2a8]"
          :class="[sizeClasses.handleButton, sizeClasses.handleIcon]"
          data-testid="budget-category-group-drag-handle"
        >
          <slot name="dragHandle">
            <FontAwesomeIcon :icon="dragHandleIcon" />
          </slot>
        </span>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md text-[#776f61] transition hover:bg-black/5 hover:text-[#5d564d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:cursor-not-allowed"
          :class="[sizeClasses.button, sizeClasses.icon]"
          :aria-label="isCollapsed ? `Afficher ${title}` : `Replier ${title}`"
          :aria-expanded="isCollapsed ? 'false' : 'true'"
          :aria-controls="contentId"
          :disabled="disabled"
          @click="toggleCollapse"
        >
          <FontAwesomeIcon :icon="chevronIcon" />
        </button>

        <BudgetCheckbox
          v-if="props.hasCheckbox"
          :model-value="modelValue"
          :indeterminate="indeterminate"
          :disabled="disabled"
          :color="checkboxColor"
          :size="sizeClasses.checkboxSize"
          :aria-label="`Selectionner le groupe ${title}`"
          @update:model-value="onToggleSelection"
        />

        <div class="flex min-w-0 items-center" :class="sizeClasses.row">
          <span
            v-if="hasPrefix"
            class="inline-flex shrink-0 items-center justify-center"
            data-testid="budget-category-group-prefix"
          >
            <slot name="prefix" />
          </span>
          <span class="truncate" :class="sizeClasses.title">{{ title }}</span>
        </div>
      </div>

      <span class="text-right" :class="sizeClasses.amount">{{ assignedText }}</span>
      <span class="text-right" :class="sizeClasses.amount">{{ activityText }}</span>
      <span class="text-right" :class="sizeClasses.amount">{{ availableText }}</span>
    </div>

    <transition name="budget-category-group-collapse">
      <div
        v-show="!isCollapsed"
        :id="contentId"
        class="divide-y divide-[#f1eadf]"
        data-testid="budget-category-group-content"
      >
        <slot />
      </div>
    </transition>
  </section>
</template>

<style scoped>
.budget-category-group-collapse-enter-active,
.budget-category-group-collapse-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.budget-category-group-collapse-enter-from,
.budget-category-group-collapse-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
