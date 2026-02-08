import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetTableGroup from "../../src/components/BudgetTableGroup/BudgetTableGroup.vue";
import BudgetTableRow from "../../src/components/BudgetTableRow/BudgetTableRow.vue";
import BudgetTableCell from "../../src/components/BudgetTableCell/BudgetTableCell.vue";
import doc from "../../docs/BudgetTableGroup/BudgetTableGroup.md?raw";

const meta: Meta<typeof BudgetTableGroup> = {
  title: "Components/Data/TableGroup",
  component: BudgetTableGroup,
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

type Story = StoryObj<typeof BudgetTableGroup>;

export const Default: Story = {
  render: () => ({
    components: { BudgetTableGroup, BudgetTableRow, BudgetTableCell },
    template: `
      <table class="min-w-[360px]">
        <tbody>
          <BudgetTableGroup title="Transactions" collapsible>
            <BudgetTableRow row-id="row-1">
              <BudgetTableCell>Abonnement</BudgetTableCell>
            </BudgetTableRow>
          </BudgetTableGroup>
        </tbody>
      </table>
    `
  })
};

