import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetAccordion from "../../src/components/BudgetAccordion/BudgetAccordion.vue";
import BudgetAccordionItem from "../../src/components/BudgetAccordionItem/BudgetAccordionItem.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetAccordionItem/BudgetAccordionItem.md?raw";

const meta: Meta<typeof BudgetAccordionItem> = {
  title: "Components/Layout/AccordionItem",
  component: BudgetAccordionItem,
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

type Story = StoryObj<typeof BudgetAccordionItem>;

export const Default: Story = {
  args: {
    title: "Details",
    color: "primary",
    defaultOpen: true
  },
  render: (args) => ({
    components: { BudgetAccordion, BudgetAccordionItem, BudgetIcon },
    setup: () => ({ args }),
    template: `
      <BudgetAccordion :spaced="true">
        <BudgetAccordionItem v-bind="args">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
          Contenu principal de la section.
        </BudgetAccordionItem>
      </BudgetAccordion>
    `
  })
};

export const Disabled: Story = {
  args: {
    title: "Section verrouillee",
    color: "secondary-warning",
    disabled: true
  },
  render: (args) => ({
    components: { BudgetAccordion, BudgetAccordionItem },
    setup: () => ({ args }),
    template: `
      <BudgetAccordion :spaced="true">
        <BudgetAccordionItem v-bind="args">
          Cette section n'est pas interactive.
        </BudgetAccordionItem>
      </BudgetAccordion>
    `
  })
};
