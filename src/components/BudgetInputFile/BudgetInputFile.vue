<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { nextId } from "../../utils/id";

type InputSize = "sm" | "md" | "lg";
type InputColor = "primary" | "success" | "warning" | "error" | "neutral";
type InvalidReason = "type" | "size";

interface BudgetFileInvalidPayload {
  reason: InvalidReason;
  file: File;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

const props = withDefaults(
  defineProps<{
    modelValue: File | null;
    size?: InputSize;
    color?: InputColor;
    label?: string;
    placeholder?: string;
    dropzoneLabel?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    required?: boolean;
    accept?: string | string[];
    maxFileSize?: number;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    size: "md",
    color: "primary",
    label: undefined,
    placeholder: "Aucun fichier selectionne",
    dropzoneLabel: "Glissez-deposez un fichier ici ou cliquez pour parcourir",
    name: undefined,
    id: undefined,
    disabled: false,
    required: false,
    accept: undefined,
    maxFileSize: undefined,
    error: false,
    errorMessage: undefined
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: File | null): void;
  (event: "invalid", payload: BudgetFileInvalidPayload): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const dragActive = ref(false);
const localErrorMessage = ref<string | null>(null);

const inputId = props.id ?? nextId("budget-file-input");
const acceptList = computed(() => {
  if (Array.isArray(props.accept)) {
    return props.accept.map((item) => item.trim()).filter((item) => item.length > 0);
  }
  if (typeof props.accept === "string") {
    return props.accept
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return [];
});
const acceptAttr = computed(() => (acceptList.value.length > 0 ? acceptList.value.join(",") : undefined));
const isErrored = computed(() => props.error || localErrorMessage.value !== null);
const describedBy = computed(() => (isErrored.value ? `${inputId}-error` : undefined));
const resolvedErrorMessage = computed(() => props.errorMessage ?? localErrorMessage.value ?? "Fichier invalide");
const sizeClass = computed(() => {
  if (props.size === "sm") {
    return "p-3 text-sm";
  }
  if (props.size === "lg") {
    return "p-5 text-base";
  }
  return "p-4 text-sm";
});
const toneClass = computed(() => {
  if (isErrored.value || props.color === "error") {
    return "border-c-red text-c-red-dark focus-visible:ring-c-red";
  }

  switch (props.color) {
    case "neutral":
      return "border-slate-400 text-slate-700 focus-visible:ring-slate-500";
    case "success":
      return "border-c-green text-c-green-dark focus-visible:ring-c-green";
    case "warning":
      return "border-c-orange text-c-orange-dark focus-visible:ring-c-orange";
    case "primary":
    default:
      return "border-c-blue text-slate-700 focus-visible:ring-c-blue";
  }
});

const selectedFileText = computed(() => {
  if (!props.modelValue) {
    return props.placeholder;
  }
  return `${props.modelValue.name} (${formatBytes(props.modelValue.size)})`;
});

watch(
  () => props.modelValue,
  (value) => {
    if (value === null && inputRef.value) {
      inputRef.value.value = "";
    }
    if (!props.error) {
      localErrorMessage.value = null;
    }
  }
);

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} o`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} Ko`;
  }
  return `${(kb / 1024).toFixed(1)} Mo`;
}

function openPicker() {
  if (props.disabled) {
    return;
  }
  inputRef.value?.click();
}

function clearFile() {
  if (props.disabled) {
    return;
  }
  if (inputRef.value) {
    inputRef.value.value = "";
  }
  localErrorMessage.value = null;
  emit("update:modelValue", null);
}

function matchesAccept(file: File) {
  if (acceptList.value.length === 0) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return acceptList.value.some((rawRule) => {
    const rule = rawRule.toLowerCase();
    if (rule.startsWith(".")) {
      return lowerName.endsWith(rule);
    }
    if (rule.endsWith("/*")) {
      const group = rule.slice(0, -1);
      return mimeType.startsWith(group);
    }
    return mimeType === rule;
  });
}

function selectFile(file: File) {
  if (!matchesAccept(file)) {
    localErrorMessage.value = "Type de fichier non autorise";
    emit("invalid", {
      reason: "type",
      file,
      acceptedTypes: acceptList.value
    });
    return;
  }

  if (typeof props.maxFileSize === "number" && file.size > props.maxFileSize) {
    localErrorMessage.value = `Fichier trop volumineux (max ${formatBytes(props.maxFileSize)})`;
    emit("invalid", {
      reason: "size",
      file,
      maxFileSize: props.maxFileSize
    });
    return;
  }

  localErrorMessage.value = null;
  emit("update:modelValue", file);
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    emit("update:modelValue", null);
    return;
  }
  selectFile(file);
}

function onDragOver(event: DragEvent) {
  if (props.disabled) {
    return;
  }
  event.preventDefault();
  dragActive.value = true;
}

function onDragLeave(event: DragEvent) {
  if (props.disabled) {
    return;
  }
  event.preventDefault();
  dragActive.value = false;
}

function onDrop(event: DragEvent) {
  if (props.disabled) {
    return;
  }
  event.preventDefault();
  dragActive.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (!file) {
    return;
  }
  selectFile(file);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  openPicker();
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="inputId" class="text-base font-medium text-slate-700 dark:text-slate-200">
      {{ label }}
    </label>

    <input
      :id="inputId"
      ref="inputRef"
      type="file"
      class="sr-only"
      :name="name"
      :disabled="disabled"
      :required="required"
      :accept="acceptAttr"
      :aria-invalid="isErrored ? 'true' : undefined"
      :aria-describedby="describedBy"
      @change="onInputChange"
    />

    <div
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-label="dropzoneLabel"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-invalid="isErrored ? 'true' : undefined"
      :aria-describedby="describedBy"
      class="rounded border-2 border-dashed bg-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-offset-white dark:bg-slate-900 dark:focus-visible:ring-offset-slate-900"
      :class="[
        sizeClass,
        toneClass,
        dragActive ? 'bg-slate-50 dark:bg-slate-800' : '',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      ]"
      @click="openPicker"
      @keydown="onKeydown"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <p class="font-medium">
        {{ dropzoneLabel }}
      </p>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
        {{ selectedFileText }}
      </p>
      <p v-if="maxFileSize" class="mt-1 text-xs text-slate-500 dark:text-slate-300">
        Taille max: {{ formatBytes(maxFileSize) }}
      </p>
      <p v-if="acceptAttr" class="mt-1 text-xs text-slate-500 dark:text-slate-300">
        Types autorises: {{ acceptAttr }}
      </p>
    </div>

    <button
      v-if="modelValue"
      type="button"
      class="w-fit text-xs font-medium text-c-blue underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue"
      :disabled="disabled"
      @click="clearFile"
    >
      Retirer le fichier
    </button>

    <p
      v-if="isErrored"
      :id="`${inputId}-error`"
      class="text-xs text-c-red"
    >
      {{ resolvedErrorMessage }}
    </p>
  </div>
</template>
