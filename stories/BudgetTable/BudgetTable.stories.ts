import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import BudgetTable from "../../src/components/BudgetTable/BudgetTable.vue";
import BudgetTableHeader from "../../src/components/BudgetTableHeader/BudgetTableHeader.vue";
import BudgetTableGroup from "../../src/components/BudgetTableGroup/BudgetTableGroup.vue";
import BudgetTableRow from "../../src/components/BudgetTableRow/BudgetTableRow.vue";
import BudgetTableCell from "../../src/components/BudgetTableCell/BudgetTableCell.vue";
import BudgetAmountInput from "../../src/components/BudgetAmountInput/BudgetAmountInput.vue";
import doc from "../../docs/BudgetTable/BudgetTable.md?raw";

const meta: Meta<typeof BudgetTable> = {
  title: "Components/Data/Table",
  component: BudgetTable,
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

type Story = StoryObj<typeof BudgetTable>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetTable,
      BudgetTableHeader,
      BudgetTableGroup,
      BudgetTableRow,
      BudgetTableCell
    },
    setup() {
      const selected = ref<string[]>([]);
      return { selected };
    },
    template: `
      <BudgetTable v-model:selected="selected" selectable :page-size="3">
        <template #header>
          <BudgetTableHeader sortable sort-key="label">Libelle</BudgetTableHeader>
          <BudgetTableHeader sortable sort-key="amount" align="right">Montant</BudgetTableHeader>
          <BudgetTableHeader>Statut</BudgetTableHeader>
        </template>

        <BudgetTableGroup title="Transactions a venir" collapsible color="info">
          <BudgetTableRow row-id="upcoming-1" :sort-values="{ label: 'Abonnement', amount: 25 }">
            <BudgetTableCell>Abonnement</BudgetTableCell>
            <BudgetTableCell align="right">25,00 €</BudgetTableCell>
            <BudgetTableCell>Planifie</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Voir</button>
            </template>
          </BudgetTableRow>
          <BudgetTableRow row-id="upcoming-2" :sort-values="{ label: 'Electricite', amount: 82 }">
            <BudgetTableCell>Electricite</BudgetTableCell>
            <BudgetTableCell align="right">82,00 €</BudgetTableCell>
            <BudgetTableCell>Planifie</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Voir</button>
            </template>
          </BudgetTableRow>
        </BudgetTableGroup>

        <BudgetTableGroup title="Transactions passees" collapsible color="success">
          <BudgetTableRow row-id="past-1" :sort-values="{ label: 'Salaire', amount: 2200 }">
            <BudgetTableCell>Salaire</BudgetTableCell>
            <BudgetTableCell align="right">2 200,00 €</BudgetTableCell>
            <BudgetTableCell>Paye</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Voir</button>
            </template>
          </BudgetTableRow>
          <BudgetTableRow row-id="past-2" :sort-values="{ label: 'Loyer', amount: 900 }">
            <BudgetTableCell>Loyer</BudgetTableCell>
            <BudgetTableCell align="right">900,00 €</BudgetTableCell>
            <BudgetTableCell>Paye</BudgetTableCell>
            <template #actions>
              <button type="button" class="rounded border border-slate-300 px-2 py-1 text-xs">Voir</button>
            </template>
          </BudgetTableRow>
        </BudgetTableGroup>
      </BudgetTable>
    `
  })
};

