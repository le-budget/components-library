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

function onToggle(value: boolean) {
  emit("update:modelValue", value);
}
</script>

<template>
  <div
    :class="[
      budgetCategoryGridClass,
      sizeClasses.container,
      'transition hover:bg-[#fcfaf6] md:items-center',
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
            class="inline-flex shrink-0 items-center justify-center rounded-md text-[#776f61]"
            :class="[sizeClasses.handleButton, sizeClasses.handleIcon]"
            data-testid="budget-category-item-drag-handle"
          >
            <slot name="dragHandle">
              <FontAwesomeIcon :icon="dragHandleIcon" />
            </slot>
          </span>

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

            <span class="truncate font-semibold text-[#1f1a17]" :class="sizeClasses.label">
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

    <div class="self-center text-right font-medium text-[#2f2a26]" :class="sizeClasses.amount">
      {{ assigned }}
    </div>
    <div class="self-center text-right font-medium text-[#2f2a26]" :class="sizeClasses.amount">
      {{ activity }}
    </div>
    <div class="self-center text-right">
      <BudgetBadge
        :text="available"
        :color="availableBadgeColor"
        :size="sizeClasses.badgeSize"
        data-testid="budget-category-item-available"
      />
    </div>
  </div>
</template>
