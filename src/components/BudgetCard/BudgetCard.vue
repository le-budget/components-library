<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { chevronDownIcon, chevronUpIcon } from "../../icons";
import { nextId } from "../../utils/id";

const props = withDefaults(
  defineProps<{
    title?: string;
    collapsible?: boolean;
    collapsed?: boolean;
  }>(),
  {
    title: undefined,
    collapsible: false,
    collapsed: undefined
  }
);

const emit = defineEmits<{
  (event: "update:collapsed", value: boolean): void;
}>();

const slots = useSlots();
const contentId = nextId("budget-card");
const internalCollapsed = ref(false);
const isControlled = computed(() => props.collapsed !== undefined);
const isCollapsed = computed(() => {
  if (isControlled.value) {
    return props.collapsed as boolean;
  }
  return internalCollapsed.value;
});
const hasIconSlot = computed(() => Boolean(slots.icon));
const showHeader = computed(
  () => Boolean(props.title) || hasIconSlot.value || props.collapsible
);

const chevronIcon = computed(() =>
  isCollapsed.value ? chevronDownIcon : chevronUpIcon
);

function toggleCollapse() {
  const nextValue = !isCollapsed.value;
  if (!isControlled.value) {
    internalCollapsed.value = nextValue;
  }
  emit("update:collapsed", nextValue);
}

watch(
  () => props.collapsed,
  (value) => {
    if (value === undefined) return;
    internalCollapsed.value = value;
  },
  { immediate: true }
);
</script>

<template>
  <section
    class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <div
      v-show="showHeader"
      :class="['flex items-center justify-between gap-4', isCollapsed ? '' : 'mb-4']"
    >
      <div class="flex items-center gap-3">
        <span v-if="hasIconSlot" class="inline-flex items-center">
          <slot name="icon" />
        </span>
        <h3 v-if="props.title" class="text-base font-semibold">
          {{ props.title }}
        </h3>
      </div>
      <button
        v-if="props.collapsible"
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue dark:hover:bg-slate-800 dark:hover:text-slate-200"
        :aria-expanded="isCollapsed ? 'false' : 'true'"
        :aria-controls="contentId"
        @click="toggleCollapse"
      >
        <FontAwesomeIcon :icon="chevronIcon" />
        <span class="sr-only">
          {{ isCollapsed ? "Deplier" : "Replier" }}
        </span>
      </button>
    </div>
    <transition name="budget-card-collapse">
      <div v-show="!isCollapsed" :id="contentId" data-testid="card-content">
        <slot />
      </div>
    </transition>
  </section>
</template>

<style scoped>
.budget-card-collapse-enter-active,
.budget-card-collapse-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.budget-card-collapse-enter-from,
.budget-card-collapse-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
