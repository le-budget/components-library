import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetToolbar from "../../src/components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItem from "../../src/components/BudgetToolbarItem/BudgetToolbarItem.vue";
import BudgetToolbarItemButton from "../../src/components/BudgetToolbarItemButton/BudgetToolbarItemButton.vue";
import BudgetToolbarItemSeparator from "../../src/components/BudgetToolbarItemSeparator/BudgetToolbarItemSeparator.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetToolbar/BudgetToolbar.md?raw";

const meta: Meta<typeof BudgetToolbar> = {
  title: "Components/Layout/Toolbar",
  component: BudgetToolbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetToolbar>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetToolbar,
      BudgetToolbarItem,
      BudgetToolbarItemButton,
      BudgetToolbarItemSeparator
    },
    template: `
      <BudgetToolbar label="Actions">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton>Ajouter</BudgetToolbarItemButton>
        </BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem>
          <BudgetToolbarItemButton color="secondary">Exporter</BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};

export const WithIconsAndSizes: Story = {
  render: () => ({
    components: {
      BudgetToolbar,
      BudgetToolbarItem,
      BudgetToolbarItemButton,
      BudgetToolbarItemSeparator,
      BudgetIcon
    },
    template: `
      <div class="grid gap-3">
        <BudgetToolbar label="Actions small" size="sm">
          <BudgetToolbarItem>
            <BudgetToolbarItemButton aria-label="Filtrer">
              <template #icon><BudgetIcon status="status-info" decorative /></template>
            </BudgetToolbarItemButton>
          </BudgetToolbarItem>
          <BudgetToolbarItemSeparator />
          <BudgetToolbarItem>
            <BudgetToolbarItemButton>Appliquer</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        </BudgetToolbar>
        <BudgetToolbar label="Actions medium" size="md">
          <BudgetToolbarItem>
            <BudgetToolbarItemButton active color="primary-success">Valider</BudgetToolbarItemButton>
          </BudgetToolbarItem>
          <BudgetToolbarItemSeparator />
          <BudgetToolbarItem>
            <BudgetToolbarItemButton color="secondary-warning">Verifier</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        </BudgetToolbar>
        <BudgetToolbar label="Actions large" size="lg">
          <BudgetToolbarItem>
            <BudgetToolbarItemButton color="secondary-error">Supprimer</BudgetToolbarItemButton>
          </BudgetToolbarItem>
          <BudgetToolbarItemSeparator />
          <BudgetToolbarItem>
            <BudgetToolbarItemButton loading>Traitement</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        </BudgetToolbar>
      </div>
    `
  })
};

export const Vertical: Story = {
  render: () => ({
    components: {
      BudgetToolbar,
      BudgetToolbarItem,
      BudgetToolbarItemButton,
      BudgetToolbarItemSeparator
    },
    template: `
      <BudgetToolbar label="Actions verticales" orientation="vertical" size="md">
        <BudgetToolbarItem>
          <BudgetToolbarItemButton>Action 1</BudgetToolbarItemButton>
        </BudgetToolbarItem>
        <BudgetToolbarItemSeparator />
        <BudgetToolbarItem>
          <BudgetToolbarItemButton color="secondary">Action 2</BudgetToolbarItemButton>
        </BudgetToolbarItem>
      </BudgetToolbar>
    `
  })
};

export const RightAligned: Story = {
  render: () => ({
    components: {
      BudgetToolbar,
      BudgetToolbarItem,
      BudgetToolbarItemButton,
      BudgetToolbarItemSeparator
    },
    template: `
      <div class="w-full">
        <BudgetToolbar label="Actions alignees a droite" align="right">
          <BudgetToolbarItem>
            <BudgetToolbarItemButton>Annuler</BudgetToolbarItemButton>
          </BudgetToolbarItem>
          <BudgetToolbarItemSeparator />
          <BudgetToolbarItem>
            <BudgetToolbarItemButton color="primary-success">Valider</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        </BudgetToolbar>
      </div>
    `
  })
};
