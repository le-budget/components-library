import { mount } from "@vue/test-utils";
import BudgetNavbarMenu from "../src/components/BudgetNavbarMenu/BudgetNavbarMenu.vue";

describe("BudgetNavbarMenu", () => {
  it("renders default aria-label and responsive layout classes", () => {
    const wrapper = mount(BudgetNavbarMenu, {
      slots: {
        default: "<li>Item</li>"
      }
    });

    expect(wrapper.element.tagName).toBe("UL");
    expect(wrapper.attributes("aria-label")).toBe("Menu principal");
    expect(wrapper.classes()).toContain("flex-col");
    expect(wrapper.classes()).toContain("md:flex-row");
    expect(wrapper.classes()).toContain("md:justify-start");
  });

  it("supports custom aria-label", () => {
    const wrapper = mount(BudgetNavbarMenu, {
      props: {
        ariaLabel: "Navigation secondaire"
      }
    });

    expect(wrapper.attributes("aria-label")).toBe("Navigation secondaire");
  });

  it("supports center and right alignment", () => {
    const centered = mount(BudgetNavbarMenu, {
      props: { align: "center" }
    });
    expect(centered.classes()).toContain("md:justify-center");
    expect(centered.classes()).not.toContain("md:justify-start");

    const right = mount(BudgetNavbarMenu, {
      props: { align: "right" }
    });
    expect(right.classes()).toContain("md:justify-end");
    expect(right.classes()).not.toContain("md:justify-start");
  });
});
