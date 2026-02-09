import { mount } from "@vue/test-utils";
import BudgetNavbarMenuItem from "../src/components/BudgetNavbarMenuItem/BudgetNavbarMenuItem.vue";

describe("BudgetNavbarMenuItem", () => {
  it("renders default classes and no aria-disabled", () => {
    const wrapper = mount(BudgetNavbarMenuItem, {
      slots: {
        default: "<a href=\"#\">Accueil</a>"
      }
    });

    expect(wrapper.element.tagName).toBe("LI");
    expect(wrapper.classes()).toContain("w-full");
    expect(wrapper.classes()).toContain("md:w-auto");
    expect(wrapper.classes()).toContain("hover:bg-slate-100");
    expect(wrapper.attributes("aria-disabled")).toBeUndefined();
  });

  it("applies active styles", () => {
    const wrapper = mount(BudgetNavbarMenuItem, {
      props: {
        active: true
      },
      slots: {
        default: "<a href=\"#\">Transactions</a>"
      }
    });

    expect(wrapper.classes()).toContain("bg-c-blue-light/25");
    expect(wrapper.classes()).toContain("text-c-blue-dark");
  });

  it("applies disabled state and aria-disabled", () => {
    const wrapper = mount(BudgetNavbarMenuItem, {
      props: {
        disabled: true
      },
      slots: {
        default: "<a href=\"#\">Admin</a>"
      }
    });

    expect(wrapper.classes()).toContain("pointer-events-none");
    expect(wrapper.classes()).toContain("cursor-not-allowed");
    expect(wrapper.attributes("aria-disabled")).toBe("true");
  });
});