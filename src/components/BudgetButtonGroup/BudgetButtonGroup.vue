<script setup lang="ts">
defineOptions({
  name: "BudgetButtonGroup"
});
</script>

<template>
  <div
    role="group"
    class="inline-flex items-stretch [&>*]:rounded-none [&>*]:border-y-2 [&>*]:border-l [&>*]:border-r-0 [&>*]:focus-visible:z-10 [&>*:first-child]:rounded-l-md [&>*:first-child]:border-l-2 [&>*:last-child]:rounded-r-md [&>*:last-child]:border-r-2"
  >
    <slot />
  </div>
</template>
