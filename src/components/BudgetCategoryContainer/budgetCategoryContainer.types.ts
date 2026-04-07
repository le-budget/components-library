import type { BudgetCategorySize, BudgetCategoryTone } from "../BudgetCategory/budgetCategory.shared";

export type BudgetCategoryContainerItem = {
  id: string;
  label: string;
  assigned: string;
  activity: string;
  available: string;
  progress: number;
  progressLabel: string;
  tone?: BudgetCategoryTone;
  selected?: boolean;
  hasCheckbox?: boolean;
  disabled?: boolean;
  prefixText?: string;
};

export type BudgetCategoryContainerGroup = {
  id: string;
  title: string;
  assigned: string;
  activity: string;
  available: string;
  selected?: boolean;
  collapsed?: boolean;
  indeterminate?: boolean;
  hasCheckbox?: boolean;
  disabled?: boolean;
  items: BudgetCategoryContainerItem[];
};

export type BudgetCategoryContainerOrderItem = {
  id: string;
  order: number;
};

export type BudgetCategoryContainerOrderEntry = {
  id: string;
  order: number;
  items: BudgetCategoryContainerOrderItem[];
};

export type BudgetCategoryContainerCheckboxColor =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export type BudgetCategoryContainerSize = BudgetCategorySize;
