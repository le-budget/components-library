<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  useSlots,
  type VNode
} from "vue";
import BudgetDropdownGroup from "../BudgetDropdownGroup/BudgetDropdownGroup.vue";
import BudgetDropdownOption from "../BudgetDropdownOption/BudgetDropdownOption.vue";
import { nextId } from "../../utils/id";

type DropdownValue = string | number | null;

type ParsedOption = {
  id: string;
  label: string;
  value: string | number;
  disabled: boolean;
  group?: string;
  rightText?: string;
};

type RenderItem =
  | {
      type: "group";
      label: string;
    }
  | {
      type: "option";
      option: ParsedOption;
      filteredIndex: number;
    };

const props = withDefaults(
  defineProps<{
    modelValue: DropdownValue;
    label?: string;
    placeholder?: string;
    name?: string;
    autocomplete?: string;
    id?: string;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
    errorMessage?: string;
    searchable?: boolean;
    allowCustomValue?: boolean;
  }>(),
  {
    label: undefined,
    placeholder: undefined,
    name: undefined,
    autocomplete: "off",
    id: undefined,
    disabled: false,
    error: false,
    success: false,
    errorMessage: undefined,
    searchable: true,
    allowCustomValue: false
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: DropdownValue): void;
}>();

const slots = useSlots();
const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const query = ref("");
const highlightedIndex = ref<number>(-1);
const isClearingSelection = ref(false);

const inputId = props.id ?? nextId("budget-dropdown");
const listId = `${inputId}-listbox`;
const describedBy = computed(() =>
  props.error ? `${inputId}-error` : undefined
);
const resolvedErrorMessage = computed(
  () => props.errorMessage ?? "Valeur invalide"
);

