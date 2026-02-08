<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { nextId } from "../../utils/id";
import {
  budgetRadioGroupKey,
  type BudgetRadioColor,
  type BudgetRadioSize,
  type BudgetRadioValue
} from "./radioGroupContext";

defineOptions({
  name: "BudgetRadioGroup"
});

const props = withDefaults(
  defineProps<{
    modelValue: BudgetRadioValue;
    label?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    color?: BudgetRadioColor;
    size?: BudgetRadioSize;
    orientation?: "horizontal" | "vertical";
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    label: undefined,
    id: undefined,
    name: undefined,
    disabled: false,
    color: "primary",
    size: "md",
    orientation: "horizontal",
    error: false,
    errorMessage: undefined
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: BudgetRadioValue): void;
}>();

const radios = ref<HTMLInputElement[]>([]);
const groupId = props.id ?? nextId("budget-radio-group");
const labelId = `${groupId}-label`;
const errorId = `${groupId}-error`;

const resolvedName = computed(() => props.name ?? `${groupId}-name`);
const describedBy = computed(() => (props.error ? errorId : undefined));
const resolvedErrorMessage = computed(
  () => props.errorMessage ?? "Valeur invalide"
);
const orientationClass = computed(() =>
  props.orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
);

function isSelected(value: BudgetRadioValue) {
  return Object.is(props.modelValue, value);
}

function selectValue(value: BudgetRadioValue) {
  emit("update:modelValue", value);
}

function registerRadio(input: HTMLInputElement) {
  if (radios.value.includes(input)) {
    return;
  }
  radios.value.push(input);
}

function unregisterRadio(input: HTMLInputElement) {
  radios.value = radios.value.filter((radioInput) => radioInput !== input);
}

function focusByStep(current: HTMLInputElement, step: -1 | 1) {
  const enabledRadios = radios.value.filter((radioInput) => !radioInput.disabled);
  if (enabledRadios.length === 0) {
    return;
  }

  const currentIndex = enabledRadios.findIndex((radioInput) => radioInput === current);
  const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex =
    (fallbackIndex + step + enabledRadios.length) % enabledRadios.length;
  const nextRadio = enabledRadios[nextIndex];

  nextRadio.focus();
  nextRadio.checked = true;
  nextRadio.dispatchEvent(new Event("change", { bubbles: true }));
}

provide(budgetRadioGroupKey, {
  name: resolvedName,
  modelValue: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  color: computed(() => props.color),
  size: computed(() => props.size),
  error: computed(() => props.error),
  describedBy,
  isSelected,
  selectValue,
  registerRadio,
  unregisterRadio,
  focusByStep
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <span
      v-if="label"
      :id="labelId"
      class="text-base font-medium text-slate-700 dark:text-slate-200"
    >
      {{ label }}
    </span>

    <div
      role="radiogroup"
      :aria-labelledby="label ? labelId : undefined"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="['flex gap-3', orientationClass]"
    >
      <slot />
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="text-xs text-c-red"
    >
      {{ resolvedErrorMessage }}
    </p>
  </div>
</template>
