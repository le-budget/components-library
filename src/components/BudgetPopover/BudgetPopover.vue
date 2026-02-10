<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import BudgetIcon from "../BudgetIcon/BudgetIcon.vue";
import { type StatusIconName } from "../../icons";
import { nextId } from "../../utils/id";
import type { StatusColorName } from "../../utils/statusColors";

type PopoverColor = "neutral" | "primary" | "success" | "warning" | "error";
type PopoverPlacement = "top" | "bottom" | "left" | "right";

type PopoverPosition = {
  top: string;
  left: string;
};

const props = withDefaults(
  defineProps<{
    title?: string;
    icon?: StatusIconName;
    color?: PopoverColor;
    placement?: PopoverPlacement;
    offset?: number;
    maxWidthClass?: string;
  }>(),
  {
    title: "",
    icon: undefined,
    color: "neutral",
    placement: "top",
    offset: 8,
    maxWidthClass: "max-w-xs"
  }
);

const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const computedPlacement = ref<PopoverPlacement>(props.placement);
const popoverPosition = ref<PopoverPosition>({ top: "0px", left: "0px" });
const isTriggerHovered = ref(false);
const isPopoverHovered = ref(false);
const isFocusWithin = ref(false);
const openTimeout = ref<number | null>(null);
const closeTimeout = ref<number | null>(null);
const openDelay = 80;
const closeDelay = 100;
const popoverId = nextId("budget-popover");

const managedTriggerElement = ref<HTMLElement | null>(null);
const managedTriggerInitialDescribedBy = ref<string | null>(null);

const placementOrderMap: Record<PopoverPlacement, PopoverPlacement[]> = {
  top: ["top", "bottom", "right", "left"],
  bottom: ["bottom", "top", "right", "left"],
  left: ["left", "right", "top", "bottom"],
  right: ["right", "left", "top", "bottom"]
};

const colorBorderClass = computed(() => {
  switch (props.color) {
    case "primary":
      return "border-l-c-blue-dark dark:border-l-c-black";
    case "success":
      return "border-l-c-green-dark dark:border-l-c-black-success";
    case "warning":
      return "border-l-c-orange-dark dark:border-l-c-black-warning";
    case "error":
      return "border-l-c-red-dark dark:border-l-c-black-error";
    case "neutral":
    default:
      return "border-l-slate-500 dark:border-l-slate-500";
  }
});

const titleColorClass = computed(() => {
  switch (props.color) {
    case "primary":
      return "text-c-blue-dark dark:text-c-black";
    case "success":
      return "text-c-green-dark dark:text-c-black-success";
    case "warning":
      return "text-c-orange-dark dark:text-c-black-warning";
    case "error":
      return "text-c-red-dark dark:text-c-black-error";
    case "neutral":
    default:
      return "text-slate-800 dark:text-slate-200";
  }
});

const iconColor = computed<StatusColorName>(() => props.color);

const hasHeader = computed(() => Boolean(props.title) || Boolean(props.icon));

function clearOpenTimeout() {
  if (openTimeout.value !== null) {
    window.clearTimeout(openTimeout.value);
    openTimeout.value = null;
  }
}

function clearCloseTimeout() {
  if (closeTimeout.value !== null) {
    window.clearTimeout(closeTimeout.value);
    closeTimeout.value = null;
  }
}

function removeManagedDescription() {
  const element = managedTriggerElement.value;
  if (!element) {
    return;
  }

  const initial = managedTriggerInitialDescribedBy.value;
  if (initial === null || initial.trim().length === 0) {
    element.removeAttribute("aria-describedby");
  } else {
    element.setAttribute("aria-describedby", initial);
  }

  managedTriggerElement.value = null;
  managedTriggerInitialDescribedBy.value = null;
}

function resolveAnchorElement() {
  /* c8 ignore start */
  if (!triggerRef.value) {
    return null;
  }
  /* c8 ignore stop */

  const focusableSelector = [
    "button:not([disabled])",
    "a[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return (
    triggerRef.value.querySelector<HTMLElement>(focusableSelector) ??
    triggerRef.value
  );
}

