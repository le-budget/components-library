<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onBeforeUnmount, ref } from "vue";
import BudgetCategoryGroup from "../BudgetCategoryGroup/BudgetCategoryGroup.vue";
import BudgetCategoryItem from "../BudgetCategoryItem/BudgetCategoryItem.vue";
import { dragHandleIcon } from "../../icons";
import type {
  BudgetCategoryContainerCheckboxColor,
  BudgetCategoryContainerGroup,
  BudgetCategoryContainerItem,
  BudgetCategoryContainerOrderItem,
  BudgetCategoryContainerOrderEntry,
  BudgetCategoryContainerSize
} from "./budgetCategoryContainer.types";

defineOptions({
  name: "BudgetCategoryContainer"
});

type DragState =
  | {
      type: "group";
      groupId: string;
      group: BudgetCategoryContainerGroup;
      x: number;
      y: number;
    }
  | {
      type: "item";
      groupId: string;
      itemId: string;
      item: BudgetCategoryContainerItem;
      x: number;
      y: number;
    }
  | null;

type GroupPreviewPlacement = {
  type: "group";
  targetIndex: number;
};

type ItemPreviewPlacement = {
  type: "item";
  groupId: string;
  targetIndex: number;
};

const props = withDefaults(
  defineProps<{
    groups: BudgetCategoryContainerGroup[];
    size?: BudgetCategoryContainerSize;
    disabled?: boolean;
    hasCheckbox?: boolean;
    groupCheckboxColor?: BudgetCategoryContainerCheckboxColor;
    itemCheckboxColor?: BudgetCategoryContainerCheckboxColor;
    showGroupDropIndicators?: boolean;
    showItemDropIndicators?: boolean;
  }>(),
  {
    size: "lg",
    disabled: false,
    hasCheckbox: true,
    groupCheckboxColor: "neutral",
    itemCheckboxColor: "neutral",
    showGroupDropIndicators: true,
    showItemDropIndicators: true
  }
);

const emit = defineEmits<{
  (event: "reorder", value: BudgetCategoryContainerOrderEntry[]): void;
  (event: "update:groups", value: BudgetCategoryContainerGroup[]): void;
  (event: "update:collapsed", value: { groupId: string; collapsed: boolean }): void;
  (event: "update:groupSelected", value: { groupId: string; value: boolean }): void;
  (event: "update:itemSelected", value: { groupId: string; itemId: string; value: boolean }): void;
}>();

const dragState = ref<DragState>(null);
const activeGroupDropIndex = ref<number | null>(null);
const activeItemDropTarget = ref<{ groupId: string; index: number } | null>(null);

const isDraggingGroup = computed(() => dragState.value?.type === "group");
const isDraggingItem = computed(() => dragState.value?.type === "item");
const dragGhostStyle = computed(() => {
  if (!dragState.value) {
    return undefined;
  }

  return {
    left: `${dragState.value.x}px`,
    top: `${dragState.value.y}px`,
    transform: "translate(14px, 14px)"
  };
});
const groupPreviewPlacement = computed<GroupPreviewPlacement | null>(() => {
  if (!isDraggingGroup.value || activeGroupDropIndex.value === null) {
    return null;
  }

  return {
    type: "group",
    targetIndex: activeGroupDropIndex.value
  };
});
const itemPreviewPlacement = computed<ItemPreviewPlacement | null>(() => {
  if (!isDraggingItem.value || !activeItemDropTarget.value) {
    return null;
  }

  return {
    type: "item",
    groupId: activeItemDropTarget.value.groupId,
    targetIndex: activeItemDropTarget.value.index
  };
});
const dragGhostCardClass = computed(() =>
  dragState.value?.type === "group"
    ? "rotate-[-0.7deg] scale-[0.995]"
    : "rotate-[-1.15deg] scale-[0.99]"
);

let dragImageElement: HTMLDivElement | null = null;

function ensureDragImageElement() {
  if (typeof document === "undefined") {
    return null;
  }

  if (!dragImageElement) {
    dragImageElement = document.createElement("div");
    dragImageElement.setAttribute("aria-hidden", "true");
    dragImageElement.style.position = "fixed";
    dragImageElement.style.top = "-9999px";
    dragImageElement.style.left = "-9999px";
    dragImageElement.style.width = "1px";
    dragImageElement.style.height = "1px";
    dragImageElement.style.opacity = "0";
    dragImageElement.style.pointerEvents = "none";
    document.body.appendChild(dragImageElement);
  }

  return dragImageElement;
}