export const GroupAndUngroupedLargeSet: Story = {
  render: () => ({
    components: {
      BudgetTable,
      BudgetTableHeader,
      BudgetTableGroup,
      BudgetTableRow,
      BudgetTableCell
    },
    setup() {
      const selected = ref<string[]>([]);
      const groupedRows = computed(() =>
        Array.from({ length: 10 }, (_, index) => {
          const number = index + 1;
          return {
            id: `grouped-${number}`,
            label: `Groupe ${number}`,
            amount: 50 + number,
            status: "planned"
          };
        })
      );
      const ungroupedRows = computed(() =>
        Array.from({ length: 10 }, (_, index) => {
          const number = index + 1;
          return {
            id: `ungrouped-${number}`,
            label: `Libre ${number}`,
            amount: 100 + number,
            status: "open"
          };
        })
      );
      const ungroupedRowsAfterGroup = computed(() =>
        Array.from({ length: 10 }, (_, index) => {
          const number = index + 1;
          return {
            id: `ungrouped-after-${number}`,
            label: `Libre apres ${number}`,
            amount: 200 + number,
            status: "open"
          };
        })
      );
      return { selected, groupedRows, ungroupedRows, ungroupedRowsAfterGroup };
    },
    template: `
      <BudgetTable v-model:selected="selected" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="label">Libelle</BudgetTableHeader>
          <BudgetTableHeader sortable sort-key="amount" align="right">Montant</BudgetTableHeader>
          <BudgetTableHeader sortable sort-key="status">Statut</BudgetTableHeader>
        </template>

        <BudgetTableRow
          v-for="row in ungroupedRows"
          :key="row.id"
          :row-id="row.id"
          :sort-values="{ label: row.label, amount: row.amount, status: row.status }"
        >
          <BudgetTableCell>{{ row.label }}</BudgetTableCell>
          <BudgetTableCell align="right">{{ row.amount.toFixed(2) }}</BudgetTableCell>
          <BudgetTableCell>{{ row.status }}</BudgetTableCell>
        </BudgetTableRow>

        <BudgetTableGroup title="Groupe de 10 lignes" collapsible color="primary">
          <BudgetTableRow
            v-for="row in groupedRows"
            :key="row.id"
            :row-id="row.id"
            :sort-values="{ label: row.label, amount: row.amount, status: row.status }"
          >
            <BudgetTableCell>{{ row.label }}</BudgetTableCell>
            <BudgetTableCell align="right">{{ row.amount.toFixed(2) }}</BudgetTableCell>
            <BudgetTableCell>{{ row.status }}</BudgetTableCell>
          </BudgetTableRow>
        </BudgetTableGroup>

        <BudgetTableRow
          v-for="row in ungroupedRowsAfterGroup"
          :key="row.id"
          :row-id="row.id"
          :sort-values="{ label: row.label, amount: row.amount, status: row.status }"
        >
          <BudgetTableCell>{{ row.label }}</BudgetTableCell>
          <BudgetTableCell align="right">{{ row.amount.toFixed(2) }}</BudgetTableCell>
          <BudgetTableCell>{{ row.status }}</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>
    `
  })
};

export const SingleSortableColumn: Story = {
  render: () => ({
    components: {
      BudgetTable,
      BudgetTableHeader,
      BudgetTableRow,
      BudgetTableCell
    },
    setup() {
      const selected = ref<string[]>([]);
      return { selected };
    },
    template: `
      <BudgetTable v-model:selected="selected" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="label">Libelle (triable)</BudgetTableHeader>
          <BudgetTableHeader>Categorie</BudgetTableHeader>
          <BudgetTableHeader align="right">Montant</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="single-1" :sort-values="{ label: 'Charlie' }">
          <BudgetTableCell>Charlie</BudgetTableCell>
          <BudgetTableCell>Charges</BudgetTableCell>
          <BudgetTableCell align="right">120,00 €</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="single-2" :sort-values="{ label: 'Alpha' }">
          <BudgetTableCell>Alpha</BudgetTableCell>
          <BudgetTableCell>Loyer</BudgetTableCell>
          <BudgetTableCell align="right">900,00 €</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="single-3" :sort-values="{ label: 'Bravo' }">
          <BudgetTableCell>Bravo</BudgetTableCell>
          <BudgetTableCell>Alimentation</BudgetTableCell>
          <BudgetTableCell align="right">65,00 €</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>
    `
  })
};

export const ColumnSizing: Story = {
  render: () => ({
    components: {
      BudgetTable,
      BudgetTableHeader,
      BudgetTableRow,
      BudgetTableCell
    },
    setup() {
      const selected = ref<string[]>([]);
      return { selected };
    },
    template: `
      <BudgetTable v-model:selected="selected" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="label" :span="6">Libelle (6/12)</BudgetTableHeader>
          <BudgetTableHeader fit-content>Type (fit content)</BudgetTableHeader>
          <BudgetTableHeader align="right">Montant (auto)</BudgetTableHeader>
        </template>

        <BudgetTableRow row-id="size-1" :sort-values="{ label: 'Abonnement' }">
          <BudgetTableCell>Abonnement a un service en ligne</BudgetTableCell>
          <BudgetTableCell>Mensuel</BudgetTableCell>
          <BudgetTableCell align="right">19,90 €</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="size-2" :sort-values="{ label: 'Loyer' }">
          <BudgetTableCell>Loyer</BudgetTableCell>
          <BudgetTableCell>Fixe</BudgetTableCell>
          <BudgetTableCell align="right">900,00 €</BudgetTableCell>
        </BudgetTableRow>
        <BudgetTableRow row-id="size-3" :sort-values="{ label: 'Achat ponctuel' }">
          <BudgetTableCell>Achat ponctuel de materiel de remplacement</BudgetTableCell>
          <BudgetTableCell>Ponctuel</BudgetTableCell>
          <BudgetTableCell align="right">230,00 €</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>
    `
  })
};