function applyManagedDescription() {
  const target = resolveAnchorElement();
  /* c8 ignore start */
  if (!target) {
    return;
  }
  /* c8 ignore stop */

  if (managedTriggerElement.value && managedTriggerElement.value !== target) {
    removeManagedDescription();
  }

  if (!managedTriggerElement.value) {
    managedTriggerElement.value = target;
    managedTriggerInitialDescribedBy.value = target.getAttribute("aria-describedby");
  }

  const current = target.getAttribute("aria-describedby");
  if (!current || current.trim().length === 0) {
    target.setAttribute("aria-describedby", popoverId);
    return;
  }

  const ids = current.split(/\s+/).filter(Boolean);
  if (!ids.includes(popoverId)) {
    ids.push(popoverId);
    target.setAttribute("aria-describedby", ids.join(" "));
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAvailableSpaces(triggerRect: DOMRect, viewportPadding: number) {
  /* c8 ignore start */
  return {
    top: triggerRect.top - viewportPadding,
    bottom: window.innerHeight - triggerRect.bottom - viewportPadding,
    left: triggerRect.left - viewportPadding,
    right: window.innerWidth - triggerRect.right - viewportPadding
  };
  /* c8 ignore stop */
}

function canFit(placement: PopoverPlacement, spaces: ReturnType<typeof getAvailableSpaces>, rect: DOMRect) {
  const requiredSize = (placement === "top" || placement === "bottom")
    ? rect.height + props.offset
    : rect.width + props.offset;

  return spaces[placement] >= requiredSize;
}

function pickPlacement(spaces: ReturnType<typeof getAvailableSpaces>, rect: DOMRect) {
  const orderedPlacements = placementOrderMap[props.placement];
  const firstFitting = orderedPlacements.find((placement) =>
    canFit(placement, spaces, rect)
  );

  if (firstFitting) {
    return firstFitting;
  }

  return orderedPlacements.reduce((best, candidate) =>
    spaces[candidate] > spaces[best] ? candidate : best
  );
}

function setPopoverPosition() {
  if (!popoverRef.value) {
    return;
  }

  const viewportPadding = 8;
  const anchorElement = resolveAnchorElement();
  /* c8 ignore start */
  if (!anchorElement) {
    return;
  }
  /* c8 ignore stop */

  const triggerRect = anchorElement.getBoundingClientRect();
  const popoverRect = popoverRef.value.getBoundingClientRect();
  const spaces = getAvailableSpaces(triggerRect, viewportPadding);
  const nextPlacement = pickPlacement(spaces, popoverRect);

  computedPlacement.value = nextPlacement;

  let nextTop = 0;
  let nextLeft = 0;

  if (nextPlacement === "top") {
    nextTop = triggerRect.top - popoverRect.height - props.offset;
    nextLeft = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
  } else if (nextPlacement === "bottom") {
    nextTop = triggerRect.bottom + props.offset;
    nextLeft = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
  } else if (nextPlacement === "left") {
    nextTop = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2);
    nextLeft = triggerRect.left - popoverRect.width - props.offset;
  } else {
    nextTop = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2);
    nextLeft = triggerRect.right + props.offset;
  }

  const maxTop = Math.max(viewportPadding, window.innerHeight - popoverRect.height - viewportPadding);
  const maxLeft = Math.max(viewportPadding, window.innerWidth - popoverRect.width - viewportPadding);

  popoverPosition.value = {
    top: `${clamp(nextTop, viewportPadding, maxTop)}px`,
    left: `${clamp(nextLeft, viewportPadding, maxLeft)}px`
  };
}

async function openPopover() {
  if (isOpen.value) {
    setPopoverPosition();
    return;
  }

  isOpen.value = true;
  await nextTick();
  applyManagedDescription();
  setPopoverPosition();
}

function closePopover() {
  if (!isOpen.value) {
    return;
  }

  isOpen.value = false;
  removeManagedDescription();
}

function shouldKeepOpen() {
  return isTriggerHovered.value || isPopoverHovered.value || isFocusWithin.value;
}

function scheduleOpen() {
  clearCloseTimeout();
  clearOpenTimeout();
  openTimeout.value = window.setTimeout(() => {
    openPopover();
  }, openDelay);
}

function scheduleClose() {
  clearOpenTimeout();
  clearCloseTimeout();
  closeTimeout.value = window.setTimeout(() => {
    if (!shouldKeepOpen()) {
      closePopover();
    }
  }, closeDelay);
}

function onTriggerMouseEnter() {
  isTriggerHovered.value = true;
  scheduleOpen();
}

