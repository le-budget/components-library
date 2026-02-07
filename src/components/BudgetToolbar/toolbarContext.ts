import type { InjectionKey, Ref } from "vue";

export type BudgetToolbarSize = "sm" | "md" | "lg";
export type BudgetToolbarOrientation = "horizontal" | "vertical";

export type BudgetToolbarContext = {
  size: Ref<BudgetToolbarSize>;
  orientation: Ref<BudgetToolbarOrientation>;
  disabled: Ref<boolean>;
};

export const budgetToolbarContextKey: InjectionKey<BudgetToolbarContext> =
  Symbol("budget-toolbar-context");
