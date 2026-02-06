<script setup lang="ts">
import { computed } from "vue";
import { nextId } from "../../utils/id";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    label?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    label: undefined,
    id: undefined,
    name: undefined,
    disabled: false,
    error: false,
    errorMessage: undefined
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const inputId = props.id ?? nextId("budget-checkbox");
const describedBy = computed(() =>
  props.error ? `${inputId}-error` : undefined
);
const resolvedErrorMessage = computed(
  () => props.errorMessage ?? "Valeur invalide"
);

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
      <input
        :id="inputId"
        type="checkbox"
        class="peer sr-only"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        @change="onChange"
      />
      <span
        class="flex h-5 w-5 items-center justify-center rounded border text-white transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-slate-900"
        :class="[
          error
            ? 'border-red-500 peer-focus-visible:ring-red-500'
            : 'border-slate-300 peer-focus-visible:ring-slate-500',
          modelValue
            ? 'bg-slate-900 dark:bg-slate-100'
            : 'bg-white dark:bg-slate-900',
          disabled ? 'opacity-60' : ''
        ]"
      >
        <svg
          v-show="modelValue"
          class="h-3 w-3"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 5L4 8L11 1"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span v-if="label">{{ label }}</span>
    </label>
    <p
      v-if="error"
      :id="describedBy"
      class="text-xs text-red-600"
    >
      {{ resolvedErrorMessage }}
    </p>
  </div>
</template>
