import type { InjectionKey, Ref } from "vue";

export type BudgetAccordionContext = {
  multiple: Ref<boolean>;
  spaced: Ref<boolean>;
  isItemOpen: (id: string) => boolean;
  toggleItem: (id: string) => void;
  registerItem: (id: string, button: HTMLButtonElement, defaultOpen: boolean) => void;
  unregisterItem: (id: string) => void;
  focusByStep: (currentId: string, step: -1 | 1) => void;
};

export const budgetAccordionContextKey: InjectionKey<BudgetAccordionContext> =
  Symbol("budget-accordion-context");
