<script setup lang="ts">
import BudgetSkeleton from "../BudgetSkeleton/BudgetSkeleton.vue";
import type {
  BudgetSkeletonAnimation,
  BudgetSkeletonRatio,
  BudgetSkeletonRounded,
  BudgetSkeletonSize,
  BudgetSkeletonVariant
} from "../BudgetSkeleton/BudgetSkeleton.vue";

defineOptions({
  name: "BudgetLoading"
});

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    loadingLabel?: string;
    variant?: BudgetSkeletonVariant;
    size?: BudgetSkeletonSize;
    width?: string | number;
    height?: string | number;
    lines?: number;
    rounded?: BudgetSkeletonRounded;
    animated?: boolean;
    animation?: BudgetSkeletonAnimation;
    ratio?: BudgetSkeletonRatio;
  }>(),
  {
    loading: false,
    loadingLabel: "Chargement en cours",
    variant: "text",
    size: "md",
    width: undefined,
    height: undefined,
    lines: 3,
    rounded: "md",
    animated: true,
    animation: "pulse",
    ratio: "16:9"
  }
);
</script>

<template>
  <div class="budget-loading" :aria-busy="props.loading ? 'true' : 'false'">
    <template v-if="props.loading">
      <slot name="loading">
        <BudgetSkeleton
          :variant="props.variant"
          :size="props.size"
          :width="props.width"
          :height="props.height"
          :lines="props.lines"
          :rounded="props.rounded"
          :animated="props.animated"
          :animation="props.animation"
          :ratio="props.ratio"
        />
      </slot>
      <span class="sr-only">{{ props.loadingLabel }}</span>
    </template>

    <slot v-else />
  </div>
</template>
