import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetCategoryItem from "../../src/components/BudgetCategoryItem/BudgetCategoryItem.vue";
import doc from "../../docs/BudgetCategoryItem/BudgetCategoryItem.md?raw";

const meta: Meta<typeof BudgetCategoryItem> = {
  title: "Components/Data/CategoryItem",
  component: BudgetCategoryItem,
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
    label: "Internet et mobiles",
    assigned: "201,96 EUR",
    activity: "-126,98 EUR",
    available: "74,98 EUR",
    progress: 63,
    progressLabel: "Depense 126,98 EUR sur 201,96 EUR",
    tone: "warning",
    size: "lg",
    hasDragHandle: false,
    hasCheckbox: true,
    disabled: false,
    checkboxColor: "neutral"
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "success", "warning", "error"]
    },
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

type Story = StoryObj<typeof BudgetCategoryItem>;

export const Default: Story = {
  render: (args) => ({
    components: { BudgetCategoryItem },
    setup() {
      const modelValue = ref(args.modelValue);
      return { args, modelValue };
    },
    template: `
      <div class="max-w-6xl rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryItem
          v-bind="args"
          v-model="modelValue"
        />
      </div>
    `
  })
};

export const TotalementDepense: Story = {
  args: {
    label: "Louis",
    assigned: "20,00 EUR",
    activity: "-20,00 EUR",
    available: "0,00 EUR",
    progress: 100,
    progressLabel: "Totalement depense",
    tone: "neutral"
  }
};

export const Finance: Story = {
  args: {
    label: "Eau",
    assigned: "30,00 EUR",
    activity: "0,00 EUR",
    available: "150,00 EUR",
    progress: 20,
    progressLabel: "Finance",
    tone: "success"
  }
};

export const Depasse: Story = {
  args: {
    label: "Loisirs",
    assigned: "80,00 EUR",
    activity: "-124,00 EUR",
    available: "-44,00 EUR",
    progress: 100,
    progressLabel: "Depasse",
    tone: "error"
  }
};

export const Compact: Story = {
  args: {
    size: "sm"
  }
};

export const Medium: Story = {
  args: {
    size: "md"
  }
};

export const SansCheckbox: Story = {
  args: {
    hasCheckbox: false
  }
};

export const AvecPoignee: Story = {
  args: {
    hasDragHandle: true
  }
};

export const AvecPrefix: Story = {
  render: (args) => ({
    components: { BudgetCategoryItem },
    setup() {
      const modelValue = ref(args.modelValue);
      return { args, modelValue };
    },
    template: `
      <div class="max-w-6xl rounded-3xl border border-[#e6ddcf] bg-white">
        <BudgetCategoryItem
          v-bind="args"
          v-model="modelValue"
        >
          <template #prefix>
            <span class="font-semibold text-slate-500">EAU</span>
          </template>

          <template #dragHandle>
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
              DR
            </span>
          </template>
        </BudgetCategoryItem>
      </div>
    `
  })
};
