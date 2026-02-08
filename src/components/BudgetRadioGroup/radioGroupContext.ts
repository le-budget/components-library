import type { ComputedRef, InjectionKey } from "vue";

export type BudgetRadioColor =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "neutral";
export type BudgetRadioSize = "sm" | "md" | "lg";
export type BudgetRadioValue = string | number | boolean | null;

export type BudgetRadioGroupContext = {
  name: ComputedRef<string | undefined>;
  modelValue: ComputedRef<BudgetRadioValue>;
  disabled: ComputedRef<boolean>;
  color: ComputedRef<BudgetRadioColor>;
  size: ComputedRef<BudgetRadioSize>;
  error: ComputedRef<boolean>;
  describedBy: ComputedRef<string | undefined>;
  isSelected: (value: BudgetRadioValue) => boolean;
  selectValue: (value: BudgetRadioValue) => void;
  registerRadio: (input: HTMLInputElement) => void;
  unregisterRadio: (input: HTMLInputElement) => void;
  focusByStep: (current: HTMLInputElement, step: -1 | 1) => void;
};

export const budgetRadioGroupKey: InjectionKey<BudgetRadioGroupContext> =
  Symbol("budget-radio-group");
