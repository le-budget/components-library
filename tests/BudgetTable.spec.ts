import { Fragment, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import BudgetTable from "../src/components/BudgetTable/BudgetTable.vue";
import BudgetTableHeader from "../src/components/BudgetTableHeader/BudgetTableHeader.vue";
import BudgetTableRow from "../src/components/BudgetTableRow/BudgetTableRow.vue";
import BudgetTableCell from "../src/components/BudgetTableCell/BudgetTableCell.vue";
import BudgetTableGroup from "../src/components/BudgetTableGroup/BudgetTableGroup.vue";

function mountTable(props: Record<string, unknown> = {}, selected: string[] = []) {
  return mount(BudgetTable, {
    props: {
      selected,
      selectable: true,
      pageSize: 2,
      ...props,
      "onUpdate:selected": (value: string[]) => {
        void value;
      }
    },
    slots: {
      header: `
        <BudgetTableHeader sortable sort-key="label">Libelle</BudgetTableHeader>
        <BudgetTableHeader sortable sort-key="amount" align="right">Montant</BudgetTableHeader>
      `,
      actionsHeader: "Operations",
      default: `
        <BudgetTableRow row-id="u-1" :sort-values="{ label: 'Zeta', amount: 2 }">
          <BudgetTableCell>Zeta</BudgetTableCell>
          <BudgetTableCell align="right">2,00 €</BudgetTableCell>
          <template #actions><button type="button">Voir</button></template>
        </BudgetTableRow>
        <BudgetTableGroup title="Transactions a venir" collapsible :collapsed="false" color="info">
          <BudgetTableRow row-id="g-1" :sort-values="{ label: 'Alpha', amount: 9 }">
            <BudgetTableCell>Alpha</BudgetTableCell>
            <BudgetTableCell align="right">9,00 €</BudgetTableCell>
            <template #actions><button type="button">Voir</button></template>
          </BudgetTableRow>
          <BudgetTableRow row-id="g-2" :sort-values="{ label: 'Beta', amount: 4 }">
            <BudgetTableCell>Beta</BudgetTableCell>
            <BudgetTableCell align="right">4,00 €</BudgetTableCell>
          </BudgetTableRow>
        </BudgetTableGroup>
        <BudgetTableGroup title="Transactions passees" collapsible collapsed color="success">
          <BudgetTableRow row-id="g-3" :sort-values="{ label: 'Gamma', amount: 10 }">
            <BudgetTableCell>Gamma</BudgetTableCell>
            <BudgetTableCell align="right">10,00 €</BudgetTableCell>
          </BudgetTableRow>
        </BudgetTableGroup>
      `
    },
    global: {
      components: {
        BudgetTable,
        BudgetTableHeader,
        BudgetTableRow,
        BudgetTableCell,
        BudgetTableGroup
      }
    }
  });
}

function getRenderedRowIds(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll("tbody tr[data-row-id]").map((row) => row.attributes("data-row-id"));
}

describe("BudgetTable", () => {
  it("renders loading state", () => {
    const wrapper = mountTable({ loading: true, selectable: false });
    expect(wrapper.text()).toContain("Chargement...");
  });

  it("renders empty state when no rows", () => {
    const wrapper = mount(BudgetTable, {
      props: {
        emptyText: "Vide"
      },
      slots: {
        header: `<BudgetTableHeader>Nom</BudgetTableHeader>`
      },
      global: {
        components: {
          BudgetTableHeader
        }
      }
    });

    expect(wrapper.text()).toContain("Vide");
  });

  it("supports table without header slot, selectable and actions columns", () => {
    const wrapper = mount(BudgetTable, {
      props: {
        selectable: false
      },
      slots: {
        default: `<BudgetTableRow row-id="only"><BudgetTableCell>Only</BudgetTableCell></BudgetTableRow>`
      },
      global: {
        components: {
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    const headers = wrapper.findAll("thead th");
    expect(headers).toHaveLength(0);
    expect(wrapper.text()).toContain("Only");
  });

  it("uses default (white) color when select-all color is not provided", () => {
    const wrapper = mountTable();
    const selectAllHeader = wrapper.find("thead th");
    expect(selectAllHeader.classes()).toContain("bg-white");
    expect(selectAllHeader.classes()).toContain("text-slate-700");
  });

  it("supports custom select-all color", () => {
    const wrapper = mountTable({ selectAllColor: "primary" });
    const selectAllHeader = wrapper.find("thead th");
    expect(selectAllHeader.classes()).toContain("bg-c-blue-light/20");
    expect(selectAllHeader.classes()).toContain("text-c-blue-dark");
  });

  it("supports all select-all color variants", () => {
    const variants: Array<[string, string]> = [
      ["gray", "bg-slate-100"],
      ["success", "text-c-green-dark"],
      ["warning", "text-c-orange-dark"],
      ["error", "text-c-red-dark"],
      ["info", "text-sky-700"],
      ["neutral", "text-slate-700"]
    ];

    for (const [color, className] of variants) {
      const wrapper = mountTable({ selectAllColor: color });
      const selectAllHeader = wrapper.find("thead th");
      expect(selectAllHeader.classes()).toContain(className);
    }
  });

  it("renders group rows and action header", () => {
    const wrapper = mountTable();
    expect(wrapper.text()).toContain("Transactions a venir");
    expect(wrapper.text()).toContain("Operations");
    expect(wrapper.find("button[type='button']").exists()).toBe(true);
  });

  it("toggles group collapse", async () => {
    const wrapper = mountTable();
    const toggleButton = wrapper.find('button[aria-label="Replier Transactions a venir"]');
    expect(toggleButton.exists()).toBe(true);
    await toggleButton.trigger("click");
    expect(wrapper.find('button[aria-label="Afficher Transactions a venir"]').exists()).toBe(true);
  });

  it("sorts rows by default with asc then desc", async () => {
    const wrapper = mountTable({ pageSize: undefined });

    const headers = wrapper.findAll("th button");
    await headers[0].trigger("click");
    expect(getRenderedRowIds(wrapper)).toEqual(["u-1", "g-1", "g-2"]);

    await headers[0].trigger("click");
    expect(getRenderedRowIds(wrapper)).toEqual(["u-1", "g-2", "g-1"]);
  });

  it("supports custom sort function", async () => {
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: undefined
      },
      slots: {
        header: `
          <BudgetTableHeader
            sortable
            sort-key="amount"
            :sort-fn="(a, b) => Number(b ?? 0) - Number(a ?? 0)"
          >
            Montant
          </BudgetTableHeader>
        `,
        default: `
          <BudgetTableRow row-id="a" :sort-values="{ amount: 2 }"><BudgetTableCell>2</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="b" :sort-values="{ amount: 10 }"><BudgetTableCell>10</BudgetTableCell></BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(getRenderedRowIds(wrapper)).toEqual(["b", "a"]);
  });

  it("emits selection updates for row checkbox and select all", async () => {
    const wrapper = mountTable();

    const rowCheckbox = wrapper.find('tbody input[type="checkbox"]');
    await rowCheckbox.setValue(true);
    expect(wrapper.emitted("update:selected")?.[0]).toEqual([["u-1"]]);

    const headerCheckbox = wrapper.find('thead input[type="checkbox"]');
    await headerCheckbox.setValue(true);
    const last = wrapper.emitted("update:selected")?.at(-1);
    expect(last).toEqual([["u-1", "g-1", "g-2"]]);
  });

  it("removes selections when unchecking row and select all", async () => {
    const wrapper = mountTable({}, ["u-1", "g-1", "g-2"]);

    const rowCheckbox = wrapper.find('tbody input[type="checkbox"]');
    await rowCheckbox.setValue(false);
    expect(wrapper.emitted("update:selected")?.[0]).toEqual([["g-1", "g-2"]]);

    const headerCheckbox = wrapper.find('thead input[type="checkbox"]');
    await headerCheckbox.setValue(false);
    const last = wrapper.emitted("update:selected")?.at(-1);
    expect(last).toEqual([[]]);
  });

  it("sets select-all checkbox indeterminate when partially selected", async () => {
    const wrapper = mountTable({}, ["u-1"]);
    await nextTick();
    await nextTick();

    const headerCheckbox = wrapper.find('thead input[type="checkbox"]').element as HTMLInputElement;
    expect(headerCheckbox.indeterminate).toBe(true);
  });

  it("handles pagination navigation", async () => {
    const wrapper = mountTable();

    const nextButton = wrapper.findAll("button").find((node) => node.text() === "Suivant");
    expect(nextButton).toBeDefined();
    const prevButton = wrapper.findAll("button").find((node) => node.text() === "Precedent");
    expect(prevButton).toBeDefined();
    expect(prevButton!.attributes("disabled")).toBeDefined();
    expect(nextButton!.attributes("disabled")).toBeUndefined();

    await nextButton!.trigger("click");
    expect(prevButton!.attributes("disabled")).toBeUndefined();
    expect(nextButton!.attributes("disabled")).toBeDefined();

    await prevButton!.trigger("click");
    expect(prevButton!.attributes("disabled")).toBeDefined();
    expect(nextButton!.attributes("disabled")).toBeUndefined();
  });

  it("resets pagination to first page when pageSize changes", async () => {
    const wrapper = mountTable({ pageSize: 1 });

    const nextButton = wrapper.findAll("button").find((node) => node.text() === "Suivant");
    expect(nextButton).toBeDefined();
    await nextButton!.trigger("click");

    const prevButton = wrapper.findAll("button").find((node) => node.text() === "Precedent");
    expect(prevButton).toBeDefined();
    expect(prevButton!.attributes("disabled")).toBeUndefined();

    await wrapper.setProps({ pageSize: 2 });
    expect(prevButton!.attributes("disabled")).toBeDefined();
  });

  it("hides pagination when pageSize is not defined", () => {
    const wrapper = mountTable({ pageSize: undefined });
    expect(wrapper.text()).not.toContain("Precedent");
    expect(wrapper.text()).not.toContain("Suivant");
  });

  it("hides pagination when pageSize is zero", () => {
    const wrapper = mountTable({ pageSize: 0 });
    expect(wrapper.text()).not.toContain("Precedent");
    expect(wrapper.text()).not.toContain("Suivant");
  });

  it("hides pagination when pageSize is negative", () => {
    const wrapper = mountTable({ pageSize: -1 });
    expect(wrapper.text()).not.toContain("Precedent");
    expect(wrapper.text()).not.toContain("Suivant");
  });

  it("supports table without selectable column", () => {
    const wrapper = mountTable({ selectable: false });
    expect(wrapper.find('thead input[type="checkbox"]').exists()).toBe(false);
  });

  it("supports info and success group colors", () => {
    const wrapper = mountTable({ pageSize: undefined });
    const groupRows = wrapper.findAll("tbody tr td").filter((cell) =>
      cell.text().includes("Transactions")
    );
    expect(groupRows.some((cell) => cell.classes().includes("text-sky-700"))).toBe(true);
    expect(groupRows.some((cell) => cell.classes().includes("text-c-green-dark"))).toBe(true);
  });

  it("supports warning and error group colors", () => {
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: undefined
      },
      slots: {
        header: `<BudgetTableHeader>Nom</BudgetTableHeader>`,
        default: `
          <BudgetTableGroup title="Warn" color="warning">
            <BudgetTableRow row-id="w"><BudgetTableCell>W</BudgetTableCell></BudgetTableRow>
          </BudgetTableGroup>
          <BudgetTableGroup title="Err" color="error">
            <BudgetTableRow row-id="e"><BudgetTableCell>E</BudgetTableCell></BudgetTableRow>
          </BudgetTableGroup>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableGroup,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    const groupRows = wrapper.findAll("tbody tr td");
    expect(groupRows.some((cell) => cell.classes().includes("text-c-orange-dark"))).toBe(true);
    expect(groupRows.some((cell) => cell.classes().includes("text-c-red-dark"))).toBe(true);
  });

  it("supports rows with missing sort values", async () => {
    const wrapper = mount(BudgetTable, {
      slots: {
        header: `<BudgetTableHeader sortable sort-key="label">Libelle</BudgetTableHeader>`,
        default: `
          <BudgetTableRow row-id="a"><BudgetTableCell>A</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="b" :sort-values="{ label: 'B' }"><BudgetTableCell>B</BudgetTableCell></BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(wrapper.text()).toContain("A");
    expect(wrapper.text()).toContain("B");
  });

  it("handles numeric values provided as strings", async () => {
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: undefined
      },
      slots: {
        header: `<BudgetTableHeader sortable sort-key="amount">Montant</BudgetTableHeader>`,
        default: `
          <BudgetTableRow row-id="a" :sort-values="{ amount: '10,5' }"><BudgetTableCell>A</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="b" :sort-values="{ amount: '2' }"><BudgetTableCell>B</BudgetTableCell></BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(getRenderedRowIds(wrapper)).toEqual(["b", "a"]);
  });

  it("handles numeric values provided as numbers", async () => {
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: undefined
      },
      slots: {
        header: `<BudgetTableHeader sortable sort-key="amount">Montant</BudgetTableHeader>`,
        default: `
          <BudgetTableRow row-id="a" :sort-values="{ amount: 10.5 }"><BudgetTableCell>A</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="b" :sort-values="{ amount: 2 }"><BudgetTableCell>B</BudgetTableCell></BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(getRenderedRowIds(wrapper)).toEqual(["b", "a"]);
  });

  it("handles null and undefined sort values without crashing", async () => {
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: undefined
      },
      slots: {
        header: `<BudgetTableHeader sortable sort-key="amount">Montant</BudgetTableHeader>`,
        default: `
          <BudgetTableRow row-id="a" :sort-values="{ amount: null }"><BudgetTableCell>A</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="b" :sort-values="{ amount: null }"><BudgetTableCell>B</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="c"><BudgetTableCell>C</BudgetTableCell></BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(wrapper.text()).toContain("A");
    expect(wrapper.text()).toContain("B");
    expect(wrapper.text()).toContain("C");
  });

  it("handles null vs non-null values in default sorter", async () => {
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: undefined
      },
      slots: {
        header: `<BudgetTableHeader sortable sort-key="amount">Montant</BudgetTableHeader>`,
        default: `
          <BudgetTableRow row-id="null-row" :sort-values="{ amount: null }"><BudgetTableCell>Null</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="num-row" :sort-values="{ amount: 5 }"><BudgetTableCell>Five</BudgetTableCell></BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(getRenderedRowIds(wrapper)).toEqual(["num-row", "null-row"]);
  });

  it("ignores sort trigger when key is missing", async () => {
    const wrapper = mount(BudgetTable, {
      slots: {
        header: `<BudgetTableHeader sortable>Sans cle</BudgetTableHeader>`,
        default: `<BudgetTableRow row-id="r"><BudgetTableCell>R</BudgetTableCell></BudgetTableRow>`
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(wrapper.text()).toContain("R");
  });

  it("uses default actions header label when slot is omitted", () => {
    const wrapper = mount(BudgetTable, {
      slots: {
        header: `<BudgetTableHeader>Nom</BudgetTableHeader>`,
        default: `
          <BudgetTableRow row-id="row-1">
            <BudgetTableCell>Valeur</BudgetTableCell>
            <template #actions><button type="button">Action</button></template>
          </BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    expect(wrapper.text()).toContain("Actions");
  });

  it("parses groups from array children VNodes", () => {
    const wrapper = mount(BudgetTable, {
      slots: {
        header: () => [h(BudgetTableHeader, null, { default: () => "Nom" })],
        default: () => [
          h(
            BudgetTableGroup,
            { title: "Array Group", collapsible: true, color: "primary" },
            [
              h(
                BudgetTableRow,
                { rowId: "array-1", sortValues: { label: "A" } },
                { default: () => [h(BudgetTableCell, null, { default: () => "A" })] }
              )
            ]
          )
        ]
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableGroup,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    expect(wrapper.text()).toContain("Array Group");
    expect(wrapper.text()).toContain("A");
  });

  it("parses rows wrapped in Fragment nodes", () => {
    const wrapper = mount(BudgetTable, {
      slots: {
        header: () => [h(BudgetTableHeader, null, { default: () => "Nom" })],
        default: () => [
          h(Fragment, null, [
            h(
              BudgetTableRow,
              { rowId: "fragment-row" },
              {
                default: () => [h(BudgetTableCell, null, { default: () => "Fragment row" })]
              }
            )
          ])
        ]
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    expect(wrapper.text()).toContain("Fragment row");
  });

  it("handles groups with non-slot children without crashing", () => {
    const wrapper = mount(BudgetTable, {
      slots: {
        header: () => [h(BudgetTableHeader, null, { default: () => "Nom" })],
        default: () => [h(BudgetTableGroup, { title: "Text Group" }, "just text")]
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableGroup
        }
      }
    });

    expect(wrapper.text()).toContain("Text Group");
  });

  it("ignores non-row nodes and applies default tone when group color is unknown", () => {
    const wrapper = mount(BudgetTable, {
      slots: {
        header: `<BudgetTableHeader>Nom</BudgetTableHeader>`,
        default: `
          <div>Ignore me</div>
          <BudgetTableGroup title="Custom tone" color="custom">
            <BudgetTableRow row-id="row-1"><BudgetTableCell>A</BudgetTableCell></BudgetTableRow>
          </BudgetTableGroup>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableGroup,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    const groupCell = wrapper.findAll("tbody td").find((node) => node.text().includes("Custom tone"));
    expect(groupCell?.classes()).toContain("bg-slate-100");
    expect(wrapper.text()).toContain("A");
  });

  it("handles null values when null is compared as left operand", async () => {
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: undefined
      },
      slots: {
        header: `<BudgetTableHeader sortable sort-key="amount">Montant</BudgetTableHeader>`,
        default: `
          <BudgetTableRow row-id="num-1" :sort-values="{ amount: 10 }"><BudgetTableCell>10</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="num-2" :sort-values="{ amount: 4 }"><BudgetTableCell>4</BudgetTableCell></BudgetTableRow>
          <BudgetTableRow row-id="null-row" :sort-values="{ amount: null }"><BudgetTableCell>Null</BudgetTableCell></BudgetTableRow>
        `
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await wrapper.find("th button").trigger("click");
    expect(getRenderedRowIds(wrapper)).toEqual(["num-2", "num-1", "null-row"]);
  });

  it("handles defensive branch when group cursor cannot resolve group", async () => {
    let callIndex = 0;
    const wrapper = mount(BudgetTable, {
      props: {
        pageSize: 1
      },
      slots: {
        header: `<BudgetTableHeader>Nom</BudgetTableHeader>`,
        default: () => {
          callIndex += 1;
          if (callIndex === 1) {
            return [];
          }
          return [
            h(BudgetTableGroup, { title: "Instable", collapsible: true }, {
              default: () => [
                h(BudgetTableRow, { rowId: "x" }, {
                  default: () => [h(BudgetTableCell, null, { default: () => "X" })]
                })
              ]
            })
          ];
        }
      },
      global: {
        components: {
          BudgetTableHeader,
          BudgetTableGroup,
          BudgetTableRow,
          BudgetTableCell
        }
      }
    });

    await nextTick();
    expect(wrapper.exists()).toBe(true);
  });
});


