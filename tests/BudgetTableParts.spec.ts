import { mount } from "@vue/test-utils";
import { ref } from "vue";
import BudgetTableCell from "../src/components/BudgetTableCell/BudgetTableCell.vue";
import BudgetTableHeader from "../src/components/BudgetTableHeader/BudgetTableHeader.vue";
import { budgetTableContextKey } from "../src/components/BudgetTable/tableContext";

describe("BudgetTableHeader", () => {
  it("renders non-sortable header with slots and alignment", () => {
    const wrapper = mount(BudgetTableHeader, {
      props: {
        align: "right"
      },
      slots: {
        prefix: "<span>€</span>",
        default: "Montant",
        suffix: "<span>TTC</span>"
      }
    });

    expect(wrapper.attributes("aria-sort")).toBe("none");
    expect(wrapper.find("button").exists()).toBe(false);
    expect(wrapper.text()).toContain("Montant");
    expect(wrapper.find("span.flex")?.classes()).toContain("text-right");
  });

  it("toggles sort from context when sortable", async () => {
    const toggleSort = vi.fn();
    const wrapper = mount(BudgetTableHeader, {
      props: {
        sortable: true,
        sortKey: "amount"
      },
      slots: {
        default: "Montant"
      },
      global: {
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(false),
            hasActionsColumn: ref(false),
            activeSortKey: ref("amount"),
            activeSortDirection: ref("asc"),
            getSortDirection: () => "asc",
            toggleSort,
            isRowSelected: () => false,
            toggleRowSelection: vi.fn()
          }
        }
      }
    });

    expect(wrapper.attributes("aria-sort")).toBe("ascending");
    await wrapper.find("button").trigger("click");
    expect(toggleSort).toHaveBeenCalledWith({
      key: "amount",
      sortFn: undefined
    });
  });

  it("shows descending aria-sort and handles sortable header without context", async () => {
    const wrapper = mount(BudgetTableHeader, {
      props: {
        sortable: true,
        sortKey: "name"
      },
      slots: {
        default: "Nom"
      },
      global: {
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(false),
            hasActionsColumn: ref(false),
            activeSortKey: ref("name"),
            activeSortDirection: ref("desc"),
            getSortDirection: () => "desc",
            toggleSort: vi.fn(),
            isRowSelected: () => false,
            toggleRowSelection: vi.fn()
          }
        }
      }
    });

    expect(wrapper.attributes("aria-sort")).toBe("descending");
    expect(wrapper.find('[data-testid="sort-icon"] svg').exists()).toBe(true);
    await wrapper.find("button").trigger("click");
  });

  it("supports center alignment on sortable header", () => {
    const wrapper = mount(BudgetTableHeader, {
      props: {
        sortable: true,
        align: "center"
      },
      slots: {
        default: "Centre"
      },
      global: {
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(false),
            hasActionsColumn: ref(false),
            activeSortKey: ref(null),
            activeSortDirection: ref("asc"),
            getSortDirection: () => null,
            toggleSort: vi.fn(),
            isRowSelected: () => false,
            toggleRowSelection: vi.fn()
          }
        }
      }
    });

    expect(wrapper.find("button").classes()).toContain("justify-center");
  });

  it("applies span width when provided", () => {
    const wrapper = mount(BudgetTableHeader, {
      props: {
        span: 3
      },
      slots: {
        default: "Largeur"
      }
    });

    expect(wrapper.attributes("style")).toContain("width: 25%");
  });

  it("clamps span value to 12", () => {
    const wrapper = mount(BudgetTableHeader, {
      props: {
        span: 20
      },
      slots: {
        default: "Largeur max"
      }
    });

    expect(wrapper.attributes("style")).toContain("width: 100%");
  });

  it("prioritizes fitContent over span", () => {
    const wrapper = mount(BudgetTableHeader, {
      props: {
        span: 6,
        fitContent: true
      },
      slots: {
        default: "Fit"
      }
    });

    expect(wrapper.classes()).toContain("w-px");
    expect(wrapper.attributes("style")).toContain("width: 1%");
  });

  it("supports md and lg sizes with sm as default", () => {
    const small = mount(BudgetTableHeader, {
      props: {
        sortable: true
      },
      slots: {
        default: "Small"
      },
      global: {
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(false),
            hasActionsColumn: ref(false),
            activeSortKey: ref(null),
            activeSortDirection: ref("asc"),
            getSortDirection: () => null,
            toggleSort: vi.fn(),
            isRowSelected: () => false,
            toggleRowSelection: vi.fn()
          }
        }
      }
    });
    expect(small.classes()).toContain("px-3");
    expect(small.find('[data-testid="sort-icon"] svg').classes()).toContain("text-[10px]");

    const medium = mount(BudgetTableHeader, {
      props: {
        size: "md"
      },
      slots: {
        default: "Medium"
      }
    });
    expect(medium.classes()).toContain("px-4");
    expect(medium.classes()).toContain("text-sm");

    const large = mount(BudgetTableHeader, {
      props: {
        size: "lg"
      },
      slots: {
        default: "Large"
      }
    });
    expect(large.classes()).toContain("px-5");
    expect(large.classes()).toContain("text-base");
  });

  it("uses white background by default and supports gray + badge-like colors", () => {
    const defaultHeader = mount(BudgetTableHeader, {
      slots: {
        default: "Default"
      }
    });
    expect(defaultHeader.classes()).toContain("bg-white");
    expect(defaultHeader.classes()).toContain("border-slate-300");

    const grayHeader = mount(BudgetTableHeader, {
      props: {
        color: "gray"
      },
      slots: {
        default: "Gray"
      }
    });
    expect(grayHeader.classes()).toContain("bg-slate-100");

    const successHeader = mount(BudgetTableHeader, {
      props: {
        color: "success"
      },
      slots: {
        default: "Success"
      }
    });
    expect(successHeader.classes()).toContain("bg-c-green/10");
    expect(successHeader.classes()).toContain("text-c-green-dark");
  });

  it("supports warning, error, info and neutral colors", () => {
    const primary = mount(BudgetTableHeader, {
      props: { color: "primary" },
      slots: { default: "Primary" }
    });
    expect(primary.classes()).toContain("bg-c-blue-light/20");

    const warning = mount(BudgetTableHeader, {
      props: { color: "warning" },
      slots: { default: "Warning" }
    });
    expect(warning.classes()).toContain("bg-c-orange/10");

    const error = mount(BudgetTableHeader, {
      props: { color: "error" },
      slots: { default: "Error" }
    });
    expect(error.classes()).toContain("bg-c-red/10");

    const info = mount(BudgetTableHeader, {
      props: { color: "info" },
      slots: { default: "Info" }
    });
    expect(info.classes()).toContain("bg-sky-100");

    const neutral = mount(BudgetTableHeader, {
      props: { color: "neutral" },
      slots: { default: "Neutral" }
    });
    expect(neutral.classes()).toContain("bg-slate-100");
  });

  it("supports clickable sortable header without sortKey", async () => {
    const toggleSort = vi.fn();
    const wrapper = mount(BudgetTableHeader, {
      props: {
        sortable: true
      },
      slots: {
        default: "Sans cle"
      },
      global: {
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(false),
            hasActionsColumn: ref(false),
            activeSortKey: ref(null),
            activeSortDirection: ref("asc"),
            getSortDirection: () => null,
            toggleSort,
            isRowSelected: () => false,
            toggleRowSelection: vi.fn()
          }
        }
      }
    });

    await wrapper.find("button").trigger("click");
    expect(toggleSort).toHaveBeenCalledWith({ key: undefined, sortFn: undefined });
  });

  it("renders sortable header with prefix and suffix slots", () => {
    const wrapper = mount(BudgetTableHeader, {
      props: {
        sortable: true
      },
      slots: {
        prefix: "<span>P</span>",
        default: "Label",
        suffix: "<span>S</span>"
      },
      global: {
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(false),
            hasActionsColumn: ref(false),
            activeSortKey: ref(null),
            activeSortDirection: ref("asc"),
            getSortDirection: () => null,
            toggleSort: vi.fn(),
            isRowSelected: () => false,
            toggleRowSelection: vi.fn()
          }
        }
      }
    });

    expect(wrapper.text()).toContain("P");
    expect(wrapper.text()).toContain("S");
  });
});

describe("BudgetTableCell", () => {
  it("renders prefix and suffix slots", () => {
    const wrapper = mount(BudgetTableCell, {
      props: {
        align: "center"
      },
      slots: {
        prefix: "<span>P</span>",
        default: "Valeur",
        suffix: "<span>S</span>"
      }
    });

    expect(wrapper.text()).toContain("P");
    expect(wrapper.text()).toContain("Valeur");
    expect(wrapper.text()).toContain("S");
    expect(wrapper.find("span.flex").classes()).toContain("justify-center");
  });

  it("defaults to left alignment without optional slots", () => {
    const wrapper = mount(BudgetTableCell, {
      slots: {
        default: "Unique"
      }
    });

    expect(wrapper.find("span.flex").classes()).toContain("justify-start");
  });
});

