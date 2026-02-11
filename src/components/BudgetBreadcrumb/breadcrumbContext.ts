import type { InjectionKey, Slot } from "vue";

export type BudgetBreadcrumbRegistration = {
  id: string;
  label: string;
  href?: string;
  iconSlot?: Slot;
};

export type BudgetBreadcrumbContext = {
  registerItem: (item: BudgetBreadcrumbRegistration) => void;
  updateItem: (
    id: string,
    item: Omit<BudgetBreadcrumbRegistration, "id">
  ) => void;
  unregisterItem: (id: string) => void;
};

export const budgetBreadcrumbContextKey: InjectionKey<BudgetBreadcrumbContext> =
  Symbol("budget-breadcrumb-context");
