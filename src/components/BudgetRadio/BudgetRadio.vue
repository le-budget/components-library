<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue";
import { nextId } from "../../utils/id";
import {
  budgetRadioGroupKey,
  type BudgetRadioColor,
  type BudgetRadioSize,
  type BudgetRadioValue
} from "../BudgetRadioGroup/radioGroupContext";

defineOptions({
  name: "BudgetRadio"
});

const props = withDefaults(
  defineProps<{
    modelValue?: BudgetRadioValue;
    value: BudgetRadioValue;
    label?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    color?: BudgetRadioColor;
    size?: BudgetRadioSize;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: null,
    label: undefined,
    id: undefined,
    name: undefined,
    disabled: false,
    error: false,
    errorMessage: undefined
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: BudgetRadioValue): void;
}>();

const group = inject(budgetRadioGroupKey, null);
const inputRef = ref<HTMLInputElement | null>(null);
const inputId = props.id ?? nextId("budget-radio");
const standaloneErrorId = `${inputId}-error`;

const isGrouped = computed(() => group !== null);
const resolvedName = computed(() => group?.name.value ?? props.name);
const resolvedDisabled = computed(() => (group?.disabled.value ?? false) || props.disabled);
const resolvedColor = computed(
  () => props.color ?? group?.color.value ?? "primary"
);
const resolvedSize = computed(
  () => props.size ?? group?.size.value ?? "md"
);
const resolvedError = computed(() => group?.error.value ?? props.error);
const describedBy = computed(
  () => group?.describedBy.value ?? (props.error ? standaloneErrorId : undefined)
);
const resolvedErrorMessage = computed(
  () => props.errorMessage ?? "Valeur invalide"
);
const showStandaloneError = computed(() => props.error && !isGrouped.value);

const isChecked = computed(() =>
  group?.isSelected(props.value) ?? Object.is(props.modelValue, props.value)
);

const colorClass = computed(() => {
  switch (resolvedColor.value) {
    case "neutral":
      return {
        border: "border-slate-500 dark:border-slate-500",
        ring: "peer-focus-visible:ring-slate-500 dark:peer-focus-visible:ring-slate-500",
        checked: "bg-slate-500 dark:bg-slate-500 text-white",
        unchecked: "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400"
      };
    case "success":
      return {
        border: "border-c-green-dark dark:border-c-black-success",
        ring: "peer-focus-visible:ring-c-green-dark dark:peer-focus-visible:ring-c-black-success",
        checked: "bg-c-green dark:bg-c-black-success text-white",
        unchecked: "bg-white dark:bg-slate-900 text-c-green-dark dark:text-c-black-success"
      };
    case "warning":
      return {
        border: "border-c-orange-dark dark:border-c-black-warning",
        ring: "peer-focus-visible:ring-c-orange-dark dark:peer-focus-visible:ring-c-black-warning",
        checked: "bg-c-orange dark:bg-c-black-warning text-white",
        unchecked: "bg-white dark:bg-slate-900 text-c-orange-dark dark:text-c-black-warning"
      };
    case "error":
      return {
        border: "border-c-red-dark dark:border-c-black-error",
        ring: "peer-focus-visible:ring-c-red-dark dark:peer-focus-visible:ring-c-black-error",
        checked: "bg-c-red dark:bg-c-black-error text-white",
        unchecked: "bg-white dark:bg-slate-900 text-c-red-dark dark:text-c-black-error"
      };
    case "primary":
    default:
      return {
        border: "border-c-blue-dark dark:border-c-black",
        ring: "peer-focus-visible:ring-c-blue-dark dark:peer-focus-visible:ring-c-black",
        checked: "bg-c-blue dark:bg-c-black text-white",
        unchecked: "bg-white dark:bg-slate-900 text-c-blue-dark dark:text-c-black"
      };
  }
});

const sizeClass = computed(() => {
  if (resolvedSize.value === "sm") {
    return {
      box: "h-4 w-4",
      dot: "h-1.5 w-1.5"
    };
  }
  if (resolvedSize.value === "lg") {
    return {
      box: "h-6 w-6",
      dot: "h-2.5 w-2.5"
    };
  }
  return {
    box: "h-5 w-5",
    dot: "h-2 w-2"
  };
});

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.checked) {
    return;
  }
  if (group) {
    group.selectValue(props.value);
    return;
  }
  emit("update:modelValue", props.value);
}

function onKeydown(event: KeyboardEvent) {
  if (!group || !inputRef.value) {
    return;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    group.focusByStep(inputRef.value, 1);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    group.focusByStep(inputRef.value, -1);
  }
}

onMounted(() => {
  if (!group || !inputRef.value) {
    return;
  }
  group.registerRadio(inputRef.value);
});

onBeforeUnmount(() => {
  if (!group || !inputRef.value) {
    return;
  }
  group.unregisterRadio(inputRef.value);
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
      <input
        ref="inputRef"
        :id="inputId"
        type="radio"
        class="peer sr-only"
        :name="resolvedName"
        :value="value"
        :checked="isChecked"
        :disabled="resolvedDisabled"
        :aria-invalid="resolvedError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @change="onChange"
        @keydown="onKeydown"
      />

      <span
        class="flex items-center justify-center rounded-full border transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-slate-900"
        :class="[
          sizeClass.box,
          colorClass.border,
          colorClass.ring,
          isChecked ? colorClass.checked : colorClass.unchecked,
          resolvedDisabled ? 'opacity-60' : ''
        ]"
      >
        <span
          class="rounded-full bg-current transition"
          :class="[sizeClass.dot, isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75']"
          aria-hidden="true"
        />
      </span>

      <span v-if="label">{{ label }}</span>
    </label>

    <p
      v-if="showStandaloneError"
      :id="standaloneErrorId"
      class="text-xs text-c-red"
    >
      {{ resolvedErrorMessage }}
    </p>
  </div>
</template>
