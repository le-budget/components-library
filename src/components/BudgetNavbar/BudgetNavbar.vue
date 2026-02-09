<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { nextId } from "../../utils/id";

type NavbarPosition = "relative" | "sticky" | "fixed";

const props = withDefaults(
  defineProps<{
    label?: string;
    position?: NavbarPosition;
    defaultOpen?: boolean;
    openLabel?: string;
    closeLabel?: string;
  }>(),
  {
    label: "Navigation principale",
    position: "relative",
    defaultOpen: false,
    openLabel: "Ouvrir la navigation",
    closeLabel: "Fermer la navigation"
  }
);

const slots = useSlots();
const isOpen = ref(props.defaultOpen);
const menuId = nextId("budget-navbar-menu");

const positionClass = computed(() => {
  if (props.position === "sticky") {
    return "sticky top-0 z-40";
  }
  if (props.position === "fixed") {
    return "fixed inset-x-0 top-0 z-40";
  }
  return "relative";
});

const toggleLabel = computed(() => (isOpen.value ? props.closeLabel : props.openLabel));
const hasBrandSlot = computed(() => Boolean(slots.brand));
const hasDefaultSlot = computed(() => Boolean(slots.default));
const hasNotificationsSlot = computed(() => Boolean(slots.notifications));
const hasUserMenuSlot = computed(() => Boolean(slots["user-menu"]));

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
}
</script>

<template>
  <nav
    :aria-label="label"
    :class="[
      'w-full border-b border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
      positionClass
    ]"
  >
    <div class="mx-auto flex w-full items-center justify-between gap-3 px-4 py-3">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue-dark focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-600 dark:text-slate-200 dark:focus-visible:ring-offset-slate-900 md:hidden"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="menuId"
        :aria-label="toggleLabel"
        @click="toggleMenu"
        @keydown.escape="closeMenu"
      >
        <span class="sr-only">{{ toggleLabel }}</span>
        <span v-if="!isOpen" aria-hidden="true" class="flex flex-col gap-1">
          <span class="h-0.5 w-4 rounded bg-current" />
          <span class="h-0.5 w-4 rounded bg-current" />
          <span class="h-0.5 w-4 rounded bg-current" />
        </span>
        <span v-else aria-hidden="true" class="relative h-4 w-4">
          <span
            class="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rotate-45 rounded bg-current"
          />
          <span
            class="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 -rotate-45 rounded bg-current"
          />
        </span>
      </button>

      <div v-if="hasBrandSlot" class="hidden min-w-0 md:block">
        <slot name="brand" />
      </div>

      <div v-if="hasDefaultSlot" class="hidden min-w-0 flex-1 items-center justify-center md:flex">
        <slot />
      </div>

      <div
        v-if="hasNotificationsSlot"
        class="hidden items-center gap-2 md:flex"
        aria-label="Notifications"
      >
        <slot name="notifications" />
      </div>

      <div
        v-if="hasUserMenuSlot"
        class="ml-auto flex items-center"
        aria-label="Menu utilisateur"
      >
        <slot name="user-menu" />
      </div>
    </div>

    <div
      v-show="isOpen"
      :id="menuId"
      class="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-700"
    >
      <div class="flex flex-col gap-3">
        <div v-if="hasBrandSlot" class="min-w-0">
          <slot name="brand" />
        </div>

        <div v-if="hasDefaultSlot" class="flex flex-col gap-2">
          <slot />
        </div>

        <div
          v-if="hasNotificationsSlot"
          class="flex items-center gap-2"
          aria-label="Notifications"
        >
          <slot name="notifications" />
        </div>
      </div>
    </div>
  </nav>
</template>
