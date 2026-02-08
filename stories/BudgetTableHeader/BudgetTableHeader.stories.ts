import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetTable from "../../src/components/BudgetTable/BudgetTable.vue";
import BudgetTableCell from "../../src/components/BudgetTableCell/BudgetTableCell.vue";
import BudgetTableRow from "../../src/components/BudgetTableRow/BudgetTableRow.vue";
import BudgetTableHeader from "../../src/components/BudgetTableHeader/BudgetTableHeader.vue";
import doc from "../../docs/BudgetTableHeader/BudgetTableHeader.md?raw";

const meta: Meta<typeof BudgetTableHeader> = {
  title: "Components/Data/TableHeader",
  component: BudgetTableHeader,
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

type Story = StoryObj<typeof BudgetTableHeader>;

export const Default: Story = {
  args: {
    sortable: false,
    align: "left"
  },
  render: (args) => ({
    components: { BudgetTableHeader },
    setup() {
      return { args };
    },
    template: `
      <table class="min-w-[360px]">
        <thead>
          <tr>
            <BudgetTableHeader v-bind="args">Libelle</BudgetTableHeader>
          </tr>
        </thead>
      </table>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { BudgetTableHeader },
    template: `
      <div class="grid gap-3">
        <table class="min-w-[360px]">
          <thead>
            <tr>
              <BudgetTableHeader size="sm">Small header</BudgetTableHeader>
            </tr>
          </thead>
        </table>
        <table class="min-w-[360px]">
          <thead>
            <tr>
              <BudgetTableHeader size="md">Medium header</BudgetTableHeader>
            </tr>
          </thead>
        </table>
        <table class="min-w-[360px]">
          <thead>
            <tr>
              <BudgetTableHeader size="lg">Large header</BudgetTableHeader>
            </tr>
          </thead>
        </table>
      </div>
    `
  })
};

export const Colors: Story = {
  render: () => ({
    components: { BudgetTable, BudgetTableHeader, BudgetTableRow, BudgetTableCell },
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
              <BudgetTableHeader :color="example.color">Column A</BudgetTableHeader>
              <BudgetTableHeader :color="example.color">Column B</BudgetTableHeader>
              <BudgetTableHeader :color="example.color">Column C</BudgetTableHeader>
            </template>
            <BudgetTableRow :row-id="example.key + '-1'">
              <BudgetTableCell>Row 1 A</BudgetTableCell>
              <BudgetTableCell>Row 1 B</BudgetTableCell>
              <BudgetTableCell>Row 1 C</BudgetTableCell>
            </BudgetTableRow>
            <BudgetTableRow :row-id="example.key + '-2'">
              <BudgetTableCell>Row 2 A</BudgetTableCell>
              <BudgetTableCell>Row 2 B</BudgetTableCell>
              <BudgetTableCell>Row 2 C</BudgetTableCell>
            </BudgetTableRow>
            <BudgetTableRow :row-id="example.key + '-3'">
              <BudgetTableCell>Row 3 A</BudgetTableCell>
              <BudgetTableCell>Row 3 B</BudgetTableCell>
              <BudgetTableCell>Row 3 C</BudgetTableCell>
            </BudgetTableRow>
          </BudgetTable>
        </div>
      </div>
    `
  })
};
