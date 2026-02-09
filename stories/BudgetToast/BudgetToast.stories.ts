import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetButton from "../../src/components/BudgetButton/BudgetButton.vue";
import BudgetToastContainer from "../../src/components/BudgetToastContainer/BudgetToastContainer.vue";
import { budgetToast } from "../../src/components/BudgetToast/budgetToast.store";
import PlaygroundToast from "../../src/playground/components/PlaygroundToast.vue";
import doc from "../../docs/BudgetToast/BudgetToast.md?raw";

const meta: Meta<typeof BudgetToastContainer> = {
  title: "Components/Feedback/Toast",
  component: BudgetToastContainer,
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

type Story = StoryObj<typeof BudgetToastContainer>;

export const Playground: Story = {
  render: () => ({
    components: { PlaygroundToast },
    template: "<PlaygroundToast />"
  })
};

export const MaxTen: Story = {
  render: () => ({
    components: { BudgetButton, BudgetToastContainer },
    setup: () => {
      const pushTwelve = () => {
        budgetToast.clear();
        for (let index = 1; index <= 12; index += 1) {
          budgetToast.info(`Toast ${index}`, "Le plus ancien est supprime au dela de 10.");
        }
      };

      return { pushTwelve };
    },
    template: `
      <BudgetButton size="sm" @click="pushTwelve">Generer 12 toasts</BudgetButton>
      <BudgetToastContainer />
    `
  })
};
