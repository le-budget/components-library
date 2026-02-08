import type { InjectionKey, Ref } from "vue";

export type BudgetTableSortDirection = "asc" | "desc";
export type BudgetTableSortFn = (a: unknown, b: unknown) => number;

export type BudgetTableContext = {
  selectable: Ref<boolean>;
  hasActionsColumn: Ref<boolean>;
  activeSortKey: Ref<string | null>;
  activeSortDirection: Ref<BudgetTableSortDirection>;
  getSortDirection: (key?: string) => BudgetTableSortDirection | null;
  toggleSort: (payload: { key?: string; sortFn?: BudgetTableSortFn }) => void;
  isRowSelected: (rowId: string) => boolean;
  toggleRowSelection: (rowId: string, checked: boolean) => void;
};

export const budgetTableContextKey: InjectionKey<BudgetTableContext> =
  Symbol("budget-table-context");

