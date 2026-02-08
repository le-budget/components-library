<script setup lang="ts">
import { computed, useSlots } from "vue";
import { nextId } from "../../utils/id";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    size?: "sm" | "md" | "lg";
    label?: string;
    placeholder?: string;
    name?: string;
    autocomplete?: string;
    id?: string;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
    errorMessage?: string;
  }>(),
  {
    size: "md",
    label: undefined,
    placeholder: undefined,
    name: undefined,
    autocomplete: "off",
    id: undefined,
    disabled: false,
    error: false,
    success: false,
    errorMessage: undefined
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const slots = useSlots();
const inputId = props.id ?? nextId("budget-input");
const describedBy = computed(() =>
  props.error ? `${inputId}-error` : undefined
);
const resolvedErrorMessage = computed(
  () => props.errorMessage ?? "Valeur invalide"
);
const hasPrefix = computed(() => Boolean(slots.prefix));
const hasSuffix = computed(() => Boolean(slots.suffix));
const sizeClass = computed(() => {
  if (props.size === "sm") {
    return {
      input: "py-1.5 text-sm leading-5",
      prefix: "left-2.5 text-sm",
      suffix: "right-2.5 text-sm",
      withPrefix: "pl-8",
      withSuffix: "pr-8"
    };
  }
  if (props.size === "lg") {
    return {
      input: "py-2.5 text-base leading-6",
      prefix: "left-3.5 text-base",
      suffix: "right-3.5 text-base",
      withPrefix: "pl-10",
      withSuffix: "pr-10"
    };
  }
  return {
    input: "py-2 text-base",
    prefix: "left-3",
    suffix: "right-3",
    withPrefix: "pl-9",
    withSuffix: "pr-9"
  };
});
const inputStateClass = computed(() => {
  if (props.error) {
    return "text-c-red border-c-red focus-visible:ring-c-red dark:text-c-red";
  }
  if (props.success) {
    return "text-c-green border-c-green focus-visible:ring-c-green dark:text-c-green";
  }
  return "text-slate-900 border-c-blue focus-visible:ring-c-blue dark:text-slate-100";
});

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="inputId" class="text-base font-medium text-slate-700 dark:text-slate-200">
      {{ label }}
    </label>
    <div class="relative">
      <!-- c8 ignore start -->
      <span
        v-if="hasPrefix"
        :class="[
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400',
          sizeClass.prefix
        ]"
      >
        <slot name="prefix" />
      </span>
      <input
        :id="inputId"
        type="text"
        :name="name"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="[
          'w-full rounded border px-3 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 dark:bg-slate-900 dark:disabled:bg-slate-800 dark:focus-visible:ring-offset-slate-900',
          sizeClass.input,
          inputStateClass,
          hasPrefix ? sizeClass.withPrefix : '',
          hasSuffix ? sizeClass.withSuffix : ''
        ]"
        @input="onInput"
      />
      <span
        v-if="hasSuffix"
        :class="[
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400',
          sizeClass.suffix
        ]"
      >
        <slot name="suffix" />
      </span>
      <!-- c8 ignore stop -->
    </div>
    <p
      v-if="error"
      :id="describedBy"
      class="text-xs text-c-red"
    >
      {{ resolvedErrorMessage }}
    </p>
  </div>
</template>