const hasPrefix = computed(() => Boolean(slots.prefix));
const hasNativeSuffix = computed(() => Boolean(slots.suffix));
const selectedRightText = computed(() => {
  if (isClearingSelection.value) {
    return undefined;
  }
  return selectedOption.value?.rightText;
});
const hasValue = computed(() => {
  if (props.modelValue === null) {
    return false;
  }
  if (typeof props.modelValue === "string") {
    return props.modelValue.trim().length > 0;
  }
  return true;
});
const showClearButton = computed(() => !props.disabled && hasValue.value);
const hasSuffix = computed(
  () => Boolean(selectedRightText.value) || hasNativeSuffix.value || showClearButton.value
);
const inputRightPaddingClass = computed(() => {
  if (showClearButton.value && (Boolean(selectedRightText.value) || hasNativeSuffix.value)) {
    return "pr-16";
  }
  return "pr-9";
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

function normalizeForSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesComponent(node: VNode, component: unknown) {
  return node.type === component;
}

function getVNodeChildren(node: VNode) {
  if (typeof node.children === "object" && node.children !== null) {
    const childrenObject = node.children as { default?: () => VNode[] };
    return childrenObject.default?.() ?? [];
  }
  return [];
}

function extractTextContent(nodes: VNode[]): string {
  return nodes
    .map((node) => {
      if (typeof node.children === "string") {
        return node.children;
      }
      /* c8 ignore start */
      if (typeof node.children === "object" && node.children !== null) {
        const childrenObject = node.children as { default?: () => VNode[] };
        return extractTextContent(childrenObject.default?.() ?? []);
      }
      /* c8 ignore stop */
      return "";
    })
    .join("")
    .trim();
}

function parseOptions(nodes: VNode[], groupLabel?: string): ParsedOption[] {
  return nodes.flatMap((node, index) => {
    if (matchesComponent(node, BudgetDropdownGroup)) {
      const groupProps = (node.props ?? {}) as { label?: string };
      const nestedChildren = getVNodeChildren(node);
      return parseOptions(nestedChildren, groupProps.label ?? groupLabel);
    }

    if (matchesComponent(node, BudgetDropdownOption)) {
      const optionProps = (node.props ?? {}) as {
        label?: string;
        value?: string | number;
        disabled?: boolean | string;
      };
      const optionChildren = (node.children ?? {}) as {
        right?: () => VNode[];
      };
      const rightText = extractTextContent(optionChildren.right?.() ?? []);
      if (typeof optionProps.value !== "string" && typeof optionProps.value !== "number") {
        return [];
      }
      return [
        {
          id: `${inputId}-option-${groupLabel ?? "default"}-${index}-${String(optionProps.value)}`,
          label: optionProps.label ?? String(optionProps.value),
          value: optionProps.value,
          disabled: optionProps.disabled === "" || Boolean(optionProps.disabled),
          group: groupLabel,
          rightText: rightText.length > 0 ? rightText : undefined
        }
      ];
    }
    return [];
  });
}

const allOptions = computed(() => parseOptions(slots.default?.() ?? []));

const selectedOption = computed(() =>
  allOptions.value.find((option) => option.value === props.modelValue)
);

const filteredOptions = computed(() => {
  if (!props.searchable) {
    return allOptions.value;
  }
  const trimmedQuery = query.value.trim();
  if (trimmedQuery.length === 0) {
    return allOptions.value;
  }
  const normalizedQuery = normalizeForSearch(trimmedQuery);
  return allOptions.value.filter((option) =>
    normalizeForSearch(option.label).includes(normalizedQuery)
  );
});

const canCreateCustomValue = computed(() => {
  if (!props.allowCustomValue) {
    return false;
  }
  const trimmedQuery = query.value.trim();
  if (trimmedQuery.length === 0) {
    return false;
  }
  const normalizedQuery = normalizeForSearch(trimmedQuery);
  return !allOptions.value.some((option) =>
    normalizeForSearch(option.label) === normalizedQuery
  );
});

const displayValue = computed(() => {
  if (isOpen.value && props.searchable) {
    return query.value;
  }
  if (selectedOption.value) {
    return selectedOption.value.label;
  }
  if (props.modelValue === null) {
    return "";
  }
  return String(props.modelValue);
});

const activeDescendant = computed(() =>
  isOpen.value && highlightedIndex.value >= 0
    ? filteredOptions.value[highlightedIndex.value]?.id
    : undefined
);

const renderItems = computed<RenderItem[]>(() => {
  let previousGroup: string | undefined;
  return filteredOptions.value.flatMap((option, filteredIndex) => {
    const items: RenderItem[] = [];
    if (option.group && option.group !== previousGroup) {
      items.push({
        type: "group",
        label: option.group
      });
      previousGroup = option.group;
    }
    items.push({
      type: "option",
      option,
      filteredIndex
    });
    return items;
  });
});

function resetQueryFromSelection() {
  if (selectedOption.value) {
    query.value = selectedOption.value.label;
    return;
  }
  if (props.modelValue !== null) {
    query.value = String(props.modelValue);
    return;
  }
  query.value = "";
}

function focusFirstEnabled() {
  highlightedIndex.value = filteredOptions.value.findIndex((option) => !option.disabled);
}

function syncHighlightWithSelection() {
  if (selectedOption.value) {
    const index = filteredOptions.value.findIndex(
      (option) => option.value === selectedOption.value?.value
    );
    if (index >= 0 && !filteredOptions.value[index].disabled) {
      highlightedIndex.value = index;
      return;
    }
  }
  focusFirstEnabled();
}

function openDropdown() {
  if (!isOpen.value) {
    isOpen.value = true;
  }
  if (props.searchable) {
    resetQueryFromSelection();
  }
  syncHighlightWithSelection();
}

function closeDropdown() {
  isOpen.value = false;
  highlightedIndex.value = -1;
  resetQueryFromSelection();
}

function clearSelection() {
  isClearingSelection.value = true;
  emit("update:modelValue", null);
  query.value = "";
  highlightedIndex.value = -1;
  closeDropdown();
}

/* c8 ignore start */
watch(
  () => props.modelValue,
  (value) => {
    if (value === null) {
      isClearingSelection.value = false;
      return;
    }
    /* c8 ignore next */
    if (isClearingSelection.value) {
      isClearingSelection.value = false;
    }
  }
);
/* c8 ignore stop */

function moveHighlight(step: 1 | -1) {
  const options = filteredOptions.value;
  if (options.length === 0) {
    highlightedIndex.value = -1;
    return;
  }
  const startIndex = highlightedIndex.value < 0
    ? (step === 1 ? -1 : options.length)
    : highlightedIndex.value;

  for (let cursor = startIndex + step; cursor >= 0 && cursor < options.length; cursor += step) {
    if (!options[cursor].disabled) {
      highlightedIndex.value = cursor;
      return;
    }
  }
}

function selectOption(option: ParsedOption) {
  if (option.disabled) {
    return;
  }
  emit("update:modelValue", option.value);
  query.value = option.label;
  closeDropdown();
}

function selectCustomValue() {
  const trimmedQuery = query.value.trim();
  emit("update:modelValue", trimmedQuery);
  query.value = trimmedQuery;
  closeDropdown();
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  query.value = target.value;
  if (!isOpen.value) {
    isOpen.value = true;
  }
  focusFirstEnabled();
}

function onFocus() {
  openDropdown();
}

function onClickInput() {
  if (!isOpen.value) {
    openDropdown();
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!isOpen.value) {
      openDropdown();
      return;
    }
    moveHighlight(1);
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (!isOpen.value) {
      openDropdown();
      return;
    }
    moveHighlight(-1);
    return;
  }

  if (event.key === "Enter") {
    if (!isOpen.value) {
      return;
    }
    event.preventDefault();
    const highlighted = filteredOptions.value[highlightedIndex.value];
    if (highlighted) {
      selectOption(highlighted);
      return;
    }
    if (canCreateCustomValue.value) {
      selectCustomValue();
    }
    return;
  }

  if (event.key === "Escape") {
    if (isOpen.value) {
      event.preventDefault();
      closeDropdown();
      nextTick(() => inputRef.value?.blur());
    }
    return;
  }

  if (event.key === "Tab") {
    closeDropdown();
  }
}

function onDocumentPointer(event: MouseEvent) {
  const target = event.target as Node;
  if (!rootRef.value?.contains(target)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("mousedown", onDocumentPointer);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocumentPointer);
});
</script>