export const WithRowControls: Story = {
  render: () => ({
    components: {
      BudgetTable,
      BudgetTableHeader,
      BudgetTableRow,
      BudgetTableCell,
      BudgetAmountInput
    },
    setup() {
      const selected = ref<string[]>([]);
      const rows = ref([
        {
          id: "control-1",
          category: "Logement",
          label: "Loyer",
          amount: 900,
          status: "Valide"
        },
        {
          id: "control-2",
          category: "Charges",
          label: "Electricite",
          amount: 82.5,
          status: "A verifier"
        },
        {
          id: "control-3",
          category: "Abonnements",
          label: "Streaming",
          amount: 14.99,
          status: "Valide"
        }
      ]);
      return { selected, rows };
    },
    template: `
      <BudgetTable v-model:selected="selected" selectable>
        <template #header>
          <BudgetTableHeader sortable sort-key="category">Categorie</BudgetTableHeader>
          <BudgetTableHeader>Montant (controle)</BudgetTableHeader>
          <BudgetTableHeader>Statut</BudgetTableHeader>
        </template>

        <BudgetTableRow
          v-for="row in rows"
          :key="row.id"
          :row-id="row.id"
          :sort-values="{ category: row.category }"
        >
          <BudgetTableCell>
            <div class="font-medium">{{ row.category }}</div>
            <div class="text-xs text-slate-500">{{ row.label }}</div>
          </BudgetTableCell>
          <BudgetTableCell>
            <div class="max-w-[220px]">
              <BudgetAmountInput v-model="row.amount" />
            </div>
          </BudgetTableCell>
          <BudgetTableCell>{{ row.status }}</BudgetTableCell>
        </BudgetTableRow>
      </BudgetTable>
    `
  })
};

export const HeaderColors: Story = {
  render: () => ({
    components: {
      BudgetTable,
      BudgetTableHeader,
      BudgetTableRow,
      BudgetTableCell
    },
    setup() {
      const colorExamples: Array<{
        key: string;
        label: string;
        color?: "primary" | "success" | "warning" | "error" | "info" | "neutral" | "gray";
      }> = [
        { key: "default", label: "Default (white)" },
        { key: "gray", label: "Gray", color: "gray" },
        { key: "primary", label: "Primary", color: "primary" },
        { key: "success", label: "Success", color: "success" },
        { key: "warning", label: "Warning", color: "warning" },
        { key: "error", label: "Error", color: "error" },
        { key: "info", label: "Info", color: "info" },
        { key: "neutral", label: "Neutral", color: "neutral" }
      ];

      return { colorExamples };
    },
    template: `
      <div class="grid gap-3">
        <div
          v-for="example in colorExamples"
          :key="example.key"
          class="space-y-1"
        >
          <div class="text-sm font-medium text-slate-700 dark:text-slate-200">
            {{ example.label }}
          </div>
          <BudgetTable selectable :select-all-color="example.color">
            <template #header>
              <BudgetTableHeader :color="example.color">Colonne A</BudgetTableHeader>
              <BudgetTableHeader :color="example.color">Colonne B</BudgetTableHeader>
              <BudgetTableHeader :color="example.color">Colonne C</BudgetTableHeader>
            </template>
            <BudgetTableRow :row-id="example.key + '-1'">
              <BudgetTableCell>Ligne 1 A</BudgetTableCell>
              <BudgetTableCell>Ligne 1 B</BudgetTableCell>
              <BudgetTableCell>Ligne 1 C</BudgetTableCell>
            </BudgetTableRow>
            <BudgetTableRow :row-id="example.key + '-2'">
              <BudgetTableCell>Ligne 2 A</BudgetTableCell>
              <BudgetTableCell>Ligne 2 B</BudgetTableCell>
              <BudgetTableCell>Ligne 2 C</BudgetTableCell>
            </BudgetTableRow>
            <BudgetTableRow :row-id="example.key + '-3'">
              <BudgetTableCell>Ligne 3 A</BudgetTableCell>
              <BudgetTableCell>Ligne 3 B</BudgetTableCell>
              <BudgetTableCell>Ligne 3 C</BudgetTableCell>
            </BudgetTableRow>
          </BudgetTable>
        </div>
      </div>
    `
  })
};

export const Loading: Story = {
  args: {
    loading: true
  },
  render: (args) => ({
    components: {
      BudgetTable,
      BudgetTableHeader
    },
    setup() {
      return { args };
    },
    template: `
      <BudgetTable v-bind="args">
        <template #header>
          <BudgetTableHeader>Libelle</BudgetTableHeader>
          <BudgetTableHeader>Montant</BudgetTableHeader>
        </template>
      </BudgetTable>
    `
  })
};
