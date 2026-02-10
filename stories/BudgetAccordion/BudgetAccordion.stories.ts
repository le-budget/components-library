import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetAccordion from "../../src/components/BudgetAccordion/BudgetAccordion.vue";
import BudgetAccordionItem from "../../src/components/BudgetAccordionItem/BudgetAccordionItem.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetAccordion/BudgetAccordion.md?raw";

const meta: Meta<typeof BudgetAccordion> = {
  title: "Components/Layout/Accordion",
  component: BudgetAccordion,
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

type Story = StoryObj<typeof BudgetAccordion>;

export const Single: Story = {
  args: {
    multiple: false,
    spaced: false
  },
  render: (args) => ({
    components: { BudgetAccordion, BudgetAccordionItem, BudgetIcon },
    setup: () => ({ args }),
    template: `
      <BudgetAccordion v-bind="args">
        <BudgetAccordionItem title="Synthese du mois" color="primary" :default-open="true">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
          Les depenses de ce mois sont conformes au budget previsionnel.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Alertes" color="primary-warning">
          <template #icon>
            <BudgetIcon status="status-warning" decorative />
          </template>
          Trois alertes de depassement ont ete detectees.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Erreurs" color="primary-error">
          <template #icon>
            <BudgetIcon status="status-error" decorative />
          </template>
          Aucune erreur bloquante.
        </BudgetAccordionItem>
      </BudgetAccordion>
    `
  })
};

export const MultipleSpaced: Story = {
  args: {
    multiple: true,
    spaced: true
  },
  render: (args) => ({
    components: { BudgetAccordion, BudgetAccordionItem, BudgetIcon },
    setup: () => ({ args }),
    template: `
      <BudgetAccordion v-bind="args">
        <BudgetAccordionItem title="Comptes actifs" color="secondary-success" :default-open="true">
          <template #icon>
            <BudgetIcon status="status-success" decorative />
          </template>
          24 comptes actifs sur 25.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Demandes en attente" color="secondary">
          2 demandes en attente de validation manager.
        </BudgetAccordionItem>
        <BudgetAccordionItem title="Anomalies" color="secondary-error">
          <template #icon>
            <BudgetIcon status="status-error" decorative />
          </template>
          1 anomalie mineure reste a corriger.
        </BudgetAccordionItem>
      </BudgetAccordion>
    `
  })
};
