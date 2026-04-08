<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, inject, useSlots } from "vue";
import BudgetBadge from "../BudgetBadge/BudgetBadge.vue";
import BudgetCheckbox from "../BudgetCheckbox/BudgetCheckbox.vue";
import BudgetProgressBar from "../BudgetProgressBar/BudgetProgressBar.vue";
import { dragHandleIcon } from "../../icons";
import {
  budgetCategoryGridClass,
  budgetCategorySizeKey,
  resolveBudgetCategoryAvailableBadgeColor,
  resolveBudgetCategoryProgressColor,
  resolveBudgetCategoryItemSize,
  type BudgetCategorySize,
  type BudgetCategoryTone
} from "../BudgetCategory/budgetCategory.shared";

defineOptions({
  name: "BudgetCategoryItem"
});

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    label: string;
    assigned: string;
    activity: string;
    available: string;
    progress: number;
    progressLabel: string;
    tone?: BudgetCategoryTone;
    size?: BudgetCategorySize;
    hasDragHandle?: boolean;
    hasCheckbox?: boolean;
    disabled?: boolean;
    checkboxColor?: "primary" | "success" | "warning" | "error" | "neutral";
  }>(),
  {
    tone: "neutral",
    hasDragHandle: false,
    hasCheckbox: true,
    disabled: false,
    checkboxColor: "neutral"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const slots = useSlots();
const inheritedSize = inject(budgetCategorySizeKey, null);
const hasPrefix = computed(() => Boolean(slots.prefix));
const hasLeadingControls = computed(() => props.hasDragHandle || props.hasCheckbox);
const resolvedSize = computed<BudgetCategorySize>(() => props.size ?? inheritedSize?.value ?? "lg");
const sizeClasses = computed(() => resolveBudgetCategoryItemSize(resolvedSize.value));
const normalizedProgress = computed(() => Math.min(Math.max(props.progress, 0), 100));
const progressColor = computed(() => resolveBudgetCategoryProgressColor(props.tone));
const availableBadgeColor = computed(() => resolveBudgetCategoryAvailableBadgeColor(props.tone));
const assignedText = computed(() => formatFrenchCurrency(props.assigned));
const activityText = computed(() => formatFrenchCurrency(props.activity));
const availableText = computed(() => formatFrenchCurrency(props.available));

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

function onToggle(value: boolean) {
  emit("update:modelValue", value);
}
</script>

<template>
  <div
    :class="[
      budgetCategoryGridClass,
      sizeClasses.container,
      'transition hover:bg-[#fffdf2] md:items-center',
      disabled ? 'opacity-60' : ''
    ]"
    data-testid="budget-category-item"
    :data-size="resolvedSize"
  >
    <div class="min-w-0">
      <div
        class="grid items-center"
        :class="[
          hasLeadingControls ? 'grid-cols-[auto_minmax(0,1fr)]' : 'grid-cols-1',
          sizeClasses.innerGrid
        ]"
      >
        <div
          v-if="hasLeadingControls"
          class="flex items-center self-stretch"
          :class="sizeClasses.controlGap"
        >
          <span
            v-if="props.hasDragHandle"
            class="inline-flex shrink-0 items-center justify-center rounded-md text-[#b9b2a8]"
            :class="[sizeClasses.handleButton, sizeClasses.handleIcon]"
            data-testid="budget-category-item-drag-handle"
          >
            <slot name="dragHandle">
              <FontAwesomeIcon :icon="dragHandleIcon" />
            </slot>
          </span>

          <span
            v-if="props.hasCheckbox"
            aria-hidden="true"
            class="inline-flex shrink-0"
            :class="sizeClasses.chevronSpacer"
          />

          <BudgetCheckbox
            v-if="props.hasCheckbox"
            :model-value="modelValue"
            :disabled="disabled"
            :color="checkboxColor"
            :size="sizeClasses.checkboxSize"
            :aria-label="`Selectionner la categorie ${label}`"
            @update:model-value="onToggle"
          />
        </div>

        <div class="min-w-0">
          <div class="flex items-center" :class="sizeClasses.row">
            <span
              v-if="hasPrefix"
              class="inline-flex shrink-0 items-center justify-center"
              :class="sizeClasses.prefix"
              data-testid="budget-category-item-prefix"
            >
              <slot name="prefix" />
            </span>

            <span class="truncate font-normal text-[#1f1a17]" :class="sizeClasses.label">
              {{ label }}
            </span>

            <span class="ml-auto font-medium text-[#6e675e]" :class="sizeClasses.progressLabel">
              {{ progressLabel }}
            </span>
          </div>

          <div :class="sizeClasses.progressPadding">
            <BudgetProgressBar
              :value="normalizedProgress"
              :animated="false"
              :thickness="sizeClasses.progressThickness"
              :color="progressColor"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="self-center text-right font-normal text-[#2f2a26]" :class="sizeClasses.amount">
      {{ assignedText }}
    </div>
    <div class="self-center text-right font-normal text-[#2f2a26]" :class="sizeClasses.amount">
      {{ activityText }}
    </div>
    <div class="self-center text-right">
      <BudgetBadge
        :text="availableText"
        :color="availableBadgeColor"
        :size="sizeClasses.badgeSize"
        data-testid="budget-category-item-available"
      />
    </div>
  </div>
</template>
