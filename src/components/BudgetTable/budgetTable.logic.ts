import { Comment, Fragment, Text, type VNode } from "vue";
import type { BudgetTableSortDirection, BudgetTableSortFn } from "./tableContext";

export type GroupTone = "primary" | "success" | "warning" | "error" | "info" | "neutral";

export type RowEntry = {
  rowId: string;
  groupKey: string | null;
  node: VNode;
  sortValues: Record<string, unknown>;
  hasActions: boolean;
};

export type GroupEntry = {
  key: string;
  title: string;
  collapsible: boolean;
  color: GroupTone;
  rowIds: string[];
};

export type PaginableUnit =
  | {
      type: "row";
      row: RowEntry;
    }
  | {
      type: "group";
      group: GroupEntry;
      rows: RowEntry[];
    };

type BudgetTableGroupProps = {
  title?: string;
  collapsible?: boolean | string;
  collapsed?: boolean | string;
  color?: GroupTone;
};

type BudgetTableRowProps = {
  rowId?: string;
  rowid?: string;
  "row-id"?: string;
  sortValues?: Record<string, unknown>;
  "sort-values"?: Record<string, unknown>;
};

export function isComponent(node: VNode, component: unknown) {
  return node.type === component;
}

export function flattenNodes(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment || node.type === Text) {
      return [];
    }
    if (node.type === Fragment) {
      const fragmentChildren = Array.isArray(node.children) ? node.children : [];
      return flattenNodes(fragmentChildren as VNode[]);
    }
    return [node];
  });
}

export function getVNodeChildren(node: VNode): VNode[] {
  if (Array.isArray(node.children)) {
    return flattenNodes(node.children as VNode[]);
  }
  if (typeof node.children === "object" && node.children !== null) {
    const scopedSlots = node.children as { default?: () => VNode[] };
    return flattenNodes(scopedSlots.default?.() ?? []);
  }
  return [];
}

export function getBooleanProp(value: unknown, fallback = false) {
  if (value === undefined) {
    return fallback;
  }
  return value === "" || Boolean(value);
}

export function getToneClass(tone: GroupTone) {
  if (tone === "primary") {
    return "bg-c-blue-light/20 text-c-blue-dark dark:bg-c-black-light dark:text-slate-100";
  }
  if (tone === "success") {
    return "bg-c-green/10 text-c-green-dark dark:bg-c-green/20 dark:text-c-green";
  }
  if (tone === "warning") {
    return "bg-c-orange/10 text-c-orange-dark dark:bg-c-orange/20 dark:text-c-orange";
  }
  if (tone === "error") {
    return "bg-c-red/10 text-c-red-dark dark:bg-c-red/20 dark:text-c-red";
  }
  if (tone === "info") {
    return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
  }
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

export function parseRow(
  node: VNode,
  rowComponent: unknown,
  groupKey: string | null,
  fallbackId: string
): RowEntry | null {
  if (!isComponent(node, rowComponent)) {
    return null;
  }

  const propsObject = (node.props ?? {}) as BudgetTableRowProps;
  const rowId = propsObject.rowId ?? propsObject.rowid ?? propsObject["row-id"] ?? fallbackId;
  const rowChildren = node.children as { actions?: () => VNode[] } | null;

  return {
    rowId,
    groupKey,
    node,
    sortValues: propsObject.sortValues ?? propsObject["sort-values"] ?? {},
    hasActions: Boolean(rowChildren?.actions)
  };
}

export function parseContent(
  rootNodes: VNode[],
  groupComponent: unknown,
  rowComponent: unknown,
  collapsedByGroup: Record<string, boolean>
) {
  const rows: RowEntry[] = [];
  const groups: GroupEntry[] = [];
  const nextCollapsedByGroup = { ...collapsedByGroup };
  let rowIndex = 0;

  for (const node of rootNodes) {
    if (isComponent(node, groupComponent)) {
      const groupProps = (node.props ?? {}) as BudgetTableGroupProps;
      const key = `group-${groups.length}-${groupProps.title ?? "groupe"}`;
      const collapsible = getBooleanProp(groupProps.collapsible, false);
      const initialCollapsed = getBooleanProp(groupProps.collapsed, false);

      if (nextCollapsedByGroup[key] === undefined) {
        nextCollapsedByGroup[key] = collapsible ? initialCollapsed : false;
      }

      const children = getVNodeChildren(node);
      const groupRows: RowEntry[] = [];
      for (const childNode of children) {
        const parsedRow = parseRow(childNode, rowComponent, key, `row-${rowIndex}`);
        rowIndex += 1;
        if (parsedRow) {
          rows.push(parsedRow);
          groupRows.push(parsedRow);
        }
      }

      groups.push({
        key,
        title: groupProps.title ?? "Groupe",
        collapsible,
        color: groupProps.color ?? "neutral",
        rowIds: groupRows.map((row) => row.rowId)
      });
      continue;
    }

    const parsedRow = parseRow(node, rowComponent, null, `row-${rowIndex}`);
    rowIndex += 1;
    if (parsedRow) {
      rows.push(parsedRow);
    }
  }

  return {
    rows,
    groups,
    hasActionsColumn: rows.some((row) => row.hasActions),
    collapsedByGroup: nextCollapsedByGroup
  };
}

export function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const normalized = Number(value.replace(/\s/g, "").replace(",", "."));
    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }
  return null;
}

