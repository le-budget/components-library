import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BudgetLineChart from "../../src/components/BudgetLineChart/BudgetLineChart.vue";
import doc from "../../docs/BudgetLineChart/BudgetLineChart.md?raw";

const basePoints = [
  { x: "2026-01-01", y: 300 },
  { x: "2026-01-02", y: 220 },
  { x: "2026-01-03", y: -80 },
  { x: "2026-01-04", y: -190 },
  { x: "2026-01-05", y: 120 },
  { x: "2026-01-06", y: 80 },
  { x: "2026-01-07", y: -40 },
  { x: "2026-01-08", y: 200 }
];

const meta: Meta<typeof BudgetLineChart> = {
  title: "Components/DataDisplay/LineChart",
  component: BudgetLineChart,
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
    threshold: 0,
    fill: true,
    smooth: true,
    tension: 0.3,
    seriesLabel: "Solde",
    maxXAxisLabels: 6,
    height: 320,
    showLegend: true
  },
  argTypes: {
    threshold: {
      control: { type: "number", step: 10 }
    },
    fill: {
      control: "boolean"
    },
    smooth: {
      control: "boolean"
    },
    tension: {
      control: { type: "number", min: 0, max: 1, step: 0.05 }
    },
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

type Story = StoryObj<typeof BudgetLineChart>;

export const Default: Story = {};

export const Playground: Story = {
  render: () => ({
    components: { BudgetLineChart },
    setup() {
      const points = [
        { x: "2026-01-01", y: 420 },
        { x: "2026-01-02", y: 280 },
        { x: "2026-01-03", y: 95 },
        { x: "2026-01-04", y: -75 },
        { x: "2026-01-05", y: -210 },
        { x: "2026-01-06", y: -120 },
        { x: "2026-01-07", y: 40 },
        { x: "2026-01-08", y: 190 },
        { x: "2026-01-09", y: -30 },
        { x: "2026-01-10", y: 160 }
      ];

      const stepped = {
        steps: [
          { min: -100000, color: "error" as const },
          { min: 0, color: "warning" as const },
          { min: 150, color: "success" as const }
        ]
      };

      return { points, stepped };
    },
    template: `
      <div class="grid gap-4">
        <BudgetLineChart :points="points" :color="stepped" :threshold="0" :fill="true" :smooth="true" :tension="0.3" :max-x-axis-labels="6" />
        <BudgetLineChart :points="points" :color="stepped" :threshold="0" :fill="true" :smooth="true" :tension="0.8" :max-x-axis-labels="6" />
        <BudgetLineChart :points="points" :color="stepped" :threshold="0" :fill="true" :smooth="false" :tension="0.8" :max-x-axis-labels="6" />
      </div>
    `
  })
};


