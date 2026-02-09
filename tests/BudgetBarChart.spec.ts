import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import BudgetBarChart from "../src/components/BudgetBarChart/BudgetBarChart.vue";

vi.mock("vue-chartjs", () => {
  const MockBar = defineComponent({
    name: "MockBar",
    props: {
      data: { type: Object, required: true },
      options: { type: Object, required: true }
    },
    template: '<div data-testid="mock-bar" />'
  });

  return { Bar: MockBar };
});

describe("BudgetBarChart", () => {
  const points = [
    { x: "2026-01-01", y: -20 },
    { x: "2026-01-02", y: 100 },
    { x: "2026-01-03", y: 400 }
  ];

  it("renders labels, values and step-based colors", () => {
    const wrapper = mount(BudgetBarChart, {
      props: {
        points,
        color: {
          steps: [
            { min: -1000, color: "error" },
            { min: 0, color: "warning" },
            { min: 300, color: "success" }
          ]
        }
      }
    });

    const chart = wrapper.findComponent({ name: "MockBar" });
    const data = chart.props("data") as {
      labels: string[];
      datasets: Array<{ data: number[]; backgroundColor: string[] }>;
    };

    expect(data.labels).toEqual(["01/01", "02/01", "03/01"]);
    expect(data.datasets[0]?.data).toEqual([-20, 100, 400]);
    expect(data.datasets[0]?.backgroundColor).toEqual(["#D14B59", "#DE964F", "#27988F"]);
  });

  it("warns on duplicate step mins", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    mount(BudgetBarChart, {
      props: {
        points,
        color: {
          steps: [
            { min: 0, color: "warning" },
            { min: 0, color: "success" }
          ]
        }
      }
    });

    expect(warnSpy).toHaveBeenCalledWith(
      "[BudgetBarChart] Duplicate color steps detected. The last declared step for a given min value will be used."
    );

    warnSpy.mockRestore();
  });

  it("warns once and falls back to neutral when no step matches", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const wrapper = mount(BudgetBarChart, {
      props: {
        points,
        color: {
          steps: [{ min: 999, color: "success" }]
        }
      }
    });

    const chart = wrapper.findComponent({ name: "MockBar" });
    const firstData = chart.props("data") as {
      datasets: Array<{ backgroundColor: string[] }>;
    };

    expect(firstData.datasets[0]?.backgroundColor).toEqual(["#64748B", "#64748B", "#64748B"]);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      color: {
        steps: [{ min: 500, color: "warning" }]
      }
    });

    const secondData = wrapper.findComponent({ name: "MockBar" }).props("data") as {
      datasets: Array<{ backgroundColor: string[] }>;
    };

    expect(secondData.datasets[0]?.backgroundColor).toEqual(["#64748B", "#64748B", "#64748B"]);
    expect(warnSpy).toHaveBeenCalledTimes(2);

    warnSpy.mockRestore();
  });

  it("builds x-axis callback with thinning and tooltip formatting", () => {
    const wrapper = mount(BudgetBarChart, {
      props: {
        points: [
          { x: "2026-01-01", y: 10 },
          { x: "2026-01-02", y: 20 },
          { x: "2026-01-03", y: 30 },
          { x: "2026-01-04", y: 40 },
          { x: "2026-01-05", y: 50 }
        ],
        maxXAxisLabels: 2
      }
    });

    const chart = wrapper.findComponent({ name: "MockBar" });
    const options = chart.props("options") as {
      scales: {
        x: { ticks: { callback: (_value: number, index: number) => string; maxRotation: number } };
        y: { ticks: { callback: (value: number) => string } };
      };
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: { dataset: { label: string }; parsed: { y: number } }) => string;
          };
        };
      };
    };

    expect(options.scales.x.ticks.callback(0, 0)).toBe("01/01");
    expect(options.scales.x.ticks.callback(0, 1)).toBe("");
    expect(options.scales.x.ticks.callback(0, 4)).toBe("05/01");
    expect(options.scales.x.ticks.callback(0, 99)).toBe("");
    expect(options.scales.y.ticks.callback(1234.5)).toBe("1 234,50\u00a0€");
    expect(
      options.plugins.tooltip.callbacks.label({
        dataset: { label: "Serie" },
        parsed: { y: 42 }
      })
    ).toBe("Serie: 42,00\u00a0€");
    expect(
      options.plugins.tooltip.callbacks.label({
        dataset: { label: "" },
        parsed: { y: 42 }
      })
    ).toBe("42,00\u00a0€");
    expect(
      options.plugins.tooltip.callbacks.label({
        dataset: { label: "Serie" },
        parsed: { y: null as unknown as number }
      })
    ).toBe("Serie: 0,00\u00a0€");
  });

  it("hides legend and rotates labels on mobile", async () => {
    window.innerWidth = 500;

    const wrapper = mount(BudgetBarChart, {
      props: { points }
    });

    await wrapper.vm.$nextTick();

    const options = wrapper.findComponent({ name: "MockBar" }).props("options") as {
      plugins: { legend: { display: boolean } };
      scales: { x: { ticks: { maxRotation: number; minRotation: number } } };
    };

    expect(options.plugins.legend.display).toBe(false);
    expect(options.scales.x.ticks.maxRotation).toBe(50);
    expect(options.scales.x.ticks.minRotation).toBe(50);
  });

  it("hides legend when showLegend is false", () => {
    window.innerWidth = 1280;

    const wrapper = mount(BudgetBarChart, {
      props: { points, showLegend: false }
    });

    const options = wrapper.findComponent({ name: "MockBar" }).props("options") as {
      plugins: { legend: { display: boolean } };
    };

    expect(options.plugins.legend.display).toBe(false);
  });

  it("shows loading, error, empty states and supports slots", async () => {
    const wrapper = mount(BudgetBarChart, {
      props: {
        points,
        loading: true
      },
      slots: {
        loading: "<span>Chargement custom</span>",
        error: "<span>Erreur custom</span>",
        empty: "<span>Vide custom</span>"
      }
    });

    expect(wrapper.text()).toContain("Chargement custom");

    await wrapper.setProps({ loading: false, error: true });
    expect(wrapper.text()).toContain("Erreur custom");

    await wrapper.setProps({ error: false, points: [] });
    expect(wrapper.text()).toContain("Vide custom");
  });

  it("renders default state messages when no slots are provided", async () => {
    const wrapper = mount(BudgetBarChart, {
      props: {
        points: [],
        loading: true
      }
    });

    expect(wrapper.text()).toContain("Chargement...");

    await wrapper.setProps({ loading: false, error: true });
    expect(wrapper.text()).toContain("Une erreur est survenue.");

    await wrapper.setProps({ error: false });
    expect(wrapper.text()).toContain("Aucune donnee a afficher.");
  });

  it("uses default variant color when color is a string", () => {
    const wrapper = mount(BudgetBarChart, {
      props: {
        points,
        color: "primary"
      }
    });

    const data = wrapper.findComponent({ name: "MockBar" }).props("data") as {
      datasets: Array<{ backgroundColor: string[] }>;
    };

    expect(data.datasets[0]?.backgroundColor).toEqual(["#196FAB", "#196FAB", "#196FAB"]);
  });

  it("enforces minimum rendered height", () => {
    const wrapper = mount(BudgetBarChart, {
      props: {
        points,
        height: 90
      }
    });

    const container = wrapper.find('[style*="height"]');
    expect(container.attributes("style")).toContain("height: 120px");
  });

  it("removes resize listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const wrapper = mount(BudgetBarChart, {
      props: { points }
    });

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });
});

