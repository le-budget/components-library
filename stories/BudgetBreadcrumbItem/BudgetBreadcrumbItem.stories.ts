import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetBreadcrumb from "../../src/components/BudgetBreadcrumb/BudgetBreadcrumb.vue";
import BudgetBreadcrumbItem from "../../src/components/BudgetBreadcrumbItem/BudgetBreadcrumbItem.vue";
import doc from "../../docs/BudgetBreadcrumbItem/BudgetBreadcrumbItem.md?raw";

const meta: Meta<typeof BudgetBreadcrumbItem> = {
  title: "Components/Navigation/Breadcrumb Item",
  component: BudgetBreadcrumbItem,
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

type Story = StoryObj<typeof BudgetBreadcrumbItem>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetBreadcrumb,
      BudgetBreadcrumbItem
    },
    template: `
      <BudgetBreadcrumb>
        <BudgetBreadcrumbItem label="Accueil" href="#" />
        <BudgetBreadcrumbItem label="Configuration" />
      </BudgetBreadcrumb>
    `
  })
};
