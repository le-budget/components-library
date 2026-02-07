import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetDropdown from "../../src/components/BudgetDropdown/BudgetDropdown.vue";
import BudgetDropdownGroup from "../../src/components/BudgetDropdownGroup/BudgetDropdownGroup.vue";
import BudgetDropdownOption from "../../src/components/BudgetDropdownOption/BudgetDropdownOption.vue";
import doc from "../../docs/BudgetDropdownGroup/BudgetDropdownGroup.md?raw";

const meta: Meta<typeof BudgetDropdownGroup> = {
  title: "Components/Input/Dropdown Group",
  component: BudgetDropdownGroup,
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

type Story = StoryObj<typeof BudgetDropdownGroup>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetDropdown,
      BudgetDropdownGroup,
      BudgetDropdownOption
    },
    template: `
      <BudgetDropdown :model-value="null" label="Groupes">
        <BudgetDropdownGroup label="Revenus">
          <BudgetDropdownOption label="Salaire" value="salary" />
        </BudgetDropdownGroup>
        <BudgetDropdownGroup label="Depenses">
          <BudgetDropdownOption label="Loyer" value="rent" />
        </BudgetDropdownGroup>
      </BudgetDropdown>
    `
  })
};
