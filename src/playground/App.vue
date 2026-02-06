<script setup lang="ts">
import { ref } from "vue";

import PlaygroundHeader from "./components/PlaygroundHeader.vue";
import PlayerGroundInputText from "./components/PlayerGroundInputText.vue";



</script>

<template>
  <div class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
    <PlaygroundHeader />

    <PlayerGroundInputText />

  </div>
</template>