<template>
  <div ref="rootRef" class="flex flex-col gap-2">
    <label v-if="label" :for="inputId" class="text-base font-medium text-slate-700 dark:text-slate-200">
      {{ label }}
    </label>
    <div class="relative">
      <span
        v-if="hasPrefix"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      >
        <slot name="prefix" />
      </span>
      <input
        ref="inputRef"
        :id="inputId"
        type="text"
        role="combobox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="listId"
        :aria-activedescendant="activeDescendant"
        :aria-autocomplete="searchable ? 'list' : undefined"
        :name="name"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :value="displayValue"
        :disabled="disabled"
        :readonly="!searchable"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="[
          'w-full rounded border px-3 py-2 text-base shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 dark:bg-slate-900 dark:disabled:bg-slate-800 dark:focus-visible:ring-offset-slate-900',
          inputStateClass,
          hasPrefix ? 'pl-9' : '',
          hasSuffix ? inputRightPaddingClass : ''
        ]"
        @focus="onFocus"
        @click="onClickInput"
        @input="onInput"
        @keydown="onKeydown"
      />
      <!-- c8 ignore start -->
      <span
        v-if="selectedRightText && !showClearButton"
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400"
      >
        {{ selectedRightText }}
      </span>
      <!-- c8 ignore start -->
      <span
        v-else-if="hasNativeSuffix && !selectedRightText"
        :class="[
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400',
          showClearButton ? 'right-8' : 'right-3'
        ]"
      >
        <slot name="suffix" />
      </span>
      <!-- c8 ignore stop -->
      <button
        v-if="showClearButton"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue focus-visible:ring-offset-1 dark:hover:text-slate-200"
        aria-label="Vider la selection"
        @mousedown.prevent
        @click="clearSelection"
      >
        ×
      </button>
      <span
        v-if="selectedRightText && showClearButton"
        class="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400"
      >
        {{ selectedRightText }}
      </span>
      <!-- c8 ignore start -->
      <ul
        v-if="isOpen"
        :id="listId"
        role="listbox"
        class="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-slate-300 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        <template v-if="renderItems.length > 0">
          <template
            v-for="(item, itemIndex) in renderItems"
            :key="item.type === 'group' ? `group-${item.label}-${itemIndex}` : item.option.id"
          >
            <li
              v-if="item.type === 'group'"
              class="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              role="presentation"
            >
              {{ item.label }}
            </li>
            <li
              v-else
              :id="item.option.id"
              role="option"
              :aria-selected="item.option.value === modelValue ? 'true' : 'false'"
              class="cursor-pointer px-3 py-2 text-sm text-slate-700 transition-colors dark:text-slate-200"
              :class="[
                item.filteredIndex === highlightedIndex
                  ? 'bg-c-blue-light/25 dark:bg-c-black-light'
                  : '',
                item.option.value === modelValue
                  ? 'font-medium text-c-blue-dark dark:text-c-black'
                  : '',
                item.option.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-c-blue-light/20 dark:hover:bg-c-black-light'
              ]"
              @mousedown.prevent="selectOption(item.option)"
            >
              <span class="flex items-center justify-between gap-3">
                <span class="truncate">{{ item.option.label }}</span>
                <span
                  v-if="item.option.rightText"
                  class="shrink-0 text-xs text-slate-500 dark:text-slate-400"
                >
                  {{ item.option.rightText }}
                </span>
              </span>
            </li>
          </template>
        </template>
        <template v-else>
          <li
            v-if="canCreateCustomValue"
            role="option"
            aria-selected="false"
            class="cursor-pointer px-3 py-2 text-sm text-c-blue-dark hover:bg-c-blue-light/20 dark:text-c-black dark:hover:bg-c-black-light"
            @mousedown.prevent="selectCustomValue"
          >
            Creer "{{ query.trim() }}"
          </li>
          <li
            v-else
            role="presentation"
            class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400"
          >
            Aucune option
          </li>
        </template>
      </ul>
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
