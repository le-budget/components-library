import { mount } from "@vue/test-utils";
import BudgetStatusIcon from "../src/components/BudgetStatusIcon/BudgetStatusIcon.vue";

describe("BudgetStatusIcon", () => {
  it("uses default label for status", () => {
    const wrapper = mount(BudgetStatusIcon, {
      props: { status: "status-success" }
    });

    expect(wrapper.attributes("aria-label")).toBe("Succes");
  });

  it("handles size variants", () => {
    const small = mount(BudgetStatusIcon, {
      props: { status: "status-warning", size: "sm" }
    });
    expect(small.classes()).toContain("text-sm");

    const large = mount(BudgetStatusIcon, {
      props: { status: "status-info", size: "lg" }
    });
    expect(large.classes()).toContain("text-lg");
  });

  it("uses custom label", () => {
    const wrapper = mount(BudgetStatusIcon, {
      props: { status: "status-error", label: "Custom" }
    });

    expect(wrapper.attributes("aria-label")).toBe("Custom");
  });
});
