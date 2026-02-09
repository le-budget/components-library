import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetBarChart from "../../src/components/BudgetBarChart/BudgetBarChart.vue";
import doc from "../../docs/BudgetBarChart/BudgetBarChart.md?raw";

const basePoints = [
  { x: "2026-01-01", y: 540 },
  { x: "2026-01-02", y: 280 },
  { x: "2026-01-03", y: 730 },
  { x: "2026-01-04", y: 160 },
  { x: "2026-01-05", y: 420 },
  { x: "2026-01-06", y: 610 },
  { x: "2026-01-07", y: 380 },
  { x: "2026-01-08", y: 240 }
];

const meta: Meta<typeof BudgetBarChart> = {
  title: "Components/DataDisplay/BarChart",
  component: BudgetBarChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  },
  args: {
    points: basePoints,
    color: "primary",
    seriesLabel: "Entrees",
    maxXAxisLabels: 6,
    height: 320,
    showLegend: true
  },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "error"]
    },
    maxXAxisLabels: {
      control: { type: "number", min: 1, max: 20, step: 1 }
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

type Story = StoryObj<typeof BudgetBarChart>;

export const Default: Story = {};

export const Playground: Story = {
  render: () => ({
    components: { BudgetBarChart },
    setup() {
      const points = [
        { x: "2026-01-01", y: 320 },
        { x: "2026-01-02", y: -120 },
        { x: "2026-01-03", y: 180 },
        { x: "2026-01-04", y: -260 },
        { x: "2026-01-05", y: 410 },
        { x: "2026-01-06", y: -80 },
        { x: "2026-01-07", y: 290 },
        { x: "2026-01-08", y: 75 }
      ];

      const stepped = {
        steps: [
          { min: -100000, color: "error" as const },
          { min: 0, color: "warning" as const },
          { min: 250, color: "success" as const }
        ]
      };

      return { points, stepped };
    },
    template: `
      <div class="grid gap-4">
        <BudgetBarChart
          :points="points"
          :color="stepped"
          series-label="Flux journalier"
          :max-x-axis-labels="5"
        />
      </div>
    `
  })
};


