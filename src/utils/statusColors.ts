export const statusColorMap = {
  success: "text-c-green",
  warning: "text-c-orange",
  error: "text-c-red",
  primary: "text-c-blue",
  disabled: "text-slate-700",
  base: "text-slate-300"
} as const;

export type StatusColorName = keyof typeof statusColorMap;
