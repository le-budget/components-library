import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import BudgetDialog from "../../src/components/BudgetDialog/BudgetDialog.vue";
import doc from "../../docs/BudgetDialog/BudgetDialog.md?raw";

type DialogMix = {
  label: string;
  color: "neutral" | "primary" | "success" | "warning" | "error";
  maxWidthClass: string;
};

const meta: Meta<typeof BudgetDialog> = {
  title: "Components/Overlay/Dialog",
  component: BudgetDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    title: "Confirmer l'action",
    closeOnOverlay: true,
    closeOnEscape: true,
    showOverlay: true,
    showClose: true,
    color: "neutral",
    maxWidthClass: "max-w-lg"
  },
  argTypes: {
    color: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "error"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetDialog>;

export const Controlled: Story = {
  render: (args) => ({
    components: { BudgetDialog, BudgetButton, BudgetIcon },
    setup() {
      const open = ref(false);
      const mixes: DialogMix[] = [
        { label: "Neutral / sm", color: "neutral", maxWidthClass: "max-w-lg" },
        { label: "Primary / md", color: "primary", maxWidthClass: "max-w-[44rem]" },
        { label: "Success / lg", color: "success", maxWidthClass: "max-w-4xl" },
        { label: "Warning / xl", color: "warning", maxWidthClass: "max-w-[68rem]" },
        { label: "Error / 2xl", color: "error", maxWidthClass: "max-w-7xl" }
      ];
      const selectedMix = ref<DialogMix>(mixes[0]);

      function openWithMix(mix: DialogMix) {
        selectedMix.value = mix;
        open.value = true;
      }

      return { args, open, mixes, selectedMix, openWithMix };
    },
    template: `
      <div class="h-80">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <BudgetButton
            v-for="mix in mixes"
            :key="mix.label"
            size="sm"
            color="secondary"
            @click="openWithMix(mix)"
          >
            {{ mix.label }}
          </BudgetButton>
        </div>

        <BudgetDialog
          v-bind="args"
          v-model:open="open"
          :color="selectedMix.color"
          :max-width-class="selectedMix.maxWidthClass"
          :title="'Preset: ' + selectedMix.label"
        >
          <template #icon>
            <BudgetIcon status="status-warning" decorative />
          </template>
          <p class="text-sm">Cette action est irreversible. Verifie avant de confirmer.</p>
          <p class="text-sm">Preset actif: {{ selectedMix.label }}</p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <BudgetButton color="secondary" @click="open = false">Annuler</BudgetButton>
              <BudgetButton color="primary-warning" @click="open = false">Confirmer</BudgetButton>
            </div>
          </template>
        </BudgetDialog>
      </div>
    `
  })
};

export const UncontrolledDefaultOpen: Story = {
  args: {
    open: null,
    defaultOpen: true,
    title: "Dialog non controle",
    color: "primary"
  },
  render: (args) => ({
    components: { BudgetDialog },
    setup() {
      return { args };
    },
    template: `
      <div class="h-80">
        <BudgetDialog v-bind="args">
          <p class="text-sm">Ce dialog est ouvert via defaultOpen sans v-model.</p>
        </BudgetDialog>
      </div>
    `
  })
};

export const WithoutOverlayClose: Story = {
  args: {
    closeOnOverlay: false,
    color: "error",
    title: "Suppression definitive"
  },
  render: Controlled.render
};
