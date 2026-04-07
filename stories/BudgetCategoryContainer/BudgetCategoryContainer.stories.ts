import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetCategoryContainer from "../../src/components/BudgetCategoryContainer/BudgetCategoryContainer.vue";
import type {
  BudgetCategoryContainerGroup,
  BudgetCategoryContainerOrderEntry
} from "../../src/components/BudgetCategoryContainer/budgetCategoryContainer.types";
import doc from "../../docs/BudgetCategoryContainer/BudgetCategoryContainer.md?raw";

const initialGroups: BudgetCategoryContainerGroup[] = [
  {
    id: "group-factures",
    title: "Factures",
    assigned: "821,07 EUR",
    activity: "-627,23 EUR",
    available: "313,84 EUR",
    selected: false,
    collapsed: false,
    indeterminate: true,
    items: [
      {
        id: "item-electricite",
        label: "Electricite",
        assigned: "301,33 EUR",
        activity: "-301,33 EUR",
        available: "0,00 EUR",
        progress: 100,
        progressLabel: "Totalement depense",
        tone: "neutral",
        selected: false,
        prefixText: "ELEC"
      },
      {
        id: "item-eau",
        label: "Eau",
        assigned: "30,00 EUR",
        activity: "0,00 EUR",
        available: "150,00 EUR",
        progress: 20,
        progressLabel: "Finance",
        tone: "success",
        selected: true,
        prefixText: "EAU"
      }
    ]
  },
  {
    id: "group-credits",
    title: "Credits",
    assigned: "1489,81 EUR",
    activity: "-1374,58 EUR",
    available: "115,23 EUR",
    selected: false,
    collapsed: false,
    items: [
      {
        id: "item-auto",
        label: "Credit automobile",
        assigned: "536,90 EUR",
        activity: "-536,90 EUR",
        available: "0,00 EUR",
        progress: 100,
        progressLabel: "Totalement depense",
        tone: "neutral",
        selected: false,
        prefixText: "AUTO"
      }
    ]
  }
];

const meta: Meta<typeof BudgetCategoryContainer> = {
  title: "Components/Data/CategoryContainer",
  component: BudgetCategoryContainer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    groups: initialGroups,
    size: "lg",
    disabled: false,
    hasCheckbox: true,
    groupCheckboxColor: "neutral",
    itemCheckboxColor: "neutral",
    showGroupDropIndicators: true,
    showItemDropIndicators: true
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    hasCheckbox: {
      control: "boolean"
    },
    groupCheckboxColor: {
      control: "select",
      options: ["primary", "success", "warning", "error", "neutral"]
    },
    itemCheckboxColor: {
      control: "select",
      options: ["primary", "success", "warning", "error", "neutral"]
    },
    showGroupDropIndicators: {
      control: "boolean"
    },
    showItemDropIndicators: {
      control: "boolean"
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetCategoryContainer>;

function cloneGroups(groups: BudgetCategoryContainerGroup[]) {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item }))
  }));
}

export const Default: Story = {
  render: (args) => ({
    components: { BudgetCategoryContainer },
    setup() {
      const groups = ref<BudgetCategoryContainerGroup[]>(cloneGroups(args.groups));
      const lastOrder = ref<BudgetCategoryContainerOrderEntry[]>([]);

      function onGroupsUpdate(value: BudgetCategoryContainerGroup[]) {
        groups.value = value;
      }

      function onReorder(value: BudgetCategoryContainerOrderEntry[]) {
        lastOrder.value = value;
      }

      return {
        args,
        groups,
        lastOrder,
        onGroupsUpdate,
        onReorder
      };
    },
    template: `
      <div class="grid max-w-6xl gap-4">
        <div class="rounded-3xl border border-[#e6ddcf] bg-white">
          <BudgetCategoryContainer
            v-bind="args"
            :groups="groups"
            @update:groups="onGroupsUpdate"
            @reorder="onReorder"
          />
        </div>

        <pre class="rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{{ JSON.stringify(lastOrder, null, 2) }}</pre>
      </div>
    `
  })
};

export const Compact: Story = {
  ...Default,
  args: {
    size: "sm"
  }
};

export const SansCheckbox: Story = {
  ...Default,
  args: {
    hasCheckbox: false
  }
};

export const SansIndicateurs: Story = {
  ...Default,
  args: {
    showGroupDropIndicators: false,
    showItemDropIndicators: false
  }
};
