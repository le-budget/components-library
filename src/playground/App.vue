<script setup lang="ts">
import { ref } from "vue";

import PlaygroundHeader from "./components/PlaygroundHeader.vue";
import PlaygroundInputText from "./components/PlaygroundInputText.vue";
import PlaygroundButton from "./components/PlaygroundButton.vue";
import PlaygroundBadge from "./components/PlaygroundBadge.vue";
import PlaygroundCheckbox from "./components/PlaygroundCheckbox.vue";

</script>

<template>
  <div class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
    <PlaygroundHeader />

    <PlaygroundInputText />
    <PlaygroundButton />
    <PlaygroundBadge />
    <PlaygroundCheckbox />
  </div>
</template>
