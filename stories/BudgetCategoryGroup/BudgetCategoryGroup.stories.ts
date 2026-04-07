import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetCategoryGroup from "../../src/components/BudgetCategoryGroup/BudgetCategoryGroup.vue";
import BudgetCategoryItem from "../../src/components/BudgetCategoryItem/BudgetCategoryItem.vue";
import doc from "../../docs/BudgetCategoryGroup/BudgetCategoryGroup.md?raw";

const meta: Meta<typeof BudgetCategoryGroup> = {
  title: "Components/Data/CategoryGroup",
  component: BudgetCategoryGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    modelValue: false,
    title: "Factures",
    assigned: "821,07 EUR",
    activity: "-627,23 EUR",
    available: "313,84 EUR",
    size: "lg",
    hasDragHandle: false,
    hasCheckbox: true,
    collapsed: false,
    indeterminate: false,
    disabled: false,
    checkboxColor: "neutral"
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    hasCheckbox: {
      control: "boolean"
    },
    hasDragHandle: {
      control: "boolean"
    },
    checkboxColor: {
      control: "select",
      options: ["primary", "success", "warning", "error", "neutral"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetCategoryGroup>;

function buildGroupStory(initialCollapsed = false, indeterminate = false) {
  return {
    render: (args) => ({
      components: { BudgetCategoryGroup, BudgetCategoryItem },
      setup() {
        const groupSelected = ref(args.modelValue);
        const collapsed = ref(initialCollapsed);
        const firstSelected = ref(false);
        const secondSelected = ref(true);
        return { args, groupSelected, collapsed, firstSelected, secondSelected, indeterminate };
      },
      template: `
        <div class="max-w-6xl rounded-3xl border border-[#e6ddcf] bg-white">
          <BudgetCategoryGroup
            v-bind="args"
            v-model="groupSelected"
            v-model:collapsed="collapsed"
            :indeterminate="indeterminate"
          >
            <template #dragHandle>
              <span
                v-if="args.hasDragHandle"
                class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500"
              >
                DR
              </span>
            </template>

            <BudgetCategoryItem
              v-model="firstSelected"
              label="Electricite"
              assigned="301,33 EUR"
              activity="-301,33 EUR"
              available="0,00 EUR"
              :progress="100"
              progress-label="Totalement depense"
              tone="neutral"
            >
              <template #prefix>
                <span class="font-semibold text-slate-500">ELEC</span>
              </template>
            </BudgetCategoryItem>

            <BudgetCategoryItem
              v-model="secondSelected"
              label="Eau"
              assigned="30,00 EUR"
              activity="0,00 EUR"
              available="150,00 EUR"
              :progress="20"
              progress-label="Finance"
              tone="success"
            >
              <template #prefix>
                <span class="font-semibold text-slate-500">EAU</span>
              </template>
            </BudgetCategoryItem>
          </BudgetCategoryGroup>
        </div>
      `
    })
  };
}

export const Default: Story = buildGroupStory(false, false);

export const Replie: Story = buildGroupStory(true, false);

export const Indetermine: Story = buildGroupStory(false, true);

export const Compact: Story = {
  ...buildGroupStory(false, false),
  args: {
    size: "sm"
  }
};

export const Medium: Story = {
  ...buildGroupStory(false, false),
  args: {
    size: "md"
  }
};

export const SansCheckbox: Story = {
  ...buildGroupStory(false, false),
  args: {
    hasCheckbox: false
  }
};

export const AvecPoignee: Story = {
  ...buildGroupStory(false, false),
  args: {
    hasDragHandle: true
  }
};
