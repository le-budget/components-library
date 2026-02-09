export const statusColorMap = {
  primary: "text-c-blue-dark dark:text-c-black",
  success: "text-c-green-dark dark:text-c-black-success",
  warning: "text-c-orange-dark dark:text-c-black-warning",
  error: "text-c-red-dark dark:text-c-black-error",
  neutral: "text-gray-500",
  white: "text-white"
} as const;

export type StatusColorName = keyof typeof statusColorMap;
