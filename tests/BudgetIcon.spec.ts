import { mount } from "@vue/test-utils";
import BudgetIcon from "../src/components/BudgetIcon/BudgetIcon.vue";

describe("BudgetIcon", () => {
  it("uses default label for status", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-success" }
    });

    expect(wrapper.attributes("aria-label")).toBe("Succes");
  });

  it("uses custom label", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-error", label: "Custom" }
    });

    expect(wrapper.attributes("aria-label")).toBe("Custom");
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

  it("uses primary color by default", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-info" }
    });

    expect(wrapper.classes()).toContain("text-c-blue-dark");
    expect(wrapper.classes()).toContain("dark:text-c-black");
  });

  it("applies success color", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-success", color: "success" }
    });

    expect(wrapper.classes()).toContain("text-c-green-dark");
    expect(wrapper.classes()).toContain("dark:text-c-black-success");
  });

  it("applies warning color", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-warning", color: "warning" }
    });

    expect(wrapper.classes()).toContain("text-c-orange-dark");
    expect(wrapper.classes()).toContain("dark:text-c-black-warning");
  });

  it("applies error color", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-error", color: "error" }
    });

    expect(wrapper.classes()).toContain("text-c-red-dark");
    expect(wrapper.classes()).toContain("dark:text-c-black-error");
  });

  it("can be decorative", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-info", decorative: true }
    });

    expect(wrapper.attributes("aria-hidden")).toBe("true");
    expect(wrapper.attributes("aria-label")).toBeUndefined();
    expect(wrapper.attributes("role")).toBeUndefined();
  });

  it("keeps role and label when not decorative", () => {
    const wrapper = mount(BudgetIcon, {
      props: { status: "status-info" }
    });

    expect(wrapper.attributes("aria-hidden")).toBeUndefined();
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Information");
  });
});