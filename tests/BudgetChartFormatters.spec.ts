import { formatDayMonth, formatEuroAmount, shouldDisplayXAxisLabel } from "../src/components/BudgetCharts/chartFormatters";

describe("chartFormatters", () => {
  it("formats euro amounts with french locale and non-breaking euro separator", () => {
    expect(formatEuroAmount(1000)).toBe("1 000,00\u00a0€");
    expect(formatEuroAmount(-12.5)).toBe("-12,50\u00a0€");
  });

  it("formats ISO dates in dd/mm", () => {
    expect(formatDayMonth("2026-02-09")).toBe("09/02");
  });

  it("returns input string when date is invalid", () => {
    expect(formatDayMonth("not-a-date")).toBe("not-a-date");
  });

  it("returns empty string for invalid Date object", () => {
    expect(formatDayMonth(new Date("invalid"))).toBe("");
  });

  it("shows all labels when maxLabels is <= 0", () => {
    expect(shouldDisplayXAxisLabel(0, 10, 0)).toBe(true);
  });

  it("shows all labels when totalCount is already small", () => {
    expect(shouldDisplayXAxisLabel(2, 4, 6)).toBe(true);
  });

  it("thins labels by step while always showing the last label", () => {
    expect(shouldDisplayXAxisLabel(0, 10, 4)).toBe(true);
    expect(shouldDisplayXAxisLabel(1, 10, 4)).toBe(false);
    expect(shouldDisplayXAxisLabel(3, 10, 4)).toBe(true);
    expect(shouldDisplayXAxisLabel(9, 10, 4)).toBe(true);
  });
});

