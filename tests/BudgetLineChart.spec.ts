import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import BudgetLineChart from "../src/components/BudgetLineChart/BudgetLineChart.vue";

vi.mock("vue-chartjs", () => {
  const MockLine = defineComponent({
    name: "MockLine",
    props: {
      data: { type: Object, required: true },
      options: { type: Object, required: true }
    },
    template: '<div data-testid="mock-line" />'
  });

  return { Line: MockLine };
});

describe("BudgetLineChart", () => {
  const points = [
    { x: "2026-01-01", y: 120 },
    { x: "2026-01-02", y: -50 },
    { x: "2026-01-03", y: 300 }
  ];

  it("renders labels, values and segmented point colors", () => {
    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        color: {
          steps: [
            { min: -1000, color: "error" },
            { min: 0, color: "warning" },
            { min: 250, color: "success" }
          ]
        }
      }
    });

    const chart = wrapper.findComponent({ name: "MockLine" });
    const gradientStops: Array<[number, string]> = [];
    const gradientMock = {
      addColorStop: vi.fn((offset: number, color: string) => {
        gradientStops.push([offset, color]);
      })
    };
    const data = chart.props("data") as {
      labels: string[];
      datasets: Array<{
        data: number[];
        pointBackgroundColor: string[];
        segment: {
          borderColor: (context: {
            chart: {
              ctx: { createLinearGradient: (...args: number[]) => typeof gradientMock };
            };
            p0: { x: number; y: number; parsed: { y: number | null } };
            p1: { x: number; y: number; parsed: { y: number | null } };
          }) => string | typeof gradientMock;
        };
      }>;
    };

    expect(data.labels).toEqual(["01/01", "02/01", "03/01"]);
    expect(data.datasets[0]?.data).toEqual([120, -50, 300]);
    expect(data.datasets[0]?.pointBackgroundColor).toEqual(["#DE964F", "#D14B59", "#27988F"]);
    expect(
      data.datasets[0]?.segment.borderColor({
        chart: {
          ctx: {
            createLinearGradient: vi.fn(() => gradientMock)
          }
        },
        p0: { x: 0, y: 0, parsed: { y: -40 } },
        p1: { x: 10, y: 10, parsed: { y: -50 } }
      })
    ).toBe("#D14B59");
    expect(
      data.datasets[0]?.segment.borderColor({
        chart: {
          ctx: {
            createLinearGradient: vi.fn(() => gradientMock)
          }
        },
        p0: { x: 0, y: 0, parsed: { y: 260 } },
        p1: { x: 10, y: 10, parsed: { y: 300 } }
      })
    ).toBe("#27988F");
    expect(
      data.datasets[0]?.segment.borderColor({
        chart: {
          ctx: {
            createLinearGradient: vi.fn(() => gradientMock)
          }
        },
        p0: { x: 0, y: 0, parsed: { y: 0 } },
        p1: { x: 10, y: 10, parsed: { y: null as unknown as number } }
      })
    ).toBe("#DE964F");

    const crossingGradientFactory = vi.fn(() => gradientMock);
    const crossingResult = data.datasets[0]?.segment.borderColor({
      chart: { ctx: { createLinearGradient: crossingGradientFactory } },
      p0: { x: 10, y: 20, parsed: { y: -120 } },
      p1: { x: 30, y: 40, parsed: { y: 40 } }
    });
    expect(crossingResult).toBe(gradientMock);
    expect(crossingGradientFactory).toHaveBeenCalledWith(10, 20, 30, 40);
    expect(gradientStops).toContainEqual([0, "#D14B59"]);
    expect(gradientStops).toContainEqual([0.75, "#D14B59"]);
    expect(gradientStops).toContainEqual([0.75, "#DE964F"]);
    expect(gradientStops).toContainEqual([1, "#DE964F"]);

    expect(
      data.datasets[0]?.segment.borderColor({
        chart: {
          ctx: {
            createLinearGradient: vi.fn(() => gradientMock)
          }
        },
        p0: { x: 0, y: 0, parsed: { y: null } },
        p1: { x: 10, y: 10, parsed: { y: 20 } }
      })
    ).toBe("#DE964F");
  });

  it("configures fill colors above and below threshold when fill=true", () => {
    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        threshold: 0,
        fill: true,
        color: {
          steps: [
            { min: -1000, color: "error" },
            { min: 0, color: "success" }
          ]
        }
      }
    });

    const data = wrapper.findComponent({ name: "MockLine" }).props("data") as {
      datasets: Array<{
        fill:
          | false
          | {
              target: { value: number };
              above: string;
              below: string;
            };
      }>;
    };

    const fill = data.datasets[0]?.fill;
    expect(fill).not.toBe(false);
    if (fill !== false) {
      expect(fill.target.value).toBe(0);
      expect(fill.above).toBe("rgba(39, 152, 143, 0.2)");
      expect(fill.below).toBe("rgba(209, 75, 89, 0.2)");
    }
  });

  it("disables fill when fill=false", () => {
    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        fill: false
      }
    });

    const data = wrapper.findComponent({ name: "MockLine" }).props("data") as {
      datasets: Array<{ fill: false | object }>;
    };

    expect(data.datasets[0]?.fill).toBe(false);
  });

  it("applies tension from props when smooth is enabled", () => {
    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        smooth: true,
        tension: 0.65
      }
    });

    const data = wrapper.findComponent({ name: "MockLine" }).props("data") as {
      datasets: Array<{ tension: number }>;
    };

    expect(data.datasets[0]?.tension).toBe(0.65);
  });

  it("clamps tension and forces it to 0 when smooth is disabled", async () => {
    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        smooth: true,
        tension: 2
      }
    });

    let data = wrapper.findComponent({ name: "MockLine" }).props("data") as {
      datasets: Array<{ tension: number }>;
    };
    expect(data.datasets[0]?.tension).toBe(1);

    await wrapper.setProps({ tension: -1 });
    data = wrapper.findComponent({ name: "MockLine" }).props("data") as {
      datasets: Array<{ tension: number }>;
    };
    expect(data.datasets[0]?.tension).toBe(0);

    await wrapper.setProps({ smooth: false, tension: 0.8 });
    data = wrapper.findComponent({ name: "MockLine" }).props("data") as {
      datasets: Array<{ tension: number }>;
    };
    expect(data.datasets[0]?.tension).toBe(0);
  });

  it("warns once on no matching step and falls back to neutral", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        color: {
          steps: [{ min: 999, color: "success" }]
        }
      }
    });

    const data = wrapper.findComponent({ name: "MockLine" }).props("data") as {
      datasets: Array<{ pointBackgroundColor: string[] }>;
    };
    expect(data.datasets[0]?.pointBackgroundColor).toEqual(["#64748B", "#64748B", "#64748B"]);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      color: {
        steps: [{ min: 500, color: "warning" }]
      }
    });

    expect(warnSpy).toHaveBeenCalledTimes(2);

    warnSpy.mockRestore();
  });

  it("warns on duplicate step mins", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    mount(BudgetLineChart, {
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
      "[BudgetLineChart] Duplicate color steps detected. The last declared step for a given min value will be used."
    );

    warnSpy.mockRestore();
  });

  it("uses axis and tooltip formatters", () => {
    const wrapper = mount(BudgetLineChart, {
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

    const options = wrapper.findComponent({ name: "MockLine" }).props("options") as {
      scales: {
        x: { ticks: { callback: (_value: number, index: number) => string } };
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
    expect(options.scales.y.ticks.callback(1500.2)).toBe("1 500,20\u00a0€");
    expect(
      options.plugins.tooltip.callbacks.label({
        dataset: { label: "Solde" },
        parsed: { y: -12.5 }
      })
    ).toBe("Solde: -12,50\u00a0€");
    expect(
      options.plugins.tooltip.callbacks.label({
        dataset: { label: "" },
        parsed: { y: 50 }
      })
    ).toBe("50,00\u00a0€");
    expect(
      options.plugins.tooltip.callbacks.label({
        dataset: { label: "Solde" },
        parsed: { y: null as unknown as number }
      })
    ).toBe("Solde: 0,00\u00a0€");
  });

  it("hides legend and rotates labels on mobile", async () => {
    window.innerWidth = 600;

    const wrapper = mount(BudgetLineChart, {
      props: { points }
    });

    await wrapper.vm.$nextTick();

    const options = wrapper.findComponent({ name: "MockLine" }).props("options") as {
      plugins: { legend: { display: boolean } };
      scales: { x: { ticks: { maxRotation: number; minRotation: number } } };
    };

    expect(options.plugins.legend.display).toBe(false);
    expect(options.scales.x.ticks.maxRotation).toBe(50);
    expect(options.scales.x.ticks.minRotation).toBe(50);
  });

  it("hides legend when showLegend is false", () => {
    window.innerWidth = 1280;

    const wrapper = mount(BudgetLineChart, {
      props: { points, showLegend: false }
    });

    const options = wrapper.findComponent({ name: "MockLine" }).props("options") as {
      plugins: { legend: { display: boolean } };
    };

    expect(options.plugins.legend.display).toBe(false);
  });

  it("handles loading, error and empty states with custom slots", async () => {
    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        loading: true
      },
      slots: {
        loading: "<span>Loading slot</span>",
        error: "<span>Error slot</span>",
        empty: "<span>Empty slot</span>"
      }
    });

    expect(wrapper.text()).toContain("Loading slot");

    await wrapper.setProps({ loading: false, error: true });
    expect(wrapper.text()).toContain("Error slot");

    await wrapper.setProps({ error: false, points: [] });
    expect(wrapper.text()).toContain("Empty slot");
  });

  it("renders default state messages when no slots are provided", async () => {
    const wrapper = mount(BudgetLineChart, {
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

  it("enforces minimum rendered height", () => {
    const wrapper = mount(BudgetLineChart, {
      props: {
        points,
        height: 110
      }
    });

    const container = wrapper.find('[style*="height"]');
    expect(container.attributes("style")).toContain("height: 120px");
  });

  it("removes resize listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const wrapper = mount(BudgetLineChart, {
      props: { points }
    });

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });
});

