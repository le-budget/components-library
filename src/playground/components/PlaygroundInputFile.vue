<script setup lang="ts">
import { computed, ref } from "vue";
import BudgetCard from "../../components/BudgetCard/BudgetCard.vue";
import BudgetInputFile from "../../components/BudgetInputFile/BudgetInputFile.vue";

const inputFileCollapsed = ref(true);

const basicFile = ref<File | null>(null);
const pdfFile = ref<File | null>(null);
const sizeSmFile = ref<File | null>(null);
const sizeMdFile = ref<File | null>(null);
const sizeLgFile = ref<File | null>(null);
const successFile = ref<File | null>(null);
const warningFile = ref<File | null>(null);
const neutralFile = ref<File | null>(null);
const disabledFile = ref<File | null>(null);
const requiredFile = ref<File | null>(null);
const externalErrorFile = ref<File | null>(null);
const invalidMessage = ref("Aucune erreur");

const basicName = computed(() => basicFile.value?.name ?? "Aucun fichier");
const pdfName = computed(() => pdfFile.value?.name ?? "Aucun fichier");

function onInvalid(event: {
  reason: "type" | "size";
  file: File;
  maxFileSize?: number;
  acceptedTypes?: string[];
}) {
  if (event.reason === "type") {
    invalidMessage.value = `Type refuse: ${event.file.name}`;
    return;
  }
  invalidMessage.value = `Taille refusee: ${event.file.name}`;
}
</script>

<template>
  <BudgetCard title="Input File" collapsible v-model:collapsed="inputFileCollapsed">
    <div class="grid gap-4">
      <BudgetInputFile
        v-model="basicFile"
        label="Piece justificative"
        dropzone-label="Glissez-deposez un fichier ou cliquez"
      />
      <p class="text-xs text-slate-600 dark:text-slate-300">
        Selection: {{ basicName }}
      </p>

      <hr class="border-gray-200">

      <BudgetInputFile
        v-model="pdfFile"
        label="PDF uniquement"
        accept=".pdf,application/pdf"
        :max-file-size="2 * 1024 * 1024"
      />
      <p class="text-xs text-slate-600 dark:text-slate-300">
        Selection: {{ pdfName }}
      </p>

      <hr class="border-gray-200">

      <div class="grid gap-3">
        <BudgetInputFile v-model="sizeSmFile" label="Taille sm" size="sm" />
        <BudgetInputFile v-model="sizeMdFile" label="Taille md" size="md" />
        <BudgetInputFile v-model="sizeLgFile" label="Taille lg" size="lg" />
      </div>

      <hr class="border-gray-200">

      <div class="grid gap-3">
        <BudgetInputFile v-model="successFile" label="Color success" color="success" />
        <BudgetInputFile v-model="warningFile" label="Color warning" color="warning" />
        <BudgetInputFile v-model="neutralFile" label="Color neutral" color="neutral" />
      </div>

      <hr class="border-gray-200">

      <BudgetInputFile
        v-model="requiredFile"
        label="Required"
        required
      />

      <hr class="border-gray-200">

      <BudgetInputFile
        v-model="externalErrorFile"
        label="Erreur externe"
        error
        error-message="Le fichier est obligatoire"
      />

      <hr class="border-gray-200">

      <BudgetInputFile
        v-model="basicFile"
        label="Retour d'erreur invalid"
        accept="image/*"
        :max-file-size="1024"
        @invalid="onInvalid"
      />
      <p class="text-xs text-slate-600 dark:text-slate-300">
        Dernier invalid: {{ invalidMessage }}
      </p>

      <hr class="border-gray-200">

      <BudgetInputFile
        v-model="disabledFile"
        label="Disabled"
        disabled
      />
    </div>
  </BudgetCard>
</template>
