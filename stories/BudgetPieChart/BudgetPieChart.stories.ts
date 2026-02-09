import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetPieChart from "../../src/components/BudgetPieChart/BudgetPieChart.vue";
import doc from "../../docs/BudgetPieChart/BudgetPieChart.md?raw";

const meta: Meta<typeof BudgetPieChart> = {
  title: "Components/DataDisplay/PieChart",
  component: BudgetPieChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    color: "primary",
    seriesLabel: "Repartition",
    height: 320,
    showLegend: true,
    slices: [
      { label: "Logement", value: 820 },
      { label: "Courses", value: 360 },
      { label: "Transport", value: 140 },
      { label: "Loisirs", value: 180 }
    ]
  },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "error"]
    },
    height: {
      control: { type: "number", min: 120, max: 640, step: 10 }
    },
    showLegend: {
      control: "boolean"
    },
    loading: {
      control: "boolean"
    },
    error: {
      control: "boolean"
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetPieChart>;

export const Default: Story = {};

export const Playground: Story = {
  render: () => ({
    components: { BudgetPieChart },
    setup() {
      const slices = [
        { label: "Logement", value: 920 },
        { label: "Alimentation", value: 430 },
        { label: "Transport", value: 160 },
        { label: "Charges", value: 270 },
        { label: "Loisirs", value: 210 },
        { label: "Autres", value: 95 }
      ];

      return { slices };
    },
    template: `
      <div class="grid gap-4">
        <BudgetPieChart :slices="slices" color="primary" series-label="Depenses" />
      </div>
    `
  })
};


