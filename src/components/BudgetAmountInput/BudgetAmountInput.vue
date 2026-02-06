<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { nextId } from "../../utils/id";

const NBSP = "\u00A0";

const props = withDefaults(
  defineProps<{
    modelValue: number | null;
    label?: string;
    placeholder?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    allowEmpty?: boolean;
  }>(),
  {
    label: undefined,
    placeholder: undefined,
    name: undefined,
    id: undefined,
    disabled: false,
    error: false,
    errorMessage: undefined,
    allowEmpty: false
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: number | null): void;
}>();

const inputId = props.id ?? nextId("budget-amount");
const describedBy = computed(() =>
  props.error ? `${inputId}-error` : undefined
);
const resolvedErrorMessage = computed(
  () => props.errorMessage ?? "Valeur invalide"
);

const displayValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

function formatNumber(value: number) {
  const sign = value < 0 ? "-" : "";
  const [intPart, decPart] = Math.abs(value).toFixed(2).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${grouped},${decPart}${NBSP}€`;
}

function normalizeInput(value: string) {
  const cleaned = value.replace(/[^\d,.-]/g, "");
  let sign = "";
  let rest = cleaned;
  if (rest.startsWith("-")) {
    sign = "-";
    rest = rest.slice(1);
  }
  rest = rest.replace(/-/g, "");
  const parts = rest.split(",");
  const intPart = parts[0].replace(/\D/g, "");
  const fracPart = (parts[1] ?? "").replace(/\D/g, "").slice(0, 2);
  const hasComma = rest.includes(",");
  const normalized = `${sign}${intPart}${hasComma ? `,${fracPart}` : ""}`;

  return {
    sign,
    intPart,
    fracPart,
    hasComma,
    normalized
  };
}

function normalizedToNumber(sign: string, intPart: string, fracPart: string) {
  const normalizedInt = intPart.length > 0 ? intPart : "0";
  const normalizedFrac = fracPart.padEnd(2, "0");
  return Number(`${sign}${normalizedInt}.${normalizedFrac}`);
}

function cursorFromNormalized(display: string, normalizedIndex: number) {
  if (normalizedIndex <= 0) {
    const currencyIndex = display.indexOf(NBSP);
    /* v8 ignore start */
    if (currencyIndex === -1) {
      return display.length;
    }
    /* v8 ignore stop */
    return currencyIndex;
  }

  let count = 0;
  let position = display.length;
  for (let i = 0; i < display.length; i += 1) {
    if (/[0-9,-]/.test(display[i])) {
      count += 1;
      if (count === normalizedIndex) {
        position = i + 1;
        break;
      }
    }
  }
  return position;
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;
  const cursorPosition = target.selectionStart ?? rawValue.length;
  const rawBeforeCursor = rawValue.slice(0, cursorPosition);

  const normalized = normalizeInput(rawValue);
  const normalizedBefore = normalizeInput(rawBeforeCursor);
  const normalizedCursorIndex = normalizedBefore.normalized.length;

  const hasDigits =
    normalized.intPart.length > 0 || normalized.fracPart.length > 0;

  if (!hasDigits && normalized.sign === "") {
    if (props.allowEmpty) {
      displayValue.value = "";
      emit("update:modelValue", null);
      nextTick(() => {
        target.setSelectionRange(0, 0);
      });
      return;
    }
    const formattedZero = formatNumber(0);
    displayValue.value = formattedZero;
    target.value = formattedZero;
    emit("update:modelValue", 0);
    nextTick(() => {
      const nextCursor = cursorFromNormalized(formattedZero, 1);
      target.setSelectionRange(nextCursor, nextCursor);
    });
    return;
  }

  const numberValue = normalizedToNumber(
    normalized.sign,
    normalized.intPart,
    normalized.fracPart
  );
  const formatted = formatNumber(numberValue);
  displayValue.value = formatted;
  emit("update:modelValue", numberValue);

  nextTick(() => {
    const nextCursor = cursorFromNormalized(formatted, normalizedCursorIndex);
    target.setSelectionRange(nextCursor, nextCursor);
  });
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === null && props.allowEmpty) {
      displayValue.value = "";
      return;
    }
    const safeValue =
      typeof value === "number" && !Number.isNaN(value) ? value : 0;
    displayValue.value = formatNumber(safeValue);
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-slate-700 dark:text-slate-200">
      {{ label }}
    </label>
    <input
      ref="inputRef"
      :id="inputId"
      type="text"
      inputmode="decimal"
      :name="name"
      :placeholder="placeholder"
      :value="displayValue"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      class="w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
      :class="error ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-300 focus-visible:ring-slate-500'"
      @input="onInput"
    />
    <p
      v-if="error"
      :id="describedBy"
      class="text-xs text-red-600"
    >
      {{ resolvedErrorMessage }}
    </p>
  </div>
</template>
