import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetLoading from "../../src/components/BudgetLoading/BudgetLoading.vue";
import BudgetSkeleton from "../../src/components/BudgetSkeleton/BudgetSkeleton.vue";
import doc from "../../docs/BudgetLoading/BudgetLoading.md?raw";

const meta: Meta<typeof BudgetLoading> = {
  title: "Components/Feedback/Loading",
  component: BudgetLoading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    loading: true,
    loadingLabel: "Chargement en cours",
    variant: "text",
    size: "md",
    lines: 3,
    rounded: "md",
    animated: true,
    animation: "pulse",
    ratio: "16:9"
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "rect", "circle", "image"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"]
    },
    animation: {
      control: "select",
      options: ["pulse", "shimmer"]
    },
    ratio: {
      control: "select",
      options: ["1:1", "4:3", "16:9"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetLoading>;

export const FallbackSkeleton: Story = {
  render: (args) => ({
    components: { BudgetLoading },
    setup() {
      return { args };
    },
    template: `
      <BudgetLoading v-bind="args">
        <p class="text-sm">Contenu charge</p>
      </BudgetLoading>
    `
  })
};

export const CustomSlot: Story = {
  render: () => ({
    components: { BudgetLoading, BudgetSkeleton },
    template: `
      <BudgetLoading :loading="true">
        <template #loading>
          <div class="grid gap-3">
            <BudgetSkeleton variant="circle" width="40px" height="40px" />
            <BudgetSkeleton variant="text" :lines="2" />
          </div>
        </template>
        <p class="text-sm">Contenu charge</p>
      </BudgetLoading>
    `
  })
};

export const LoadedContent: Story = {
  args: {
    loading: false
  },
  render: (args) => ({
    components: { BudgetLoading },
    setup() {
      return { args };
    },
    template: `
      <BudgetLoading v-bind="args">
        <p class="text-sm">Le contenu est pret.</p>
      </BudgetLoading>
    `
  })
};

export const Playground: Story = {
  render: (args) => ({
    components: { BudgetLoading, BudgetButton },
    setup() {
      const localLoading = ref(Boolean(args.loading));

      function toggleLoading() {
        localLoading.value = !localLoading.value;
      }

      return { args, localLoading, toggleLoading };
    },
    template: `
      <div class="grid max-w-xl gap-4">
        <BudgetButton size="sm" color="secondary" @click="toggleLoading">
          Toggle loading
        </BudgetButton>

        <BudgetLoading v-bind="args" :loading="localLoading">
          <div class="rounded-md border border-slate-200 p-4 dark:border-slate-700">
            <h4 class="text-sm font-semibold">Titre charge</h4>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Contenu reeel affiche quand loading est a false.
            </p>
          </div>
        </BudgetLoading>
      </div>
    `
  })
};
