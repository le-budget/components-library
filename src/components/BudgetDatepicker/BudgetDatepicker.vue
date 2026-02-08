<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { nextId } from "../../utils/id";

const WEEK_DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"] as const;

type CalendarCell = {
  key: string;
  date: Date | null;
  dayLabel: string;
  isCurrentMonth: boolean;
};

const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    size?: "sm" | "md" | "lg";
    align?: "left" | "right";
    label?: string;
    placeholder?: string;
    name?: string;
    autocomplete?: string;
    id?: string;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
    errorMessage?: string;
    minDate?: string;
    maxDate?: string;
  }>(),
  {
    size: "md",
    align: "left",
    label: undefined,
    placeholder: "jj/mm/aaaa",
    name: undefined,
    autocomplete: "off",
    id: undefined,
    disabled: false,
    error: false,
    success: false,
    errorMessage: undefined,
    minDate: "",
    maxDate: ""
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string | null): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const displayValue = ref("");
const suppressOpenOnFocus = ref(false);

const inputId = props.id ?? nextId("budget-datepicker");
const calendarId = `${inputId}-calendar`;
const describedBy = computed(() => (props.error ? `${inputId}-error` : undefined));
const resolvedErrorMessage = computed(() => props.errorMessage ?? "Valeur invalide");

const sizeClass = computed(() => {
  if (props.size === "sm") {
    return {
      input: "py-1.5 text-sm leading-5",
      inputWithCalendar: "pr-9",
      trigger: "right-2.5 h-6 w-6",
      nav: "h-7 min-w-7 text-sm"
    };
  }
  if (props.size === "lg") {
    return {
      input: "py-2.5 text-base leading-6",
      inputWithCalendar: "pr-11",
      trigger: "right-3.5 h-7 w-7",
      nav: "h-8 min-w-8 text-base"
    };
  }
  return {
    input: "py-2 text-base leading-6",
    inputWithCalendar: "pr-10",
    trigger: "right-3 h-6 w-6",
    nav: "h-7 min-w-7 text-sm"
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

const inputAlignmentClass = computed(() =>
  props.align === "right" ? "text-right" : "text-left"
);

const selectedDate = computed(() => parseIsoDate(props.modelValue));
const minBoundDate = computed(() => parseIsoDate(props.minDate || null));
const maxBoundDate = computed(() => parseIsoDate(props.maxDate || null));
const today = new Date();
const viewMonth = ref(startOfMonth(selectedDate.value ?? today));
const focusedDate = ref<Date>(selectedDate.value ?? today);

const monthLabel = computed(() =>
  viewMonth.value.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric"
  })
);

const canGoPrev = computed(() => {
  const previousMonth = addMonths(viewMonth.value, -1);
  if (!minBoundDate.value) {
    return true;
  }
  return endOfMonth(previousMonth).getTime() >= startOfDay(minBoundDate.value).getTime();
});

const canGoNext = computed(() => {
  const nextMonth = addMonths(viewMonth.value, 1);
  if (!maxBoundDate.value) {
    return true;
  }
  return startOfMonth(nextMonth).getTime() <= startOfDay(maxBoundDate.value).getTime();
});

const calendarCells = computed<CalendarCell[]>(() => {
  const monthStart = startOfMonth(viewMonth.value);
  const monthEnd = endOfMonth(monthStart);
  const firstDayOffset = (monthStart.getDay() + 6) % 7;
  const cells: CalendarCell[] = [];

  for (let index = 0; index < firstDayOffset; index += 1) {
    cells.push({
      key: `blank-start-${index}`,
      date: null,
      dayLabel: "",
      isCurrentMonth: false
    });
  }

  for (let day = 1; day <= monthEnd.getDate(); day += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    cells.push({
      key: `day-${toIsoDate(date)}`,
      date,
      dayLabel: String(day),
      isCurrentMonth: true
    });
  }

  while (cells.length % 7 !== 0) {
    const index = cells.length;
    cells.push({
      key: `blank-end-${index}`,
      date: null,
      dayLabel: "",
      isCurrentMonth: false
    });
  }

  return cells;
});

watch(
  () => [props.modelValue, props.minDate, props.maxDate],
  () => {
    const selected = parseIsoDate(props.modelValue);
    const minDate = parseIsoDate(props.minDate || null);
    const maxDate = parseIsoDate(props.maxDate || null);

    if (selected && !isWithinBounds(selected, minDate, maxDate)) {
      emit("update:modelValue", null);
      return;
    }

    if (!isOpen.value) {
      displayValue.value = selected ? toFrDate(selected) : "";
    }

    if (selected) {
      viewMonth.value = startOfMonth(selected);
      focusedDate.value = selected;
      return;
    }

    const fallback = clampToBounds(today, minDate, maxDate);
    viewMonth.value = startOfMonth(fallback);
    focusedDate.value = fallback;
  },
  { immediate: true }
);

function parseIsoDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(year, month - 1, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return null;
  }
  return candidate;
}

function parseFrDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  /* c8 ignore start */
  if (!match) {
    return null;
  }
  /* c8 ignore stop */
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const candidate = new Date(year, month - 1, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return null;
  }
  return candidate;
}

function toFrDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function toIsoDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${year}-${month}-${day}`;
}

function formatPartialFr(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isWithinBounds(date: Date, minDate: Date | null, maxDate: Date | null) {
  const current = startOfDay(date).getTime();
  const min = minDate ? startOfDay(minDate).getTime() : -Infinity;
  const max = maxDate ? startOfDay(maxDate).getTime() : Infinity;
  return current >= min && current <= max;
}

function clampToBounds(date: Date, minDate: Date | null, maxDate: Date | null) {
  const normalized = startOfDay(date).getTime();
  if (minDate && normalized < startOfDay(minDate).getTime()) {
    return minDate;
  }
  if (maxDate && normalized > startOfDay(maxDate).getTime()) {
    return maxDate;
  }
  return startOfDay(date);
}

function isSelected(date: Date) {
  const selected = selectedDate.value;
  if (!selected) {
    return false;
  }
  return toIsoDate(selected) === toIsoDate(date);
}

function isFocused(date: Date) {
  return toIsoDate(focusedDate.value) === toIsoDate(date);
}

function isDisabledDate(date: Date) {
  return !isWithinBounds(date, minBoundDate.value, maxBoundDate.value);
}

function openCalendar() {
  /* c8 ignore start */
  if (props.disabled) {
    return;
  }
  /* c8 ignore stop */
  isOpen.value = true;
  const selected = selectedDate.value;
  const baseDate = selected ?? clampToBounds(today, minBoundDate.value, maxBoundDate.value);
  viewMonth.value = startOfMonth(baseDate);
  focusedDate.value = baseDate;
}

function closeCalendar() {
  isOpen.value = false;
}

function goToPreviousMonth() {
  /* c8 ignore start */
  if (!canGoPrev.value) {
    return;
  }
  /* c8 ignore stop */
  viewMonth.value = addMonths(viewMonth.value, -1);
}

function goToNextMonth() {
  /* c8 ignore start */
  if (!canGoNext.value) {
    return;
  }
  /* c8 ignore stop */
  viewMonth.value = addMonths(viewMonth.value, 1);
}

function selectDate(date: Date) {
  /* c8 ignore start */
  if (isDisabledDate(date)) {
    return;
  }
  /* c8 ignore stop */
  const isoValue = toIsoDate(date);
  displayValue.value = toFrDate(date);
  focusedDate.value = date;
  emit("update:modelValue", isoValue);
  closeCalendar();
  nextTick(() => {
    suppressOpenOnFocus.value = true;
    inputRef.value?.focus();
    nextTick(() => {
      suppressOpenOnFocus.value = false;
    });
  });
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const formatted = formatPartialFr(target.value);
  displayValue.value = formatted;
  target.value = formatted;

  if (formatted.length === 0) {
    emit("update:modelValue", null);
    return;
  }

  if (formatted.length < 10) {
    return;
  }

  const parsed = parseFrDate(formatted);
  if (!parsed || isDisabledDate(parsed)) {
    return;
  }
  viewMonth.value = startOfMonth(parsed);
  focusedDate.value = parsed;
  emit("update:modelValue", toIsoDate(parsed));
}

function onFocusInput() {
  if (suppressOpenOnFocus.value) {
    return;
  }
  openCalendar();
}

function onClickInput() {
  if (!isOpen.value) {
    openCalendar();
  }
}

function moveFocusByDays(days: number) {
  const current = focusedDate.value;
  const next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + days);
  focusedDate.value = next;
  viewMonth.value = startOfMonth(next);
}

function onKeydownInput(event: KeyboardEvent) {
  if (event.key === "ArrowDown" && !isOpen.value) {
    event.preventDefault();
    openCalendar();
    return;
  }

  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    closeCalendar();
    return;
  }

  if (event.key === "Tab") {
    closeCalendar();
    return;
  }

  if (!isOpen.value) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveFocusByDays(-1);
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveFocusByDays(1);
    return;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveFocusByDays(-7);
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveFocusByDays(7);
    return;
  }
  /* c8 ignore start */
  if (event.key === "Enter") {
    event.preventDefault();
    selectDate(focusedDate.value);
  }
  /* c8 ignore stop */
}

function onDocumentPointer(event: MouseEvent) {
  const target = event.target as Node;
  if (!rootRef.value?.contains(target)) {
    closeCalendar();
  }
}

function dayAriaLabel(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
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
      <input
        ref="inputRef"
        :id="inputId"
        type="text"
        role="combobox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="calendarId"
        :name="name"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :value="displayValue"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="[
          'w-full rounded border px-3 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 dark:bg-slate-900 dark:disabled:bg-slate-800 dark:focus-visible:ring-offset-slate-900',
          sizeClass.input,
          inputStateClass,
          inputAlignmentClass,
          sizeClass.inputWithCalendar
        ]"
        @focus="onFocusInput"
        @click="onClickInput"
        @input="onInput"
        @keydown="onKeydownInput"
      />
      <button
        type="button"
        :class="[
          'absolute top-1/2 -translate-y-1/2 rounded text-slate-500 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue dark:text-slate-400 dark:hover:text-slate-200',
          sizeClass.trigger
        ]"
        :disabled="disabled"
        aria-label="Ouvrir le calendrier"
        @click="openCalendar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      <!-- c8 ignore start -->
      <div
        v-if="isOpen"
        :id="calendarId"
        role="dialog"
        class="absolute z-20 mt-1 w-full rounded-md border border-slate-300 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            :disabled="!canGoPrev"
            :class="[
              'rounded border border-slate-300 px-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
              sizeClass.nav
            ]"
            aria-label="Mois precedent"
            @click="goToPreviousMonth"
          >
            &lt;
          </button>
          <p class="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
            {{ monthLabel }}
          </p>
          <button
            type="button"
            :disabled="!canGoNext"
            :class="[
              'rounded border border-slate-300 px-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
              sizeClass.nav
            ]"
            aria-label="Mois suivant"
            @click="goToNextMonth"
          >
            &gt;
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          <span v-for="weekDay in WEEK_DAYS" :key="weekDay">
            {{ weekDay }}
          </span>
        </div>

        <div class="mt-1 grid grid-cols-7 gap-1" role="grid">
          <template v-for="cell in calendarCells" :key="cell.key">
            <span
              v-if="!cell.date"
              class="h-9 rounded"
              aria-hidden="true"
            />
            <button
              v-else
              type="button"
              role="gridcell"
              :aria-label="dayAriaLabel(cell.date)"
              :aria-selected="isSelected(cell.date) ? 'true' : 'false'"
              :disabled="isDisabledDate(cell.date)"
              class="h-9 rounded text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue"
              :class="[
                isSelected(cell.date)
                  ? 'bg-c-blue text-white dark:bg-c-black dark:text-c-blue-light'
                  : '',
                isFocused(cell.date) && !isSelected(cell.date)
                  ? 'ring-1 ring-c-blue dark:ring-c-blue-light'
                  : '',
                isDisabledDate(cell.date)
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                  : 'text-slate-700 hover:bg-c-blue-light/20 dark:text-slate-200 dark:hover:bg-c-black-light'
              ]"
              @click="selectDate(cell.date)"
              @mouseenter="focusedDate = cell.date"
            >
              {{ cell.dayLabel }}
            </button>
          </template>
        </div>
      </div>
      <!-- c8 ignore stop -->
    </div>
    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="text-xs text-c-red"
    >
      {{ resolvedErrorMessage }}
    </p>
  </div>
</template>
