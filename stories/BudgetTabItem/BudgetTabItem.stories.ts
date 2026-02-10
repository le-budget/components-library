import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import BudgetTab from "../../src/components/BudgetTab/BudgetTab.vue";
import BudgetTabItem from "../../src/components/BudgetTabItem/BudgetTabItem.vue";
import doc from "../../docs/BudgetTabItem/BudgetTabItem.md?raw";

const meta: Meta<typeof BudgetTabItem> = {
  title: "Components/Navigation/TabItem",
  component: BudgetTabItem,
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

type Story = StoryObj<typeof BudgetTabItem>;

export const Default: Story = {
  args: {
    title: "Details",
    color: "primary",
    defaultActive: true
  },
  render: (args) => ({
    components: { BudgetTab, BudgetTabItem, BudgetIcon },
    setup: () => ({ args }),
    template: `
      <BudgetTab :spaced="true">
        <BudgetTabItem v-bind="args">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
          Contenu principal de l'onglet.
        </BudgetTabItem>
        <BudgetTabItem title="Secondaire" color="secondary">
          Contenu secondaire.
        </BudgetTabItem>
        <BudgetTabItem title="Neutre" color="neutral">
          Contenu neutral.
        </BudgetTabItem>
        <BudgetTabItem title="Neutre secondaire" color="secondary-neutral">
          Contenu secondary-neutral.
        </BudgetTabItem>
      </BudgetTab>
    `
  })
};

export const Disabled: Story = {
  args: {
    title: "Onglet verrouille",
    color: "secondary-error",
    disabled: true
  },
  render: (args) => ({
    components: { BudgetTab, BudgetTabItem },
    setup: () => ({ args }),
    template: `
      <BudgetTab>
        <BudgetTabItem title="Actif" color="primary" :default-active="true">
          Onglet actif.
        </BudgetTabItem>
        <BudgetTabItem v-bind="args">
          Cet onglet est desactive.
        </BudgetTabItem>
      </BudgetTab>
    `
  })
};
