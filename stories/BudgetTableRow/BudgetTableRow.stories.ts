import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetTableRow from "../../src/components/BudgetTableRow/BudgetTableRow.vue";
import BudgetTableCell from "../../src/components/BudgetTableCell/BudgetTableCell.vue";
import doc from "../../docs/BudgetTableRow/BudgetTableRow.md?raw";

const meta: Meta<typeof BudgetTableRow> = {
  title: "Components/Data/TableRow",
  component: BudgetTableRow,
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

type Story = StoryObj<typeof BudgetTableRow>;

export const Default: Story = {
  render: () => ({
    components: { BudgetTableRow, BudgetTableCell },
    template: `
      <table class="min-w-[360px]">
        <tbody>
          <BudgetTableRow row-id="row-1" :sort-values="{ label: 'Abonnement' }">
            <BudgetTableCell>Abonnement</BudgetTableCell>
            <BudgetTableCell align="right">25,00 €</BudgetTableCell>
          </BudgetTableRow>
        </tbody>
      </table>
    `
  })
};

