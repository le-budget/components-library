import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetBreadcrumb from "../../src/components/BudgetBreadcrumb/BudgetBreadcrumb.vue";
import BudgetBreadcrumbItem from "../../src/components/BudgetBreadcrumbItem/BudgetBreadcrumbItem.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetBreadcrumb/BudgetBreadcrumb.md?raw";

const meta: Meta<typeof BudgetBreadcrumb> = {
  title: "Components/Navigation/Breadcrumb",
  component: BudgetBreadcrumb,
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

type Story = StoryObj<typeof BudgetBreadcrumb>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetBreadcrumb,
      BudgetBreadcrumbItem
    },
    template: `
      <BudgetBreadcrumb>
        <BudgetBreadcrumbItem label="Accueil" href="#" />
        <BudgetBreadcrumbItem label="Comptes" href="#" />
        <BudgetBreadcrumbItem label="Compte courant" />
      </BudgetBreadcrumb>
    `
  })
};

export const WithIcons: Story = {
  render: () => ({
    components: {
      BudgetBreadcrumb,
      BudgetBreadcrumbItem,
      BudgetIcon
    },
    template: `
      <BudgetBreadcrumb>
        <BudgetBreadcrumbItem label="Accueil" href="#">
          <template #icon>
            <BudgetIcon status="status-info" decorative />
          </template>
        </BudgetBreadcrumbItem>
        <BudgetBreadcrumbItem label="Categories" href="#">
          <template #icon>
            <BudgetIcon status="status-question" decorative />
          </template>
        </BudgetBreadcrumbItem>
        <BudgetBreadcrumbItem label="Details" />
      </BudgetBreadcrumb>
    `
  })
};

export const Truncated: Story = {
  render: () => ({
    components: {
      BudgetBreadcrumb,
      BudgetBreadcrumbItem
    },
    template: `
      <BudgetBreadcrumb :max-items="3">
        <BudgetBreadcrumbItem label="Accueil" href="#" />
        <BudgetBreadcrumbItem label="Administration" href="#" />
        <BudgetBreadcrumbItem label="Clients" href="#" />
        <BudgetBreadcrumbItem label="Profil" />
      </BudgetBreadcrumb>
    `
  })
};
