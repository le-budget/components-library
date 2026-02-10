import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetDrawer from "../../src/components/BudgetDrawer/BudgetDrawer.vue";
import doc from "../../docs/BudgetDrawer/BudgetDrawer.md?raw";

type DrawerMix = {
  label: string;
  borderColor: "neutral" | "primary" | "success" | "warning" | "error";
  borderThickness: "none" | "sm" | "md" | "lg";
};

const meta: Meta<typeof BudgetDrawer> = {
  title: "Components/Overlay/Drawer",
  component: BudgetDrawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    placement: "right",
    title: "Filtres",
    closeOnOverlay: true,
    closeOnEscape: true,
    showOverlay: true,
    widthClass: "w-full max-w-md",
    borderColor: "neutral",
    borderThickness: "sm"
  },
  argTypes: {
    placement: {
      control: "inline-radio",
      options: ["left", "right"]
    },
    borderColor: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "error"]
    },
    borderThickness: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetDrawer>;

export const Default: Story = {
  render: (args) => ({
    components: { BudgetDrawer, BudgetButton },
    setup() {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <div class="h-80">
        <BudgetButton @click="open = true">Ouvrir le drawer</BudgetButton>
        <BudgetDrawer v-bind="args" v-model="open">
          <div class="grid gap-2">
            <p class="text-sm">Contenu du drawer.</p>
            <p class="text-sm">Place ici tes champs, actions et informations.</p>
          </div>
        </BudgetDrawer>
      </div>
    `
  })
};

export const LeftPlacement: Story = {
  args: {
    placement: "left",
    title: "Navigation",
    borderColor: "primary",
    borderThickness: "md"
  },
  render: Default.render
};

export const WithIconAndFooter: Story = {
  args: {
    title: "Verification",
    icon: "status-info",
    borderColor: "success",
    borderThickness: "lg"
  },
  render: (args) => ({
    components: { BudgetDrawer, BudgetButton },
    setup() {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <div class="h-80">
        <BudgetButton @click="open = true">Ouvrir le drawer</BudgetButton>
        <BudgetDrawer v-bind="args" v-model="open">
          <p class="text-sm">Le contenu principal est rendu dans le slot par defaut.</p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <BudgetButton color="secondary" @click="open = false">Annuler</BudgetButton>
              <BudgetButton @click="open = false">Valider</BudgetButton>
            </div>
          </template>
        </BudgetDrawer>
      </div>
    `
  })
};

export const BorderMixes: Story = {
  render: (args) => ({
    components: { BudgetDrawer, BudgetButton },
    setup() {
      const open = ref(false);
      const mixes: DrawerMix[] = [
        { label: "Neutral sm", borderColor: "neutral", borderThickness: "sm" },
        { label: "Primary md", borderColor: "primary", borderThickness: "md" },
        { label: "Success lg", borderColor: "success", borderThickness: "lg" },
        { label: "Warning md", borderColor: "warning", borderThickness: "md" },
        { label: "Error sm", borderColor: "error", borderThickness: "sm" }
      ];
      const selectedMix = ref<DrawerMix>(mixes[0]);

      function openWithMix(mix: DrawerMix) {
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
        <BudgetDrawer
          v-bind="args"
          v-model="open"
          :title="'Mix: ' + selectedMix.label"
          :border-color="selectedMix.borderColor"
          :border-thickness="selectedMix.borderThickness"
        >
          <div class="grid gap-2 text-sm">
            <p>Visualisation des combinaisons couleur + epaisseur de bordure.</p>
            <p>Variante active: {{ selectedMix.label }}</p>
          </div>
        </BudgetDrawer>
      </div>
    `
  })
};
