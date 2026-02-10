<script setup lang="ts">
import { computed } from "vue";
import { nextId } from "../../utils/id";
import type { BudgetRadioColor } from "../BudgetRadioGroup/radioGroupContext";

defineOptions({
  name: "BudgetToggle"
});

type BudgetToggleSize = "sm" | "md" | "lg" | "xl";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    id?: string;
    name?: string;
    disabled?: boolean;
    color?: BudgetRadioColor;
    size?: BudgetToggleSize;
    activeText?: string;
    inactiveText?: string;
    ariaLabel?: string;
  }>(),
  {
    modelValue: false,
    id: undefined,
    name: undefined,
    disabled: false,
    color: "primary",
    size: "md",
    activeText: undefined,
    inactiveText: undefined,
    ariaLabel: undefined
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const inputId = props.id ?? nextId("budget-toggle");

const resolvedText = computed(() =>
  props.modelValue ? props.activeText : props.inactiveText
);

const resolvedAriaLabel = computed(
  () => props.ariaLabel ?? resolvedText.value ?? "Toggle"
);

const colorClass = computed(() => {
  switch (props.color) {
    case "neutral":
      return {
        on: "bg-slate-500 dark:bg-slate-500",
        ring: "peer-focus-visible:ring-slate-500 dark:peer-focus-visible:ring-slate-500"
      };
    case "success":
      return {
        on: "bg-c-green dark:bg-c-black-success",
        ring: "peer-focus-visible:ring-c-green-dark dark:peer-focus-visible:ring-c-black-success"
      };
    case "warning":
      return {
        on: "bg-c-orange dark:bg-c-black-warning",
        ring: "peer-focus-visible:ring-c-orange-dark dark:peer-focus-visible:ring-c-black-warning"
      };
    case "error":
      return {
        on: "bg-c-red dark:bg-c-black-error",
        ring: "peer-focus-visible:ring-c-red-dark dark:peer-focus-visible:ring-c-black-error"
      };
    case "primary":
    default:
      return {
        on: "bg-c-blue dark:bg-c-black",
        ring: "peer-focus-visible:ring-c-blue-dark dark:peer-focus-visible:ring-c-black"
      };
  }
});

const sizeClass = computed(() => {
  if (props.size === "sm") {
    return {
      track: "h-5 w-9",
      thumb: "h-4 w-4",
      translate: "translate-x-4",
      text: "text-xs"
    };
  }
  if (props.size === "lg") {
    return {
      track: "h-7 w-[3.25rem]",
      thumb: "h-6 w-6",
      translate: "translate-x-6",
      text: "text-base"
    };
  }
  if (props.size === "xl") {
    return {
      track: "h-8 w-[3.75rem]",
      thumb: "h-7 w-7",
      translate: "translate-x-7",
      text: "text-lg"
    };
  }
  return {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    translate: "translate-x-5",
    text: "text-sm"
  };
});

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
}
</script>

<template>
  <label
    class="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <input
      :id="inputId"
      type="checkbox"
      role="switch"
      class="peer sr-only"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      :aria-checked="modelValue ? 'true' : 'false'"
      :aria-label="resolvedAriaLabel"
      @change="onChange"
    />

    <span
      class="relative inline-flex shrink-0 items-center rounded-full p-0.5 transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-slate-900"
      :class="[
        sizeClass.track,
        colorClass.ring,
        modelValue ? colorClass.on : 'bg-slate-300 dark:bg-slate-700'
      ]"
      aria-hidden="true"
    >
      <span
        class="rounded-full bg-white shadow-sm transition-transform"
        :class="[sizeClass.thumb, modelValue ? sizeClass.translate : 'translate-x-0']"
      />
    </span>

    <span v-if="resolvedText" :class="sizeClass.text">
      {{ resolvedText }}
    </span>
  </label>
</template>
