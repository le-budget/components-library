import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetTableCell from "../../src/components/BudgetTableCell/BudgetTableCell.vue";
import doc from "../../docs/BudgetTableCell/BudgetTableCell.md?raw";

const meta: Meta<typeof BudgetTableCell> = {
  title: "Components/Data/TableCell",
  component: BudgetTableCell,
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

type Story = StoryObj<typeof BudgetTableCell>;

export const Default: Story = {
  args: {
    align: "left"
  },
  render: (args) => ({
    components: { BudgetTableCell },
    setup() {
      return { args };
    },
    template: `
      <table class="min-w-[360px]">
        <tbody>
          <tr>
            <BudgetTableCell v-bind="args">Contenu de cellule</BudgetTableCell>
          </tr>
        </tbody>
      </table>
    `
  })
};

