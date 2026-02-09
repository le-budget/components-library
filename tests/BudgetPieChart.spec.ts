import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import BudgetPieChart from "../src/components/BudgetPieChart/BudgetPieChart.vue";

vi.mock("vue-chartjs", () => {
  const MockPie = defineComponent({
    name: "MockPie",
    props: {
      data: { type: Object, required: true },
      options: { type: Object, required: true }
    },
    template: '<div data-testid="mock-pie" />'
  });

  return { Pie: MockPie };
});

describe("BudgetPieChart", () => {
  const slices = [
    { label: "A", value: 10 },
    { label: "B", value: 20 },
    { label: "C", value: 30 }
  ];

  it("renders chart data and desktop legend", () => {
    window.innerWidth = 1280;

    const wrapper = mount(BudgetPieChart, {
      props: {
        slices,
        color: "warning",
        seriesLabel: "Depenses"
      }
    });

    const chart = wrapper.findComponent({ name: "MockPie" });
    expect(chart.exists()).toBe(true);

    const data = chart.props("data") as { labels: string[]; datasets: Array<{ data: number[] }> };
    const options = chart.props("options") as {
      plugins: { legend: { display: boolean } };
    };

    expect(data.labels).toEqual(["A", "B", "C"]);
    expect(data.datasets[0]?.data).toEqual([10, 20, 30]);
    expect(options.plugins.legend.display).toBe(true);
    expect(options.plugins.tooltip.callbacks.label({ label: "A", parsed: 10 })).toBe(
      "A: 10,00\u00a0\u20AC"
    );
    expect(options.plugins.tooltip.callbacks.label({ label: "", parsed: 42 })).toBe(
      "42,00\u00a0\u20AC"
    );
  });

  it("hides legend on mobile", async () => {
    window.innerWidth = 640;

    const wrapper = mount(BudgetPieChart, {
      props: { slices }
    });

    await wrapper.vm.$nextTick();

    const chart = wrapper.findComponent({ name: "MockPie" });
    const options = chart.props("options") as {
      plugins: { legend: { display: boolean } };
    };

    expect(options.plugins.legend.display).toBe(false);
  });

  it("hides legend when showLegend is false", () => {
    window.innerWidth = 1280;

    const wrapper = mount(BudgetPieChart, {
      props: { slices, showLegend: false }
    });

    const options = wrapper.findComponent({ name: "MockPie" }).props("options") as {
      plugins: { legend: { display: boolean } };
    };

    expect(options.plugins.legend.display).toBe(false);
  });

  it("shows loading, error and empty states", async () => {
    const wrapper = mount(BudgetPieChart, {
      props: {
        slices,
        loading: true,
        loadingMessage: "Chargement test"
      }
    });

    expect(wrapper.text()).toContain("Chargement test");
    expect(wrapper.findComponent({ name: "MockPie" }).exists()).toBe(false);

    await wrapper.setProps({ loading: false, error: true, errorMessage: "Erreur test" });
    expect(wrapper.text()).toContain("Erreur test");

    await wrapper.setProps({ error: false, slices: [], emptyMessage: "Vide test" });
    expect(wrapper.text()).toContain("Vide test");
  });

  it("renders default state messages when no slots are provided", async () => {
    const wrapper = mount(BudgetPieChart, {
      props: {
        slices: [],
        loading: true
      }
    });

    expect(wrapper.text()).toContain("Chargement...");

    await wrapper.setProps({ loading: false, error: true });
    expect(wrapper.text()).toContain("Une erreur est survenue.");

    await wrapper.setProps({ error: false });
    expect(wrapper.text()).toContain("Aucune donnee a afficher.");
  });

  it("supports custom slots for states", () => {
    const wrapper = mount(BudgetPieChart, {
      props: {
        slices: [],
        loading: true,
        error: true
      },
      slots: {
        loading: "<span>Loading slot</span>",
        error: "<span>Error slot</span>",
        empty: "<span>Empty slot</span>"
      }
    });

    expect(wrapper.text()).toContain("Loading slot");
  });

  it("applies min height guard", () => {
    const wrapper = mount(BudgetPieChart, {
      props: {
        slices,
        height: 80
      }
    });

    const chartContainer = wrapper.find('[style*="height"]');
    expect(chartContainer.attributes("style")).toContain("height: 120px");
  });

  it("removes resize listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const wrapper = mount(BudgetPieChart, {
      props: { slices }
    });

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });
});

