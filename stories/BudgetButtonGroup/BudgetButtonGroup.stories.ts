import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetButtonGroup from "../../src/components/BudgetButtonGroup/BudgetButtonGroup.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetButtonGroup/BudgetButtonGroup.md?raw";

const meta: Meta<typeof BudgetButtonGroup> = {
  title: "Components/Actions/Button Group",
  component: BudgetButtonGroup,
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

type Story = StoryObj<typeof BudgetButtonGroup>;

export const Default: Story = {
  render: () => ({
    components: { BudgetButtonGroup, BudgetButton },
    template: `
      <BudgetButtonGroup>
        <BudgetButton color="secondary">Jour</BudgetButton>
        <BudgetButton color="secondary">Semaine</BudgetButton>
        <BudgetButton color="secondary">Mois</BudgetButton>
      </BudgetButtonGroup>
    `
  })
};

export const SingleButton: Story = {
  render: () => ({
    components: { BudgetButtonGroup, BudgetButton },
    template: `
      <BudgetButtonGroup>
        <BudgetButton color="primary">Valider</BudgetButton>
      </BudgetButtonGroup>
    `
  })
};

export const ColorVariants: Story = {
  render: () => ({
    components: { BudgetButtonGroup, BudgetButton },
    template: `
      <div class="grid gap-4">
        <BudgetButtonGroup>
          <BudgetButton color="primary">Primary</BudgetButton>
          <BudgetButton color="secondary">Secondary</BudgetButton>
          <BudgetButton color="ghost">Ghost</BudgetButton>
        </BudgetButtonGroup>

        <BudgetButtonGroup>
          <BudgetButton color="primary-success">Success</BudgetButton>
          <BudgetButton color="secondary-warning">Warning</BudgetButton>
          <BudgetButton color="secondary-error">Error</BudgetButton>
        </BudgetButtonGroup>

        <BudgetButtonGroup>
          <BudgetButton color="secondary-success">A</BudgetButton>
          <BudgetButton color="secondary-success">B</BudgetButton>
          <BudgetButton color="secondary-success">C</BudgetButton>
        </BudgetButtonGroup>
      </div>
    `
  })
};

export const LoadingAndIcons: Story = {
  render: () => ({
    components: { BudgetButtonGroup, BudgetButton, BudgetIcon },
    template: `
      <div class="grid gap-4">
        <BudgetButtonGroup>
          <BudgetButton color="secondary" loading>Chargement</BudgetButton>
          <BudgetButton color="secondary">Pret</BudgetButton>
          <BudgetButton color="secondary">Termine</BudgetButton>
        </BudgetButtonGroup>

        <BudgetButtonGroup>
          <BudgetButton color="primary">
            <template #icon>
              <BudgetIcon status="status-info" />
            </template>
            Filtrer
          </BudgetButton>
          <BudgetButton color="primary-success">
            Exporter
            <template #iconRight>
              <BudgetIcon status="status-success" />
            </template>
          </BudgetButton>
          <BudgetButton color="secondary-warning">
            <template #icon>
              <BudgetIcon status="status-warning" />
            </template>
            Alerte
          </BudgetButton>
        </BudgetButtonGroup>

        <BudgetButtonGroup>
          <BudgetButton color="secondary" aria-label="Ajouter">
            <template #icon>
              <BudgetIcon status="status-info" />
            </template>
          </BudgetButton>
          <BudgetButton color="secondary-success" aria-label="Valider">
            <template #icon>
              <BudgetIcon status="status-success" />
            </template>
          </BudgetButton>
          <BudgetButton color="secondary-error" aria-label="Supprimer">
            <template #icon>
              <BudgetIcon status="status-error" />
            </template>
          </BudgetButton>
        </BudgetButtonGroup>
      </div>
    `
  })
};
