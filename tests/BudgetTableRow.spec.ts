import { mount } from "@vue/test-utils";
import { ref } from "vue";
import BudgetTableRow from "../src/components/BudgetTableRow/BudgetTableRow.vue";
import BudgetTableCell from "../src/components/BudgetTableCell/BudgetTableCell.vue";
import { budgetTableContextKey } from "../src/components/BudgetTable/tableContext";

function mountRow(contextOverrides: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(BudgetTableRow, {
    props: {
      rowId: "row-1"
    },
    slots: {
      default: `<BudgetTableCell>Valeur</BudgetTableCell>`,
      ...slots
    },
    global: {
      components: {
        BudgetTableCell
      },
      provide: {
        [budgetTableContextKey as symbol]: {
          selectable: ref(true),
          hasActionsColumn: ref(true),
          checkboxColor: ref("neutral"),
          activeSortKey: ref(null),
          activeSortDirection: ref("asc"),
          getSortDirection: () => null,
          toggleSort: vi.fn(),
          isRowSelected: () => false,
          toggleRowSelection: vi.fn(),
          ...contextOverrides
        }
      }
    }
  });
}

describe("BudgetTableRow", () => {
  it("renders selection checkbox and actions slot", () => {
    const wrapper = mountRow({}, { actions: "<button type='button'>Editer</button>" });

    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Editer");
  });

  it("calls toggleRowSelection on checkbox change", async () => {
    const toggleRowSelection = vi.fn();
    const wrapper = mountRow({ toggleRowSelection });

    await wrapper.find("input[type='checkbox']").setValue(true);
    expect(toggleRowSelection).toHaveBeenCalledWith("row-1", true);
  });

  it("emits unchecked state on checkbox change", async () => {
    const toggleRowSelection = vi.fn();
    const wrapper = mountRow({ toggleRowSelection, isRowSelected: () => true });

    await wrapper.find("input[type='checkbox']").setValue(false);
    expect(toggleRowSelection).toHaveBeenCalledWith("row-1", false);
  });

  it("hides selection and actions columns when context disables them", () => {
    const wrapper = mountRow({ selectable: ref(false), hasActionsColumn: ref(false) });

    expect(wrapper.find("input[type='checkbox']").exists()).toBe(false);
    expect(wrapper.findAll("td")).toHaveLength(1);
  });

  it("renders as selected when context reports selected row", () => {
    const wrapper = mountRow({ isRowSelected: () => true });

    const checkbox = wrapper.find("input[type='checkbox']");
    expect(checkbox.element.checked).toBe(true);
  });

  it("uses row checkboxColor prop over table context color", () => {
    const wrapper = mount(BudgetTableRow, {
      props: {
        rowId: "row-1",
        checkboxColor: "warning"
      },
      slots: {
        default: `<BudgetTableCell>Valeur</BudgetTableCell>`
      },
      global: {
        components: {
          BudgetTableCell
        },
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(true),
            hasActionsColumn: ref(false),
            checkboxColor: ref("neutral"),
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

    const checkboxBox = wrapper.find("label span");
    expect(checkboxBox.classes()).toContain("border-c-orange-dark");
  });

  it("falls back to neutral color when context has no checkboxColor", () => {
    const wrapper = mount(BudgetTableRow, {
      props: {
        rowId: "row-fallback"
      },
      slots: {
        default: `<BudgetTableCell>Valeur</BudgetTableCell>`
      },
      global: {
        components: {
          BudgetTableCell
        },
        provide: {
          [budgetTableContextKey as symbol]: {
            selectable: ref(true),
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

    const checkboxBox = wrapper.find("label span");
    expect(checkboxBox.classes()).toContain("border-slate-500");
  });

  it("renders actions column without content when slot is missing", () => {
    const wrapper = mountRow({ hasActionsColumn: ref(true) });
    const cells = wrapper.findAll("td");
    expect(cells).toHaveLength(3);
    expect(cells[2].text()).toBe("");
  });

  it("renders safely without injected table context", () => {
    const wrapper = mount(BudgetTableRow, {
      props: {
        rowId: "standalone"
      },
      slots: {
        default: "<td>Standalone</td>"
      }
    });

    expect(wrapper.find("input[type='checkbox']").exists()).toBe(false);
    expect(wrapper.find("tr").attributes("data-row-id")).toBe("standalone");
  });
});

