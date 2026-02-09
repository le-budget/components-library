import { reactive, readonly } from "vue";
import type { StatusIconName } from "../../icons";
import { nextId } from "../../utils/id";

export type BudgetToastVariant = "info" | "warning" | "question" | "error" | "success";
export type BudgetToastColor =
  | "primary"
  | "secondary"
  | "ghost"
  | "primary-success"
  | "secondary-success"
  | "primary-warning"
  | "secondary-warning"
  | "primary-error"
  | "secondary-error";

export interface BudgetToastItem {
  id: string;
  title: string;
  description: string;
  variant: BudgetToastVariant;
  color: BudgetToastColor;
  duration: number;
  icon: StatusIconName | false;
  closeLabel: string;
  pauseOnHover: boolean;
}

export interface BudgetToastOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: BudgetToastVariant;
  color?: BudgetToastColor;
  duration?: number;
  icon?: StatusIconName | false;
  closeLabel?: string;
  pauseOnHover?: boolean;
  visible?: boolean;
}

type BudgetToastShortcutOptions = Omit<BudgetToastOptions, "title" | "description" | "variant">;

const DEFAULT_DURATION_MS = 4000;
const MAX_TOASTS = 10;
const DEFAULT_CLOSE_LABEL = "Fermer la notification";

const variantIconMap: Record<BudgetToastVariant, StatusIconName> = {
  info: "status-info",
  warning: "status-warning",
  question: "status-question",
  error: "status-error",
  success: "status-success"
};

const variantColorMap: Record<BudgetToastVariant, BudgetToastColor> = {
  info: "secondary",
  warning: "secondary-warning",
  question: "primary",
  error: "secondary-error",
  success: "secondary-success"
};

const state = reactive({
  toasts: [] as BudgetToastItem[]
});

function normalizeToast(options: BudgetToastOptions): BudgetToastItem | null {
  if (options.visible === false) {
    return null;
  }

  const variant = options.variant ?? "info";

  return {
    id: options.id ?? nextId("toast"),
    title: options.title,
    description: options.description ?? "",
    variant,
    color: options.color ?? variantColorMap[variant],
    duration: Math.max(0, options.duration ?? DEFAULT_DURATION_MS),
    icon: options.icon ?? variantIconMap[variant],
    closeLabel: options.closeLabel ?? DEFAULT_CLOSE_LABEL,
    pauseOnHover: options.pauseOnHover ?? true
  };
}

function trimToMax() {
  while (state.toasts.length > MAX_TOASTS) {
    state.toasts.shift();
  }
}

function push(options: BudgetToastOptions): string | null {
  const toast = normalizeToast(options);
  if (!toast) {
    return null;
  }

  state.toasts.push(toast);
  trimToMax();
  return toast.id;
}

function remove(id: string) {
  const index = state.toasts.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    state.toasts.splice(index, 1);
  }
}

function clear() {
  state.toasts.splice(0, state.toasts.length);
}

function createToastShortcut(variant: BudgetToastVariant) {
  return (title: string, description = "", options?: BudgetToastShortcutOptions) =>
    push({
      ...options,
      title,
      description,
      variant
    });
}

export const budgetToast = {
  push,
  remove,
  clear,
  info: createToastShortcut("info"),
  warning: createToastShortcut("warning"),
  question: createToastShortcut("question"),
  error: createToastShortcut("error"),
  success: createToastShortcut("success")
};

export function useBudgetToast() {
  return {
    toasts: readonly(state.toasts),
    push: budgetToast.push,
    remove: budgetToast.remove,
    clear: budgetToast.clear,
    info: budgetToast.info,
    warning: budgetToast.warning,
    question: budgetToast.question,
    error: budgetToast.error,
    success: budgetToast.success
  };
}