onBeforeUnmount(() => {
  dragImageElement?.remove();
  dragImageElement = null;
});

function clearDragState() {
  dragState.value = null;
  activeGroupDropIndex.value = null;
  activeItemDropTarget.value = null;
}

function cloneGroups(groups: BudgetCategoryContainerGroup[]) {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item }))
  }));
}

function buildOrderTree(groups: BudgetCategoryContainerGroup[]): BudgetCategoryContainerOrderEntry[] {
  return groups.map((group, groupOrder) => {
    const items: BudgetCategoryContainerOrderItem[] = group.items.map((item, itemOrder) => ({
      id: item.id,
      order: itemOrder
    }));

    return {
      id: group.id,
      order: groupOrder,
      items
    };
  });
}

function reorderGroups(
  groups: BudgetCategoryContainerGroup[],
  movedGroupId: string,
  targetIndex: number
) {
  const nextGroups = cloneGroups(groups);
  const fromIndex = nextGroups.findIndex((group) => group.id === movedGroupId);
  if (fromIndex === -1) {
    return null;
  }

  const [movedGroup] = nextGroups.splice(fromIndex, 1);
  const adjustedIndex = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;

  if (adjustedIndex === fromIndex) {
    return null;
  }

  nextGroups.splice(adjustedIndex, 0, movedGroup);
  return nextGroups;
}

function moveItemBetweenGroups(
  groups: BudgetCategoryContainerGroup[],
  sourceGroupId: string,
  itemId: string,
  targetGroupId: string,
  targetIndex: number
) {
  const nextGroups = cloneGroups(groups);
  const sourceGroup = nextGroups.find((group) => group.id === sourceGroupId);
  const targetGroup = nextGroups.find((group) => group.id === targetGroupId);

  if (!sourceGroup || !targetGroup) {
    return null;
  }

  const sourceIndex = sourceGroup.items.findIndex((item) => item.id === itemId);
  if (sourceIndex === -1) {
    return null;
  }

  const [movedItem] = sourceGroup.items.splice(sourceIndex, 1);
  const adjustedIndex =
    sourceGroupId === targetGroupId && sourceIndex < targetIndex
      ? targetIndex - 1
      : targetIndex;

  if (sourceGroupId === targetGroupId && adjustedIndex === sourceIndex) {
    return null;
  }

  targetGroup.items.splice(adjustedIndex, 0, movedItem);
  return nextGroups;
}

function isGroupDragDisabled(group: BudgetCategoryContainerGroup) {
  return props.disabled || group.disabled;
}

function isItemDragDisabled(
  group: BudgetCategoryContainerGroup,
  item: BudgetCategoryContainerItem
) {
  return props.disabled || group.disabled || item.disabled;
}

function allowsDropInGroup(group: BudgetCategoryContainerGroup) {
  return !props.disabled && !group.disabled;
}

function updateDragPointer(event: DragEvent) {
  if (!dragState.value) {
    return;
  }

  dragState.value = {
    ...dragState.value,
    x: event.clientX,
    y: event.clientY
  };
}

function onGroupDragStart(event: DragEvent, group: BudgetCategoryContainerGroup) {
  if (isGroupDragDisabled(group)) {
    event.preventDefault();
    return;
  }

  dragState.value = {
    type: "group",
    groupId: group.id,
    group,
    x: event.clientX,
    y: event.clientY
  };
  activeGroupDropIndex.value = null;
  activeItemDropTarget.value = null;

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", group.id);
    const dragImage = ensureDragImageElement();
    if (dragImage) {
      event.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  }
}

function onItemDragStart(
  event: DragEvent,
  group: BudgetCategoryContainerGroup,
  item: BudgetCategoryContainerItem
) {
  if (isItemDragDisabled(group, item)) {
    event.preventDefault();
    return;
  }

  dragState.value = {
    type: "item",
    groupId: group.id,
    itemId: item.id,
    item,
    x: event.clientX,
    y: event.clientY
  };
  activeGroupDropIndex.value = null;
  activeItemDropTarget.value = null;

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.id);
    const dragImage = ensureDragImageElement();
    if (dragImage) {
      event.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  }
}

