import type { InjectionKey, Slot } from "vue";
import type { BudgetTabItemColor } from "../BudgetTabItem/BudgetTabItem.vue";

export type BudgetTabRegistration = {
  id: string;
  title: string;
  color: BudgetTabItemColor;
  disabled: boolean;
  defaultActive: boolean;
  iconSlot?: Slot;
  contentSlot?: Slot;
};

export type BudgetTabContext = {
  registerItem: (item: BudgetTabRegistration) => void;
  updateItem: (id: string, item: Omit<BudgetTabRegistration, "id">) => void;
  unregisterItem: (id: string) => void;
};

export const budgetTabContextKey: InjectionKey<BudgetTabContext> =
  Symbol("budget-tab-context");
