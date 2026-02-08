import { Comment, Fragment, h, Text } from "vue";
import {
  buildPaginableUnits,
  compareValues,
  flattenNodes,
  getBooleanProp,
  getNextPage,
  getNextSortState,
  getPreviousPage,
  getSortDirection,
  getToneClass,
  getTotalPages,
  getVNodeChildren,
  normalizeNumber,
  parseContent,
  parseRow,
  sortedRows,
  type GroupEntry,
  type RowEntry
} from "../src/components/BudgetTable/budgetTable.logic";

const GroupComponent = { name: "GroupComponent" };
const RowComponent = { name: "RowComponent" };
const OtherComponent = { name: "OtherComponent" };

function makeRowVNode(props: Record<string, unknown> = {}, withActions = false) {
  return h(
    RowComponent,
    props,
    withActions
      ? {
          default: () => [h("td", "row")],
          actions: () => [h("button", "action")]
        }
      : { default: () => [h("td", "row")] }
  );
}

describe("budgetTable.logic", () => {
  it("flattens comments, text and fragments", () => {
    const nodes = flattenNodes([h(Comment), h(Text, "x"), h("div"), h(Fragment, null, [h("span")])]);
    expect(nodes).toHaveLength(2);
    expect((nodes[0].type as string)).toBe("div");
    expect((nodes[1].type as string)).toBe("span");

    const nonArrayFragment = flattenNodes([h(Fragment, null, "text child")]);
    expect(nonArrayFragment).toEqual([]);
  });

  it("gets vnode children from arrays, slots and non-object children", () => {
    const arrayNode = h("div", [h("span"), h(Comment)]);
    expect(getVNodeChildren(arrayNode)).toHaveLength(1);

    const slotNode = h(GroupComponent, null, { default: () => [h("em")] });
    expect(getVNodeChildren(slotNode)).toHaveLength(1);

    const emptySlotsNode = h(GroupComponent, null, {});
    expect(getVNodeChildren(emptySlotsNode)).toEqual([]);

    const textNode = h("div", "plain");
    expect(getVNodeChildren(textNode)).toEqual([]);
  });

  it("handles boolean props", () => {
    expect(getBooleanProp(undefined, true)).toBe(true);
    expect(getBooleanProp("")).toBe(true);
    expect(getBooleanProp(false, true)).toBe(false);
  });

  it("returns tone classes for all supported tones", () => {
    expect(getToneClass("primary")).toContain("text-c-blue-dark");
    expect(getToneClass("success")).toContain("text-c-green-dark");
    expect(getToneClass("warning")).toContain("text-c-orange-dark");
    expect(getToneClass("error")).toContain("text-c-red-dark");
    expect(getToneClass("info")).toContain("text-sky-700");
    expect(getToneClass("neutral")).toContain("text-slate-700");
  });

  it("parses row with id aliases, sort-values alias and actions", () => {
    const byAlias = parseRow(
      makeRowVNode({ rowid: "id-1", "sort-values": { amount: 42 } }, true),
      RowComponent,
      "g-1",
      "fallback"
    );
    expect(byAlias?.rowId).toBe("id-1");
    expect(byAlias?.groupKey).toBe("g-1");
    expect(byAlias?.sortValues).toEqual({ amount: 42 });
    expect(byAlias?.hasActions).toBe(true);

    const byFallback = parseRow(makeRowVNode(), RowComponent, null, "fallback");
    expect(byFallback?.rowId).toBe("fallback");

    const noPropsRow = parseRow(h(RowComponent), RowComponent, null, "no-props");
    expect(noPropsRow?.rowId).toBe("no-props");

    const notRow = parseRow(h(OtherComponent), RowComponent, null, "x");
    expect(notRow).toBeNull();
  });

  it("parses content with groups and keeps collapse state", () => {
    const rootNodes = [
      makeRowVNode({ "row-id": "u-1", sortValues: { name: "ungrouped" } }),
      h(
        GroupComponent,
        { title: "G1", collapsible: "", collapsed: true, color: "success" },
        [makeRowVNode({ rowId: "g-1" }, true), h("div", "ignored")]
      ),
      h(GroupComponent, null, { default: () => [makeRowVNode({ rowId: "g-2" })] })
    ];

    const parsed = parseContent(rootNodes, GroupComponent, RowComponent, { "group-0-G1": false });
    expect(parsed.rows.map((row) => row.rowId)).toEqual(["u-1", "g-1", "g-2"]);
    expect(parsed.groups).toHaveLength(2);
    expect(parsed.groups[0].title).toBe("G1");
    expect(parsed.groups[1].title).toBe("Groupe");
    expect(parsed.groups[1].color).toBe("neutral");
    expect(parsed.hasActionsColumn).toBe(true);
    expect(parsed.collapsedByGroup["group-0-G1"]).toBe(false);
    expect(parsed.collapsedByGroup["group-1-groupe"]).toBe(false);
  });

  it("normalizes and compares values", () => {
    expect(normalizeNumber(10)).toBe(10);
    expect(normalizeNumber("1 234,50")).toBe(1234.5);
    expect(normalizeNumber("x")).toBeNull();
    expect(normalizeNumber(true)).toBeNull();

    expect(compareValues(null, null)).toBe(0);
    expect(compareValues(null, 1)).toBe(1);
    expect(compareValues(1, null)).toBe(-1);
    expect(compareValues("10", "2")).toBeGreaterThan(0);
    expect(compareValues("beta", "alpha")).toBeGreaterThan(0);
  });

  it("sorts rows with default and custom sorting", () => {
    const rows: RowEntry[] = [
      { rowId: "a", groupKey: null, node: h("tr"), sortValues: { amount: "10" }, hasActions: false },
      { rowId: "b", groupKey: null, node: h("tr"), sortValues: { amount: "2" }, hasActions: false }
    ];

    expect(sortedRows(rows, null, "asc").map((row) => row.rowId)).toEqual(["a", "b"]);
    expect(sortedRows(rows, "amount", "asc").map((row) => row.rowId)).toEqual(["b", "a"]);
    expect(sortedRows(rows, "amount", "desc").map((row) => row.rowId)).toEqual(["a", "b"]);
    expect(
      sortedRows(rows, "amount", "asc", (left, right) => Number(right) - Number(left)).map(
        (row) => row.rowId
      )
    ).toEqual(["a", "b"]);
  });

  it("builds paginable units and handles mismatched group cursor", () => {
    const rows: RowEntry[] = [
      { rowId: "u-1", groupKey: null, node: makeRowVNode({ rowId: "u-1" }), sortValues: { v: 2 }, hasActions: false },
      { rowId: "g-1", groupKey: "group-0-G", node: makeRowVNode({ rowId: "g-1" }), sortValues: { v: 1 }, hasActions: false }
    ];
    const groups: GroupEntry[] = [
      { key: "group-0-G", title: "G", collapsible: true, color: "neutral", rowIds: ["g-1"] }
    ];
    const rootNodes = [
      h(GroupComponent),
      h(GroupComponent),
      makeRowVNode({ rowId: "u-1" }),
      makeRowVNode({ rowId: "u-2" })
    ];

    const units = buildPaginableUnits(
      rootNodes,
      groups,
      rows,
      GroupComponent,
      RowComponent,
      "v",
      "asc"
    );

    expect(units).toHaveLength(2);
    expect(units[0].type).toBe("group");
    expect(units[1].type).toBe("row");
    if (units[1].type === "row") {
      expect(units[1].row.rowId).toBe("u-1");
    }
  });

  it("computes table state helpers", () => {
    expect(getTotalPages(undefined, 10)).toBe(1);
    expect(getTotalPages(0, 10)).toBe(1);
    expect(getTotalPages(3, 10)).toBe(4);

    expect(getSortDirection(undefined, "a", "asc")).toBeNull();
    expect(getSortDirection("b", "a", "asc")).toBeNull();
    expect(getSortDirection("a", "a", "desc")).toBe("desc");

    expect(getNextSortState({}, "a", "asc")).toBeNull();
    expect(getNextSortState({ key: "a" }, "a", "asc")?.direction).toBe("desc");
    expect(getNextSortState({ key: "a" }, "a", "desc")?.direction).toBe("asc");
    expect(getNextSortState({ key: "b" }, "a", "desc")).toEqual({
      key: "b",
      direction: "asc",
      sortFn: undefined
    });

    expect(getPreviousPage(1)).toBe(1);
    expect(getPreviousPage(3)).toBe(2);
    expect(getNextPage(3, 3)).toBe(3);
    expect(getNextPage(2, 3)).toBe(3);
  });
});
