import { mount } from "@vue/test-utils";
import BudgetStatus from "../src/components/BudgetStatus/BudgetStatus.vue";

describe("BudgetStatus", () => {
  it("renders default primary status with md size", () => {
    const wrapper = mount(BudgetStatus);
    const root = wrapper.find(".budget-status");
    const dot = wrapper.find(".budget-status__dot");
    const ping = wrapper.find(".budget-status__ping");

    expect(root.classes()).toContain("h-3");
    expect(root.classes()).toContain("w-3");
    expect(dot.classes()).toContain("bg-c-blue");
    expect(dot.classes()).toContain("dark:bg-c-black");
    expect(ping.exists()).toBe(true);
    expect(ping.classes()).toContain("opacity-0");
    expect(ping.classes()).not.toContain("animate-ping");
  });

  it("supports all reduced size variants including xxl", () => {
    const sm = mount(BudgetStatus, { props: { size: "sm" } });
    expect(sm.find(".budget-status").classes()).toContain("h-2");
    expect(sm.find(".budget-status").classes()).toContain("w-2");

    const lg = mount(BudgetStatus, { props: { size: "lg" } });
    expect(lg.find(".budget-status").classes()).toContain("h-4");
    expect(lg.find(".budget-status").classes()).toContain("w-4");

    const xl = mount(BudgetStatus, { props: { size: "xl" } });
    expect(xl.find(".budget-status").classes()).toContain("h-[18px]");
    expect(xl.find(".budget-status").classes()).toContain("w-[18px]");

    const xxl = mount(BudgetStatus, { props: { size: "xxl" } });
    expect(xxl.find(".budget-status").classes()).toContain("h-5");
    expect(xxl.find(".budget-status").classes()).toContain("w-5");
  });

  it("falls back to md size class when size prop is invalid", () => {
    const wrapper = mount(BudgetStatus, {
      props: { size: "invalid-size" as never }
    });

    expect(wrapper.find(".budget-status").classes()).toContain("h-3");
    expect(wrapper.find(".budget-status").classes()).toContain("w-3");
  });

  it("supports all color variants from BudgetRadio", () => {
    const neutral = mount(BudgetStatus, { props: { color: "neutral" } });
    expect(neutral.find(".budget-status__dot").classes()).toContain("bg-slate-500");

    const success = mount(BudgetStatus, { props: { color: "success" } });
    expect(success.find(".budget-status__dot").classes()).toContain("bg-c-green");

    const warning = mount(BudgetStatus, { props: { color: "warning" } });
    expect(warning.find(".budget-status__dot").classes()).toContain("bg-c-orange");

    const error = mount(BudgetStatus, { props: { color: "error" } });
    expect(error.find(".budget-status__dot").classes()).toContain("bg-c-red");
  });

  it("supports bounce and pulse animations on the main dot", () => {
    const bounce = mount(BudgetStatus, {
      props: { animation: "bounce" }
    });
    expect(bounce.find(".budget-status__dot").classes()).toContain("animate-bounce");

    const pulse = mount(BudgetStatus, {
      props: { animation: "pulse" }
    });
    expect(pulse.find(".budget-status__dot").classes()).toContain("animate-pulse");
  });

  it("supports ping animation with an overlay ring", () => {
    const wrapper = mount(BudgetStatus, {
      props: { animation: "ping" }
    });

    expect(wrapper.find(".budget-status__ping").exists()).toBe(true);
    expect(wrapper.find(".budget-status__ping").classes()).toContain("animate-ping");
    expect(wrapper.find(".budget-status__ping").classes()).toContain("opacity-70");
    expect(wrapper.find(".budget-status__dot").classes()).not.toContain("animate-bounce");
    expect(wrapper.find(".budget-status__dot").classes()).not.toContain("animate-pulse");
  });

  it("is decorative by default and becomes announced when label is provided", () => {
    const decorative = mount(BudgetStatus);
    expect(decorative.find(".budget-status").attributes("aria-hidden")).toBe("true");
    expect(decorative.find(".budget-status").attributes("role")).toBeUndefined();

    const labelled = mount(BudgetStatus, {
      props: { label: "Status actif" }
    });
    expect(labelled.find(".budget-status").attributes("aria-hidden")).toBeUndefined();
    expect(labelled.find(".budget-status").attributes("role")).toBe("status");
    expect(labelled.find(".budget-status").attributes("aria-label")).toBe("Status actif");
  });

  it("keeps decorative behavior when label is blank", () => {
    const wrapper = mount(BudgetStatus, {
      props: { label: "   " }
    });

    expect(wrapper.find(".budget-status").attributes("aria-hidden")).toBe("true");
    expect(wrapper.find(".budget-status").attributes("aria-label")).toBeUndefined();
  });
});
