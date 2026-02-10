import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import BudgetTab from "../../src/components/BudgetTab/BudgetTab.vue";
import BudgetTabItem from "../../src/components/BudgetTabItem/BudgetTabItem.vue";
import doc from "../../docs/BudgetTab/BudgetTab.md?raw";

const meta: Meta<typeof BudgetTab> = {
  title: "Components/Navigation/Tab",
  component: BudgetTab,
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

type Story = StoryObj<typeof BudgetTab>;

export const Default: Story = {
  render: () => ({
    components: { BudgetTab, BudgetTabItem, BudgetIcon },
    template: `
      <BudgetTab>
        <BudgetTabItem title="Synthese" color="primary" :default-active="true">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
          Onglets colles (spaced=false).
        </BudgetTabItem>

        <BudgetTabItem title="Comptes" color="secondary-success">
          <template #icon>
            <BudgetIcon status="status-success" decorative />
          </template>
          Detail des comptes actifs.
        </BudgetTabItem>

        <BudgetTabItem title="Neutre" color="neutral">
          Onglet neutral (fond slate-500, bordure slate-700, texte blanc).
        </BudgetTabItem>

        <BudgetTabItem title="Neutre secondaire" color="secondary-neutral">
          Onglet secondary-neutral (fond slate-50, bordure slate-500).
        </BudgetTabItem>

        <BudgetTabItem title="Alertes" color="primary-warning">
          <template #icon>
            <BudgetIcon status="status-warning" decorative />
          </template>
          Liste des alertes et depassements.
        </BudgetTabItem>
      </BudgetTab>
    `
  })
};

export const Spaced: Story = {
  render: () => ({
    components: { BudgetTab, BudgetTabItem, BudgetIcon },
    template: `
      <BudgetTab :spaced="true">
        <BudgetTabItem title="Synthese" color="primary" :default-active="true">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
          Onglets espaces (spaced=true).
        </BudgetTabItem>

        <BudgetTabItem title="Comptes" color="secondary-success">
          <template #icon>
            <BudgetIcon status="status-success" decorative />
          </template>
          Detail des comptes actifs.
        </BudgetTabItem>

        <BudgetTabItem title="Neutre" color="neutral">
          Onglet neutral (fond slate-500, bordure slate-700, texte blanc).
        </BudgetTabItem>

        <BudgetTabItem title="Neutre secondaire" color="secondary-neutral">
          Onglet secondary-neutral (fond slate-50, bordure slate-500).
        </BudgetTabItem>

        <BudgetTabItem title="Alertes" color="primary-warning">
          <template #icon>
            <BudgetIcon status="status-warning" decorative />
          </template>
          Liste des alertes et depassements.
        </BudgetTabItem>
      </BudgetTab>
    `
  })
};

export const WithDisabledTab: Story = {
  render: () => ({
    components: { BudgetTab, BudgetTabItem, BudgetIcon },
    template: `
      <BudgetTab :spaced="true">
        <BudgetTabItem title="General" color="primary" :default-active="true">
          Contenu general.
        </BudgetTabItem>

        <BudgetTabItem title="Validation" color="secondary-warning" disabled>
          Cet onglet est verrouille.
        </BudgetTabItem>

        <BudgetTabItem title="Erreurs" color="secondary-error">
          <template #icon>
            <BudgetIcon status="status-error" decorative />
          </template>
          Details des erreurs detectees.
        </BudgetTabItem>
      </BudgetTab>
    `
  })
};

export const BorderWidth: Story = {
  render: () => ({
    components: { BudgetTab, BudgetTabItem },
    template: `
      <div class="grid gap-6">
        <BudgetTab border-width="sm">
          <BudgetTabItem title="SM" :default-active="true">
            Bordure fine sur onglets et contenu.
          </BudgetTabItem>
          <BudgetTabItem title="Details">
            Exemple borderWidth="sm".
          </BudgetTabItem>
        </BudgetTab>

        <BudgetTab border-width="md" :spaced="true">
          <BudgetTabItem title="MD" :default-active="true">
            Bordure moyenne sur onglets et contenu.
          </BudgetTabItem>
          <BudgetTabItem title="Details">
            Exemple borderWidth="md".
          </BudgetTabItem>
        </BudgetTab>

        <BudgetTab border-width="lg">
          <BudgetTabItem title="LG" :default-active="true">
            Bordure epaisse sur onglets et contenu.
          </BudgetTabItem>
          <BudgetTabItem title="Details">
            Exemple borderWidth="lg".
          </BudgetTabItem>
        </BudgetTab>
      </div>
    `
  })
};
