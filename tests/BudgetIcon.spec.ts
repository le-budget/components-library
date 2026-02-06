import { mount } from "@vue/test-utils";
import BudgetIcon from "../src/components/BudgetIcon/BudgetIcon.vue";

describe("BudgetIcon", () => {
  it("uses default label for status", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-success" }
    });

    expect(wrapper.attributes("aria-label")).toBe("Succes");
  });

  it("handles size variants", () => {
    const small = mount(BudgetIcon, {
      props: { status: "status-warning", size: "sm" }
    });
    expect(small.classes()).toContain("text-sm");

    const large = mount(BudgetIcon, {
      props: { status: "status-info", size: "lg" }
    });
    expect(large.classes()).toContain("text-lg");

    const xl = mount(BudgetIcon, {
      props: { status: "status-info", size: "xl" }
    });
    expect(xl.classes()).toContain("text-xl");

    const xxl = mount(BudgetIcon, {
      props: { status: "status-info", size: "xxl" }
    });
    expect(xxl.classes()).toContain("text-2xl");
  });

  it("uses custom label", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-error", label: "Custom" }
    });

    expect(wrapper.attributes("aria-label")).toBe("Custom");
  });

  it("applies color class when provided", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-success", color: "success" }
    });

    expect(wrapper.classes()).toContain("text-c-green");
  });

  it("keeps current text color when no color prop is provided", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-info" }
    });

    const colorClasses = [
      "text-c-green",
      "text-c-orange",
      "text-c-red",
      "text-c-blue",
      "text-slate-700",
      "text-slate-300"
    ];
    colorClasses.forEach((colorClass) => {
      expect(wrapper.classes()).not.toContain(colorClass);
    });
  });
});
