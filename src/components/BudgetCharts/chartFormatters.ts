const amountFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const dayMonthFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit"
});

export function formatEuroAmount(value: number) {
  const normalized = amountFormatter.format(value).replace(/\u202f/g, " ");
  return `${normalized}\u00a0€`;
}

export function formatDayMonth(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  return dayMonthFormatter.format(date);
}

export function shouldDisplayXAxisLabel(
  index: number,
  totalCount: number,
  maxLabels: number
) {
  if (maxLabels <= 0 || totalCount <= maxLabels) {
    return true;
  }

  const step = Math.ceil(totalCount / maxLabels);

  return index % step === 0 || index === totalCount - 1;
}

