import { watch } from "vue";
import type { Ref } from "vue";
import type { BudgetRadioColor } from "../BudgetRadioGroup/radioGroupContext";

export type BudgetChartColorStep = {
  min: number;
  color: BudgetRadioColor;
};

export type BudgetChartColorConfig = {
  steps: BudgetChartColorStep[];
};

export type BudgetChartColor = BudgetRadioColor | BudgetChartColorConfig;

const variantHexMap: Record<BudgetRadioColor, string> = {
  primary: "#196FAB",
  success: "#27988F",
  warning: "#DE964F",
  error: "#D14B59",
  neutral: "#64748B"
};

const pieVariantOrder: BudgetRadioColor[] = [
  "primary",
  "success",
  "warning",
  "error",
  "neutral"
];

function isColorConfig(color: BudgetChartColor): color is BudgetChartColorConfig {
  return typeof color === "object" && color !== null && "steps" in color;
}

function toRgba(hexColor: string, alpha: number) {
  const clean = hexColor.replace("#", "");
  const red = Number.parseInt(clean.slice(0, 2), 16);
  const green = Number.parseInt(clean.slice(2, 4), 16);
  const blue = Number.parseInt(clean.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function useChartColorResolver(
  colorRef: Ref<BudgetChartColor>,
  componentName: string
) {
  let warnedNoMatchForCurrentConfig = false;

  watch(
    colorRef,
    (nextColor) => {
      warnedNoMatchForCurrentConfig = false;
      if (!isColorConfig(nextColor)) {
        return;
      }

      const seen = new Set<number>();
      let hasDuplicate = false;
      for (const step of nextColor.steps) {
        if (seen.has(step.min)) {
          hasDuplicate = true;
          break;
        }
        seen.add(step.min);
      }

      if (hasDuplicate) {
        console.warn(
          `[${componentName}] Duplicate color steps detected. The last declared step for a given min value will be used.`
        );
      }
    },
    { immediate: true }
  );

  const resolveVariant = (value: number): BudgetRadioColor => {
    const color = colorRef.value;

    if (!isColorConfig(color)) {
      return color;
    }

    const sortedSteps = [...color.steps].sort((a, b) => a.min - b.min);
    let selectedColor: BudgetRadioColor | null = null;

    for (const step of sortedSteps) {
      if (value >= step.min) {
        selectedColor = step.color;
      }
    }

    if (selectedColor !== null) {
      return selectedColor;
    }

    if (!warnedNoMatchForCurrentConfig) {
      console.warn(
        `[${componentName}] No color step matched the current value. Falling back to 'neutral'.`
      );
      warnedNoMatchForCurrentConfig = true;
    }

    return "neutral";
  };

  const resolveHex = (value: number) => variantHexMap[resolveVariant(value)];

  const resolveHexWithAlpha = (value: number, alpha: number) =>
    toRgba(resolveHex(value), alpha);

  return {
    resolveVariant,
    resolveHex,
    resolveHexWithAlpha
  };
}

export function resolveVariantHex(variant: BudgetRadioColor) {
  return variantHexMap[variant];
}

export function buildPiePalette(baseVariant: BudgetRadioColor, count: number) {
  const ordered = [
    baseVariant,
    ...pieVariantOrder.filter((variant) => variant !== baseVariant)
  ];

  return Array.from({ length: count }, (_, index) => {
    const variant = ordered[index % ordered.length];
    return variantHexMap[variant];
  });
}

