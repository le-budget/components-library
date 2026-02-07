import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetDropdown from "../../src/components/BudgetDropdown/BudgetDropdown.vue";
import BudgetDropdownGroup from "../../src/components/BudgetDropdownGroup/BudgetDropdownGroup.vue";
import BudgetDropdownOption from "../../src/components/BudgetDropdownOption/BudgetDropdownOption.vue";
import doc from "../../docs/BudgetDropdownOption/BudgetDropdownOption.md?raw";

const meta: Meta<typeof BudgetDropdownOption> = {
  title: "Components/Input/Dropdown Option",
  component: BudgetDropdownOption,
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

type Story = StoryObj<typeof BudgetDropdownOption>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetDropdown,
      BudgetDropdownGroup,
      BudgetDropdownOption
    },
    template: `
      <BudgetDropdown :model-value="null" label="Options">
        <BudgetDropdownGroup label="Principales">
          <BudgetDropdownOption label="Option active" value="active" />
          <BudgetDropdownOption label="Option desactivee" value="disabled" disabled />
        </BudgetDropdownGroup>
      </BudgetDropdown>
    `
  })
};
