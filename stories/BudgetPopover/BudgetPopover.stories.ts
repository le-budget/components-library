import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetPopover from "../../src/components/BudgetPopover/BudgetPopover.vue";
import doc from "../../docs/BudgetPopover/BudgetPopover.md?raw";

const meta: Meta<typeof BudgetPopover> = {
  title: "Components/Overlay/Popover",
  component: BudgetPopover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    title: "Information",
    icon: "status-info",
    color: "neutral",
    placement: "top",
    offset: 8,
    maxWidthClass: "max-w-xs"
  },
  argTypes: {
    color: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "error"]
    },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetPopover>;

export const Default: Story = {
  render: (args) => ({
    components: { BudgetPopover, BudgetButton },
    setup() {
      return { args };
    },
    template: `
      <div class="h-48 p-12">
        <BudgetPopover v-bind="args">
          <template #trigger>
            <BudgetButton size="sm" color="secondary">Survoler ou focus</BudgetButton>
          </template>
          Ce popover suit la place disponible et reste lisible.
        </BudgetPopover>
      </div>
    `
  })
};

export const Placements: Story = {
  render: () => ({
    components: { BudgetPopover, BudgetButton },
    setup() {
      const placements = ref<Array<"top" | "bottom" | "left" | "right">>([
        "top",
        "bottom",
        "left",
        "right"
      ]);
      return { placements };
    },
    template: `
      <div class="grid h-80 place-items-center p-8">
        <div class="grid grid-cols-2 gap-8">
          <BudgetPopover
            v-for="placement in placements"
            :key="placement"
            :placement="placement"
            :title="'Placement ' + placement"
            icon="status-question"
          >
            <template #trigger>
              <BudgetButton size="sm" color="secondary">{{ placement }}</BudgetButton>
            </template>
            Placement prefere: {{ placement }}.
          </BudgetPopover>
        </div>
      </div>
    `
  })
};

export const ColorVariants: Story = {
  render: () => ({
    components: { BudgetPopover, BudgetButton },
    setup() {
      const variants: Array<"neutral" | "primary" | "success" | "warning" | "error"> = [
        "neutral",
        "primary",
        "success",
        "warning",
        "error"
      ];
      return { variants };
    },
    template: `
      <div class="grid h-64 grid-cols-2 gap-4 p-10 sm:grid-cols-3">
        <BudgetPopover
          v-for="variant in variants"
          :key="variant"
          :color="variant"
          :title="'Color ' + variant"
          icon="status-info"
        >
          <template #trigger>
            <BudgetButton size="sm" color="secondary">{{ variant }}</BudgetButton>
          </template>
          Variante de couleur: {{ variant }}.
        </BudgetPopover>
      </div>
    `
  })
};

export const WithoutTitleAndIcon: Story = {
  args: {
    title: "",
    icon: undefined,
    color: "neutral",
    placement: "top"
  },
  render: (args) => ({
    components: { BudgetPopover, BudgetButton },
    setup() {
      return { args };
    },
    template: `
      <div class="h-44 p-10">
        <BudgetPopover v-bind="args">
          <template #trigger>
            <BudgetButton size="sm" color="secondary">Popover simple</BudgetButton>
          </template>
          Contenu sans en-tete, uniquement le texte utile.
        </BudgetPopover>
      </div>
    `
  })
};