function onTriggerMouseLeave() {
  isTriggerHovered.value = false;
  scheduleClose();
}

function onPopoverMouseEnter() {
  isPopoverHovered.value = true;
  clearCloseTimeout();
}

function onPopoverMouseLeave() {
  isPopoverHovered.value = false;
  scheduleClose();
}

function onTriggerFocusIn() {
  isFocusWithin.value = true;
  scheduleOpen();
}

function onTriggerFocusOut(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as Node | null;
  const stillWithinTrigger = !!relatedTarget && !!triggerRef.value?.contains(relatedTarget);
  const movedToPopover = !!relatedTarget && !!popoverRef.value?.contains(relatedTarget);

  if (stillWithinTrigger || movedToPopover) {
    return;
  }

  isFocusWithin.value = false;
  scheduleClose();
}

function onPopoverFocusIn() {
  isFocusWithin.value = true;
  clearCloseTimeout();
}

function onPopoverFocusOut(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as Node | null;
  const movedToTrigger = !!relatedTarget && !!triggerRef.value?.contains(relatedTarget);
  const stillWithinPopover = !!relatedTarget && !!popoverRef.value?.contains(relatedTarget);

  if (movedToTrigger || stillWithinPopover) {
    return;
  }

  isFocusWithin.value = false;
  scheduleClose();
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (!isOpen.value || event.key !== "Escape") {
    return;
  }

  event.preventDefault();
  closePopover();
}

function onWindowChanged() {
  if (isOpen.value) {
    setPopoverPosition();
  }
}

watch(
  () => props.placement,
  (nextPlacement) => {
    computedPlacement.value = nextPlacement;
    if (isOpen.value) {
      setPopoverPosition();
    }
  }
);

watch(isOpen, (open) => {
  if (open) {
    window.addEventListener("resize", onWindowChanged);
    window.addEventListener("scroll", onWindowChanged, true);
    document.addEventListener("keydown", onDocumentKeydown);
    return;
  }

  window.removeEventListener("resize", onWindowChanged);
  window.removeEventListener("scroll", onWindowChanged, true);
  document.removeEventListener("keydown", onDocumentKeydown);
});

onBeforeUnmount(() => {
  clearOpenTimeout();
  clearCloseTimeout();
  removeManagedDescription();
  window.removeEventListener("resize", onWindowChanged);
  window.removeEventListener("scroll", onWindowChanged, true);
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>

<template>
  <span
    ref="triggerRef"
    data-popover-trigger
    class="inline-flex"
    @mouseenter="onTriggerMouseEnter"
    @mouseleave="onTriggerMouseLeave"
    @focusin="onTriggerFocusIn"
    @focusout="onTriggerFocusOut"
  >
    <slot name="trigger" />
  </span>

  <Teleport to="body">
    <!-- c8 ignore start -->
    <Transition name="budget-popover-fade">
      <section
        v-if="isOpen"
        :id="popoverId"
        ref="popoverRef"
        data-popover-content
        role="tooltip"
        :data-placement="computedPlacement"
        :style="{ position: 'fixed', top: popoverPosition.top, left: popoverPosition.left }"
        :class="[
          'z-50 w-max rounded-md border border-l-4 border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900',
          colorBorderClass,
          maxWidthClass
        ]"
        @mouseenter="onPopoverMouseEnter"
        @mouseleave="onPopoverMouseLeave"
        @focusin="onPopoverFocusIn"
        @focusout="onPopoverFocusOut"
      >
        <header
          v-if="hasHeader"
          class="mb-1 flex items-center gap-2"
        >
          <slot name="icon">
            <BudgetIcon
              v-if="icon"
              :status="icon"
              :color="iconColor"
              decorative
              size="sm"
            />
          </slot>
          <p
            v-if="title"
            :class="['text-sm font-semibold', titleColorClass]"
          >
            {{ title }}
          </p>
        </header>
        <div class="text-sm text-slate-700 dark:text-slate-200">
          <slot />
        </div>
      </section>
    </Transition>
    <!-- c8 ignore stop -->
  </Teleport>
</template>

<style scoped>
.budget-popover-fade-enter-active,
.budget-popover-fade-leave-active {
  transition: opacity 0.12s ease;
}

.budget-popover-fade-enter-from,
.budget-popover-fade-leave-to {
  opacity: 0;
}
</style>
