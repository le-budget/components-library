import type { ComputedRef, InjectionKey } from "vue";

export type BudgetCategoryTone = "neutral" | "success" | "warning" | "error";
export type BudgetCategorySize = "sm" | "md" | "lg";
export type BudgetCategoryBadgeColor = "neutral" | "success" | "warning" | "error";

export const budgetCategoryGridClass =
  "grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.95fr)_100px_100px_108px] lg:gap-4 xl:grid-cols-[minmax(0,1.8fr)_120px_120px_124px]";

export const budgetCategorySizeKey: InjectionKey<ComputedRef<BudgetCategorySize>> =
  Symbol("budget-category-size");

export function resolveBudgetCategoryProgressColor(tone: BudgetCategoryTone) {
  if (tone === "success") {
    return "success";
  }
  if (tone === "warning") {
    return "warning";
  }
  if (tone === "error") {
    return "error";
  }
  return "primary";
}

export function resolveBudgetCategoryAvailableBadgeColor(
  tone: BudgetCategoryTone
): BudgetCategoryBadgeColor {
  if (tone === "success") {
    return "success";
  }

  if (tone === "warning") {
    return "warning";
  }
  if (tone === "error") {
    return "error";
  }

  return "neutral";
}

export function resolveBudgetCategoryItemSize(size: BudgetCategorySize) {
  if (size === "sm") {
    return {
      container: "px-3 py-2",
      innerGrid: "gap-x-2 gap-y-1.5",
      controlGap: "gap-1.5",
      chevronSpacer: "h-5 w-5",
      row: "gap-1.5",
      prefix: "text-sm",
      label: "text-[13px]",
      progressLabel: "text-xs",
      progressPadding: "pt-1",
      amount: "text-[12px]",
      progressThickness: 4,
      checkboxSize: "sm" as const,
      badgeSize: "sm" as const,
      handleButton: "h-5 w-5",
      handleIcon: "text-[10px]"
    };
  }

  if (size === "md") {
    return {
      container: "px-4 py-2.5",
      innerGrid: "gap-x-2.5 gap-y-1.5",
      controlGap: "gap-2",
      chevronSpacer: "h-6 w-6",
      row: "gap-2",
      prefix: "text-base",
      label: "text-[13px]",
      progressLabel: "text-xs",
      progressPadding: "pt-1.5",
      amount: "text-[13px]",
      progressThickness: 4,
      checkboxSize: "md" as const,
      badgeSize: "md" as const,
      handleButton: "h-6 w-6",
      handleIcon: "text-xs"
    };
  }

  return {
    container: "px-5 py-3",
    innerGrid: "gap-x-3 gap-y-1.5",
    controlGap: "gap-2.5",
    chevronSpacer: "h-7 w-7",
    row: "gap-2.5",
    prefix: "text-lg",
    label: "text-[14px]",
    progressLabel: "text-xs",
    progressPadding: "pt-1.5",
    amount: "text-[14px]",
    progressThickness: 5,
    checkboxSize: "lg" as const,
    badgeSize: "lg" as const,
    handleButton: "h-7 w-7",
    handleIcon: "text-sm"
  };
}

export function resolveBudgetCategoryGroupSize(size: BudgetCategorySize) {
  if (size === "sm") {
    return {
      container: "px-3 py-2 text-[13px]",
      controlGap: "gap-1",
      row: "gap-1.5",
      title: "text-[13px]",
      amount: "text-[13px]",
      button: "h-5 w-5",
      icon: "text-[10px]",
      handleButton: "h-5 w-5",
      handleIcon: "text-[10px]",
      checkboxSize: "sm" as const
    };
  }

  if (size === "md") {
    return {
      container: "px-4 py-2.5 text-[14px]",
      controlGap: "gap-1.5",
      row: "gap-2",
      title: "text-[14px]",
      amount: "text-[14px]",
      button: "h-6 w-6",
      icon: "text-xs",
      handleButton: "h-6 w-6",
      handleIcon: "text-xs",
      checkboxSize: "md" as const
    };
  }

  return {
    container: "px-5 py-3 text-[15px]",
    controlGap: "gap-1.5",
    row: "gap-2.5",
    title: "text-[15px]",
    amount: "text-[15px]",
    button: "h-7 w-7",
    icon: "text-sm",
    handleButton: "h-7 w-7",
    handleIcon: "text-sm",
    checkboxSize: "lg" as const
  };
}