function onGroupZoneDragOver(event: DragEvent, targetIndex: number) {
  if (!isDraggingGroup.value) {
    return;
  }

  event.preventDefault();
  updateDragPointer(event);
  activeGroupDropIndex.value = targetIndex;
  activeItemDropTarget.value = null;

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function resolveDropIndexFromPointer(event: DragEvent, currentIndex: number) {
  const currentTarget = event.currentTarget;
  if (!(currentTarget instanceof HTMLElement)) {
    return currentIndex;
  }

  const bounds = currentTarget.getBoundingClientRect();
  const midpoint = bounds.top + bounds.height / 2;
  return event.clientY < midpoint ? currentIndex : currentIndex + 1;
}

function onGroupSurfaceDragOver(
  event: DragEvent,
  group: BudgetCategoryContainerGroup,
  groupIndex: number
) {
  if (isDraggingGroup.value) {
    onGroupZoneDragOver(event, resolveDropIndexFromPointer(event, groupIndex));
    return;
  }

  if (isDraggingItem.value && allowsDropInGroup(group) && group.items.length === 0) {
    updateDragPointer(event);
    onItemZoneDragOver(event, group, 0);
  }
}

function onItemZoneDragOver(
  event: DragEvent,
  group: BudgetCategoryContainerGroup,
  targetIndex: number
) {
  if (!isDraggingItem.value || !allowsDropInGroup(group)) {
    return;
  }

  event.preventDefault();
  updateDragPointer(event);
  activeItemDropTarget.value = { groupId: group.id, index: targetIndex };
  activeGroupDropIndex.value = null;

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function onItemSurfaceDragOver(
  event: DragEvent,
  group: BudgetCategoryContainerGroup,
  itemIndex: number
) {
  if (!isDraggingItem.value || !allowsDropInGroup(group)) {
    return;
  }

  onItemZoneDragOver(event, group, resolveDropIndexFromPointer(event, itemIndex));
}

function onGroupDrop(event: DragEvent, targetIndex: number) {
  if (!dragState.value || dragState.value.type !== "group") {
    return;
  }

  event.preventDefault();

  const nextGroups = reorderGroups(props.groups, dragState.value.groupId, targetIndex);
  clearDragState();

  if (!nextGroups) {
    return;
  }

  emit("update:groups", nextGroups);
  emit("reorder", buildOrderTree(nextGroups));
}

function onGroupSurfaceDrop(
  event: DragEvent,
  group: BudgetCategoryContainerGroup,
  groupIndex: number
) {
  if (dragState.value?.type === "group") {
    onGroupDrop(event, resolveDropIndexFromPointer(event, groupIndex));
    return;
  }

  if (dragState.value?.type === "item" && allowsDropInGroup(group) && group.items.length === 0) {
    onItemDrop(event, group, 0);
  }
}

function onItemDrop(
  event: DragEvent,
  targetGroup: BudgetCategoryContainerGroup,
  targetIndex: number
) {
  if (!dragState.value || dragState.value.type !== "item" || !allowsDropInGroup(targetGroup)) {
    return;
  }

  event.preventDefault();

  const nextGroups = moveItemBetweenGroups(
    props.groups,
    dragState.value.groupId,
    dragState.value.itemId,
    targetGroup.id,
    targetIndex
  );
  clearDragState();

  if (!nextGroups) {
    return;
  }

  emit("update:groups", nextGroups);
  emit("reorder", buildOrderTree(nextGroups));
}

function onItemSurfaceDrop(
  event: DragEvent,
  group: BudgetCategoryContainerGroup,
  itemIndex: number
) {
  if (!dragState.value || dragState.value.type !== "item" || !allowsDropInGroup(group)) {
    return;
  }

  onItemDrop(event, group, resolveDropIndexFromPointer(event, itemIndex));
}

function isActiveGroupDropZone(index: number) {
  return activeGroupDropIndex.value === index;
}

function isActiveItemDropZone(groupId: string, index: number) {
  return (
    activeItemDropTarget.value?.groupId === groupId &&
    activeItemDropTarget.value.index === index
  );
}

function isGroupPreviewTarget(index: number) {
  return groupPreviewPlacement.value?.targetIndex === index;
}

function isItemPreviewTarget(groupId: string, index: number) {
  return (
    itemPreviewPlacement.value?.groupId === groupId &&
    itemPreviewPlacement.value.targetIndex === index
  );
}

function resolveGroupCheckbox(group: BudgetCategoryContainerGroup) {
  return group.hasCheckbox ?? props.hasCheckbox;
}

function resolveItemCheckbox(item: BudgetCategoryContainerItem) {
  return item.hasCheckbox ?? props.hasCheckbox;
}

function onGroupSelection(groupId: string, value: boolean) {
  emit("update:groupSelected", { groupId, value });
}

function onItemSelection(groupId: string, itemId: string, value: boolean) {
  emit("update:itemSelected", { groupId, itemId, value });
}

function onCollapsed(groupId: string, collapsed: boolean) {
  emit("update:collapsed", { groupId, collapsed });
}

function resolveHandleClass(size: BudgetCategoryContainerSize) {
  if (size === "sm") {
    return "h-5 w-5 text-[10px]";
  }

  if (size === "md") {
    return "h-6 w-6 text-xs";
  }

  return "h-7 w-7 text-sm";
}

function onDrag(event: DragEvent) {
  updateDragPointer(event);
}
</script>

<template>
  <div class="flex flex-col" data-testid="budget-category-container">
    <template v-for="(group, groupIndex) in groups" :key="group.id">
      <div
        class="relative transition-[margin,opacity]"
        :class="[
          isDraggingGroup
            ? isGroupPreviewTarget(groupIndex)
              ? 'my-2 pointer-events-auto opacity-100'
              : showGroupDropIndicators
                ? 'my-1 pointer-events-auto opacity-100'
                : 'my-0 pointer-events-auto opacity-100'
            : 'my-0 pointer-events-none opacity-0'
        ]"
        :data-testid="`budget-category-container-group-drop-${groupIndex}`"
        @dragenter.prevent="onGroupZoneDragOver($event, groupIndex)"
        @dragover.prevent="onGroupZoneDragOver($event, groupIndex)"
        @drop.prevent="onGroupDrop($event, groupIndex)"
      >
        <div
          class="pointer-events-none h-px bg-transparent transition-colors"
          :class="[
            isDraggingGroup && isActiveGroupDropZone(groupIndex) && showGroupDropIndicators
              ? 'bg-c-blue/25'
              : 'bg-transparent'
          ]"
        />

        <div
          v-if="dragState?.type === 'group' && isGroupPreviewTarget(groupIndex)"
          class="pointer-events-none py-2"
          data-testid="budget-category-container-preview"
        >
          <div
            class="overflow-hidden rounded-2xl border border-[#d9d0c2] bg-white/40 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.34)] backdrop-blur-[1px]"
            data-testid="budget-category-container-preview-group"
          >
            <BudgetCategoryGroup
              :model-value="false"
              :title="dragState.group.title"
              :assigned="dragState.group.assigned"
              :activity="dragState.group.activity"
              :available="dragState.group.available"
              :size="size"
              :collapsed="dragState.group.collapsed ?? false"
              :indeterminate="false"
              :disabled="true"
              :has-checkbox="false"
              :has-drag-handle="false"
              checkbox-color="neutral"
            >
              <template v-for="item in dragState.group.items" :key="item.id">
                <BudgetCategoryItem
                  :model-value="false"
                  :label="item.label"
                  :assigned="item.assigned"
                  :activity="item.activity"
                  :available="item.available"
                  :progress="item.progress"
                  :progress-label="item.progressLabel"
                  :tone="item.tone ?? 'neutral'"
                  :size="size"
                  :disabled="true"
                  :has-checkbox="false"
                  :has-drag-handle="false"
                  checkbox-color="neutral"
                >
                  <template v-if="item.prefixText" #prefix>
                    <span class="font-semibold text-slate-500">
                      {{ item.prefixText }}
                    </span>
                  </template>
                </BudgetCategoryItem>
              </template>
            </BudgetCategoryGroup>
          </div>
        </div>
      </div>

      <div
        :data-testid="`budget-category-container-group-${group.id}`"
        @dragenter="onGroupSurfaceDragOver($event, group, groupIndex)"
        @dragover="onGroupSurfaceDragOver($event, group, groupIndex)"
        @drop="onGroupSurfaceDrop($event, group, groupIndex)"
      >
        <BudgetCategoryGroup
          :model-value="group.selected ?? false"
          :title="group.title"
          :assigned="group.assigned"
          :activity="group.activity"
          :available="group.available"
          :size="size"
          :collapsed="group.collapsed"
          :indeterminate="group.indeterminate ?? false"
          :disabled="group.disabled ?? disabled"
          :has-checkbox="resolveGroupCheckbox(group)"
          :has-drag-handle="true"
          :checkbox-color="groupCheckboxColor"
          @update:model-value="onGroupSelection(group.id, $event)"
          @update:collapsed="onCollapsed(group.id, $event)"
        >
          <template #dragHandle>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md text-[#776f61] transition hover:bg-black/5 hover:text-[#5d564d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:cursor-not-allowed disabled:opacity-45"
              :class="[
                resolveHandleClass(size),
                isGroupDragDisabled(group) ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
              ]"
              :disabled="isGroupDragDisabled(group)"
              draggable="true"
              :data-testid="`budget-category-container-group-handle-${group.id}`"
              @dragstart="onGroupDragStart($event, group)"
              @drag="onDrag"
              @dragend="clearDragState"
            >
              <FontAwesomeIcon :icon="dragHandleIcon" />
            </button>
          </template>

          <template #default>
            <template v-for="(item, itemIndex) in group.items" :key="item.id">
              <div
                class="relative mx-3 transition-[margin,opacity]"
                :class="[
                  isDraggingItem && allowsDropInGroup(group)
                    ? isItemPreviewTarget(group.id, itemIndex)
                      ? 'my-2 pointer-events-auto opacity-100'
                      : showItemDropIndicators
                        ? 'my-1 pointer-events-auto opacity-100'
                        : 'my-0 pointer-events-auto opacity-100'
                    : 'my-0 pointer-events-none opacity-0'
                ]"
                :data-testid="`budget-category-container-item-drop-${group.id}-${itemIndex}`"
                @dragenter.prevent="onItemZoneDragOver($event, group, itemIndex)"
                @dragover.prevent="onItemZoneDragOver($event, group, itemIndex)"
                @drop.prevent="onItemDrop($event, group, itemIndex)"
              >
                <div
                  class="pointer-events-none h-px bg-transparent transition-colors"
                  :class="[
                    isDraggingItem && isActiveItemDropZone(group.id, itemIndex) && showItemDropIndicators
                      ? 'bg-c-blue/25'
                      : 'bg-transparent'
                  ]"
                />

                <div
                  v-if="dragState?.type === 'item' && isItemPreviewTarget(group.id, itemIndex)"
                  class="pointer-events-none py-2"
                  data-testid="budget-category-container-preview"
                >
                  <div
                    class="overflow-hidden rounded-2xl border border-[#d9d0c2] bg-white/35 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.26)] backdrop-blur-[1px]"
                    data-testid="budget-category-container-preview-item"
                  >
                    <BudgetCategoryItem
                      :model-value="false"
                      :label="dragState.item.label"
                      :assigned="dragState.item.assigned"
                      :activity="dragState.item.activity"
                      :available="dragState.item.available"
                      :progress="dragState.item.progress"
                      :progress-label="dragState.item.progressLabel"
                      :tone="dragState.item.tone ?? 'neutral'"
                      :size="size"
                      :disabled="true"
                      :has-checkbox="false"
                      :has-drag-handle="false"
                      checkbox-color="neutral"
                    >
                      <template v-if="dragState.item.prefixText" #prefix>
                        <span class="font-semibold text-slate-500">
                          {{ dragState.item.prefixText }}
                        </span>
                      </template>
                    </BudgetCategoryItem>
                  </div>
                </div>
              </div>

              <div
                :data-testid="`budget-category-container-item-${group.id}-${item.id}`"
                @dragenter="onItemSurfaceDragOver($event, group, itemIndex)"
                @dragover="onItemSurfaceDragOver($event, group, itemIndex)"
                @drop="onItemSurfaceDrop($event, group, itemIndex)"
              >
                <BudgetCategoryItem
                  :model-value="item.selected ?? false"
                  :label="item.label"
                  :assigned="item.assigned"
                  :activity="item.activity"
                  :available="item.available"
                  :progress="item.progress"
                  :progress-label="item.progressLabel"
                  :tone="item.tone ?? 'neutral'"
                  :size="size"
                  :disabled="item.disabled ?? disabled"
                  :has-checkbox="resolveItemCheckbox(item)"
                  :has-drag-handle="true"
                  :checkbox-color="itemCheckboxColor"
                  @update:model-value="onItemSelection(group.id, item.id, $event)"
                >
                  <template v-if="item.prefixText" #prefix>
                    <span class="font-semibold text-slate-500">
                      {{ item.prefixText }}
                    </span>
                  </template>

                  <template #dragHandle>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-md text-[#776f61] transition hover:bg-black/5 hover:text-[#5d564d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue disabled:cursor-not-allowed disabled:opacity-45"
                      :class="[
                        resolveHandleClass(size),
                        isItemDragDisabled(group, item) ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
                      ]"
                      :disabled="isItemDragDisabled(group, item)"
                      draggable="true"
                      :data-testid="`budget-category-container-item-handle-${item.id}`"
                      @dragstart="onItemDragStart($event, group, item)"
                      @drag="onDrag"
                      @dragend="clearDragState"
                    >
                      <FontAwesomeIcon :icon="dragHandleIcon" />
                    </button>
                  </template>
                </BudgetCategoryItem>
              </div>
            </template>

            <div
              class="relative mx-3 transition-[margin,opacity]"
              :class="[
                isDraggingItem && allowsDropInGroup(group)
                  ? isItemPreviewTarget(group.id, group.items.length)
                    ? 'my-2 pointer-events-auto opacity-100'
                    : showItemDropIndicators
                      ? 'my-1 pointer-events-auto opacity-100'
                      : 'my-0 pointer-events-auto opacity-100'
                  : 'my-0 pointer-events-none opacity-0'
              ]"
              :data-testid="`budget-category-container-item-drop-${group.id}-${group.items.length}`"
              @dragenter.prevent="onItemZoneDragOver($event, group, group.items.length)"
              @dragover.prevent="onItemZoneDragOver($event, group, group.items.length)"
              @drop.prevent="onItemDrop($event, group, group.items.length)"
            >
              <div
                class="pointer-events-none h-px bg-transparent transition-colors"
                :class="[
                  isDraggingItem && isActiveItemDropZone(group.id, group.items.length) && showItemDropIndicators
                    ? 'bg-c-blue/25'
                    : 'bg-transparent'
                ]"
              />

              <div
                v-if="dragState?.type === 'item' && isItemPreviewTarget(group.id, group.items.length)"
                class="pointer-events-none py-2"
                data-testid="budget-category-container-preview"
              >
                <div
                  class="overflow-hidden rounded-2xl border border-[#d9d0c2] bg-white/35 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.26)] backdrop-blur-[1px]"
                  data-testid="budget-category-container-preview-item"
                >
                  <BudgetCategoryItem
                    :model-value="false"
                    :label="dragState.item.label"
                    :assigned="dragState.item.assigned"
                    :activity="dragState.item.activity"
                    :available="dragState.item.available"
                    :progress="dragState.item.progress"
                    :progress-label="dragState.item.progressLabel"
                    :tone="dragState.item.tone ?? 'neutral'"
                    :size="size"
                    :disabled="true"
                    :has-checkbox="false"
                    :has-drag-handle="false"
                    checkbox-color="neutral"
                  >
                    <template v-if="dragState.item.prefixText" #prefix>
                      <span class="font-semibold text-slate-500">
                        {{ dragState.item.prefixText }}
                      </span>
                    </template>
                  </BudgetCategoryItem>
                </div>
              </div>
            </div>
          </template>
        </BudgetCategoryGroup>
      </div>
    </template>

    <div
      class="relative transition-[margin,opacity]"
      :class="[
        isDraggingGroup
          ? isGroupPreviewTarget(groups.length)
            ? 'my-2 pointer-events-auto opacity-100'
            : showGroupDropIndicators
              ? 'my-1 pointer-events-auto opacity-100'
              : 'my-0 pointer-events-auto opacity-100'
          : 'my-0 pointer-events-none opacity-0'
      ]"
      :data-testid="`budget-category-container-group-drop-${groups.length}`"
      @dragenter.prevent="onGroupZoneDragOver($event, groups.length)"
      @dragover.prevent="onGroupZoneDragOver($event, groups.length)"
      @drop.prevent="onGroupDrop($event, groups.length)"
    >
      <div
        class="pointer-events-none h-px bg-transparent transition-colors"
        :class="[
          isDraggingGroup && isActiveGroupDropZone(groups.length) && showGroupDropIndicators
            ? 'bg-c-blue/25'
            : 'bg-transparent'
        ]"
      />

      <div
        v-if="dragState?.type === 'group' && isGroupPreviewTarget(groups.length)"
        class="pointer-events-none py-2"
        data-testid="budget-category-container-preview"
      >
        <div
          class="overflow-hidden rounded-2xl border border-[#d9d0c2] bg-white/40 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.34)] backdrop-blur-[1px]"
          data-testid="budget-category-container-preview-group"
        >
          <BudgetCategoryGroup
            :model-value="false"
            :title="dragState.group.title"
            :assigned="dragState.group.assigned"
            :activity="dragState.group.activity"
            :available="dragState.group.available"
            :size="size"
            :collapsed="dragState.group.collapsed ?? false"
            :indeterminate="false"
            :disabled="true"
            :has-checkbox="false"
            :has-drag-handle="false"
            checkbox-color="neutral"
          >
            <template v-for="item in dragState.group.items" :key="item.id">
              <BudgetCategoryItem
                :model-value="false"
                :label="item.label"
                :assigned="item.assigned"
                :activity="item.activity"
                :available="item.available"
                :progress="item.progress"
                :progress-label="item.progressLabel"
                :tone="item.tone ?? 'neutral'"
                :size="size"
                :disabled="true"
                :has-checkbox="false"
                :has-drag-handle="false"
                checkbox-color="neutral"
              >
                <template v-if="item.prefixText" #prefix>
                  <span class="font-semibold text-slate-500">
                    {{ item.prefixText }}
                  </span>
                </template>
              </BudgetCategoryItem>
            </template>
          </BudgetCategoryGroup>
        </div>
      </div>
    </div>

    <div
      v-if="dragState"
      class="pointer-events-none fixed left-0 top-0 z-[90]"
      :style="dragGhostStyle"
      data-testid="budget-category-container-ghost"
    >
      <div
        class="w-[720px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[22px] border border-[#d8cdbd] bg-white/97 shadow-[0_34px_65px_-30px_rgba(15,23,42,0.55),0_22px_28px_-24px_rgba(15,23,42,0.36)] ring-1 ring-black/4 transition-transform"
        :class="dragGhostCardClass"
      >
        <BudgetCategoryGroup
          v-if="dragState.type === 'group'"
          :model-value="false"
          :title="dragState.group.title"
          :assigned="dragState.group.assigned"
          :activity="dragState.group.activity"
          :available="dragState.group.available"
          :size="size"
          :collapsed="dragState.group.collapsed ?? false"
          :indeterminate="false"
          :disabled="true"
          :has-checkbox="false"
          :has-drag-handle="false"
          checkbox-color="neutral"
          data-testid="budget-category-container-ghost-group"
        >
          <template v-for="item in dragState.group.items" :key="item.id">
            <BudgetCategoryItem
              :model-value="false"
              :label="item.label"
              :assigned="item.assigned"
              :activity="item.activity"
              :available="item.available"
              :progress="item.progress"
              :progress-label="item.progressLabel"
              :tone="item.tone ?? 'neutral'"
              :size="size"
              :disabled="true"
              :has-checkbox="false"
              :has-drag-handle="false"
              checkbox-color="neutral"
            >
              <template v-if="item.prefixText" #prefix>
                <span class="font-semibold text-slate-500">
                  {{ item.prefixText }}
                </span>
              </template>
            </BudgetCategoryItem>
          </template>
        </BudgetCategoryGroup>

        <BudgetCategoryItem
          v-else
          :model-value="false"
          :label="dragState.item.label"
          :assigned="dragState.item.assigned"
          :activity="dragState.item.activity"
          :available="dragState.item.available"
          :progress="dragState.item.progress"
          :progress-label="dragState.item.progressLabel"
          :tone="dragState.item.tone ?? 'neutral'"
          :size="size"
          :disabled="true"
          :has-checkbox="false"
          :has-drag-handle="false"
          checkbox-color="neutral"
          data-testid="budget-category-container-ghost-item"
        >
          <template v-if="dragState.item.prefixText" #prefix>
            <span class="font-semibold text-slate-500">
              {{ dragState.item.prefixText }}
            </span>
          </template>
        </BudgetCategoryItem>
      </div>
    </div>
  </div>
</template>
