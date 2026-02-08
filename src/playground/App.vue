<script setup lang="ts">
import PlaygroundHeader from "./components/PlaygroundHeader.vue";
import PlaygroundInputText from "./components/PlaygroundInputText.vue";
import PlaygroundInputAmount from "./components/PlaygroundInputAmount.vue";
import PlaygroundButton from "./components/PlaygroundButton.vue";
import PlaygroundBadge from "./components/PlaygroundBadge.vue";
import PlaygroundCheckbox from "./components/PlaygroundCheckbox.vue";
import PlaygroundRadio from "./components/PlaygroundRadio.vue";
import PlaygroundDropdown from "./components/PlaygroundDropdown.vue";
import PlaygroundToolbar from "./components/PlaygroundToolbar.vue";
import PlaygroundTable from "./components/PlaygroundTable.vue";
import PlaygroundDatepicker from "./components/PlaygroundDatepicker.vue";

</script>

<template>
  <div class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
    <PlaygroundHeader />

    <PlaygroundInputText />
    <PlaygroundInputAmount />
    <PlaygroundButton />
    <PlaygroundBadge />
    <PlaygroundCheckbox />
    <PlaygroundRadio />
    <PlaygroundDropdown />
    <PlaygroundDatepicker />
    <PlaygroundToolbar />
    <PlaygroundTable />
  </div>
</template>
