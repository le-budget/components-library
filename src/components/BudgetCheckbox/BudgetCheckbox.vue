<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { nextId } from "../../utils/id";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    label?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    color?: "primary" | "success" | "warning" | "error" | "neutral";
    indeterminate?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    label: undefined,
    id: undefined,
    name: undefined,
    disabled: false,
    color: "primary",
    indeterminate: false,
    size: "md"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const inputId = props.id ?? nextId("budget-checkbox");
const describedBy = computed(() => undefined);
const inputRef = ref<HTMLInputElement | null>(null);

watchEffect(() => {
  if (!inputRef.value) {
    return;
  }
  inputRef.value.indeterminate = props.indeterminate && !props.modelValue;
});

const colorClass = computed(() => {
  switch (props.color) {
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
  if (props.size === "sm") {
    return {
      box: "h-4 w-4",
      icon: "h-2.5 w-2.5"
    };
  }
  if (props.size === "lg") {
    return {
      box: "h-6 w-6",
      icon: "h-3.5 w-3.5"
    };
  }
  return {
    box: "h-5 w-5",
    icon: "h-3 w-3"
  };
});

const iconPath = computed(() => {
  if (props.modelValue) {
    return "M1 5L4 8L11 1";
  }
  if (props.indeterminate) {
    return "M2 5H10";
  }
  return null;
});
const iconDisplayClass = computed(() => (iconPath.value ? "opacity-100" : "opacity-0"));

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
      <input
        ref="inputRef"
        :id="inputId"
        type="checkbox"
        class="peer sr-only"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        :aria-checked="indeterminate && !modelValue ? 'mixed' : undefined"
        :aria-describedby="describedBy"
        @change="onChange"
      />
      <span
        class="flex items-center justify-center rounded border text-white transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-slate-900"
        :class="[
          sizeClass.box,
          colorClass.border,
          colorClass.ring,
          modelValue ? colorClass.checked : colorClass.unchecked,
          disabled ? 'opacity-60' : ''
        ]"
      >
        <svg
          :class="[sizeClass.icon, iconDisplayClass]"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            :d="iconPath ?? ''"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span v-if="label">{{ label }}</span>
    </label>
  </div>
</template>