export function compareValues(a: unknown, b: unknown) {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return 1;
  }
  if (b == null) {
    return -1;
  }

  const leftNumber = normalizeNumber(a);
  const rightNumber = normalizeNumber(b);
  if (leftNumber !== null && rightNumber !== null) {
    return leftNumber - rightNumber;
  }

  return String(a).localeCompare(String(b), "fr", { sensitivity: "base" });
}

export function sortedRows(
  rows: RowEntry[],
  activeSortKey: string | null,
  activeSortDirection: BudgetTableSortDirection,
  activeSortFn?: BudgetTableSortFn
) {
  if (!activeSortKey) {
    return rows;
  }

  const sorted = [...rows].sort((left, right) => {
    const leftValue = left.sortValues[activeSortKey];
    const rightValue = right.sortValues[activeSortKey];
    if (activeSortFn) {
      return activeSortFn(leftValue, rightValue);
    }
    return compareValues(leftValue, rightValue);
  });

  if (activeSortDirection === "desc") {
    sorted.reverse();
  }
  return sorted;
}

export function buildPaginableUnits(
  rootNodes: VNode[],
  groups: GroupEntry[],
  rows: RowEntry[],
  groupComponent: unknown,
  rowComponent: unknown,
  activeSortKey: string | null,
  activeSortDirection: BudgetTableSortDirection,
  activeSortFn?: BudgetTableSortFn
): PaginableUnit[] {
  const sortedUngroupedRows = sortedRows(
    rows.filter((row) => row.groupKey === null),
    activeSortKey,
    activeSortDirection,
    activeSortFn
  );
  const sortedRowsByGroup = new Map(
    groups.map((group) => [
      group.key,
      sortedRows(
        rows.filter((row) => row.groupKey === group.key),
        activeSortKey,
        activeSortDirection,
        activeSortFn
      )
    ])
  );

  const units: PaginableUnit[] = [];
  let ungroupedCursor = 0;
  let groupCursor = 0;

  for (const node of rootNodes) {
    if (isComponent(node, groupComponent)) {
      const group = groups[groupCursor];
      groupCursor += 1;
      if (!group) {
        continue;
      }
      units.push({
        type: "group",
        group,
        rows: sortedRowsByGroup.get(group.key) as RowEntry[]
      });
      continue;
    }

    if (isComponent(node, rowComponent)) {
      const row = sortedUngroupedRows[ungroupedCursor];
      ungroupedCursor += 1;
      if (row) {
        units.push({
          type: "row",
          row
        });
      }
    }
  }

  return units;
}

export function getTotalPages(pageSize: number | undefined, totalUnits: number) {
  if (!pageSize || pageSize <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(totalUnits / pageSize));
}

export function getSortDirection(
  key: string | undefined,
  activeSortKey: string | null,
  activeSortDirection: BudgetTableSortDirection
) {
  if (!key || activeSortKey !== key) {
    return null;
  }
  return activeSortDirection;
}

export function getNextSortState(
  payload: { key?: string; sortFn?: BudgetTableSortFn },
  activeSortKey: string | null,
  activeSortDirection: BudgetTableSortDirection
) {
  if (!payload.key) {
    return null;
  }

  if (activeSortKey === payload.key) {
    return {
      key: activeSortKey,
      direction: activeSortDirection === "asc" ? "desc" : "asc",
      sortFn: payload.sortFn
    } as const;
  }

  return {
    key: payload.key,
    direction: "asc",
    sortFn: payload.sortFn
  } as const;
}

export function getPreviousPage(currentPage: number) {
  return currentPage > 1 ? currentPage - 1 : currentPage;
}

export function getNextPage(currentPage: number, totalPages: number) {
  return currentPage < totalPages ? currentPage + 1 : currentPage;
}
