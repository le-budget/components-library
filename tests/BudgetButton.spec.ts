import { mount } from "@vue/test-utils";
import BudgetButton from "../src/components/BudgetButton/BudgetButton.vue";

describe("BudgetButton", () => {
  it("renders content", () => {
    const wrapper = mount(BudgetButton, {
      slots: { default: "Valider" }
    });

    expect(wrapper.text()).toContain("Valider");
  });

  it("handles loading and disabled state", () => {
    const wrapper = mount(BudgetButton, {
      props: { loading: true },
      slots: { default: "Chargement" }
    });

    expect(wrapper.attributes("aria-busy")).toBe("true");
    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("applies size styles", () => {
    const small = mount(BudgetButton, {
      props: { size: "sm" },
      slots: { default: "Petit" }
    });
    expect(small.classes()).toContain("h-8");

    const large = mount(BudgetButton, {
      props: { size: "lg" },
      slots: { default: "Grand" }
    });
    expect(large.classes()).toContain("h-12");
  });

  it("applies color variants", () => {
    const cases = [
      {
        color: "primary",
        classes: [
          "border-c-blue-dark",
          "bg-c-blue",
          "text-white",
          "hover:bg-c-blue-dark"
        ]
      },
      {
        color: "secondary",
        classes: [
          "border-c-blue",
          "bg-white",
          "text-c-blue-dark",
          "hover:bg-c-blue-dark",
          "hover:text-white"
        ]
      },
      {
        color: "ghost",
        classes: [
          "border-transparent",
          "bg-transparent",
          "text-c-blue-dark",
          "hover:bg-c-blue-light/20"
        ]
      },
      {
        color: "primary-success",
        classes: [
          "border-c-green-dark",
          "bg-c-green",
          "text-white",
          "hover:bg-c-green-dark"
        ]
      },
      {
        color: "secondary-success",
        classes: [
          "border-c-green",
          "bg-white",
          "text-c-green-dark",
          "hover:bg-c-green-dark",
          "hover:text-white"
        ]
      },
      {
        color: "primary-warning",
        classes: [
          "border-c-orange-dark",
          "bg-c-orange",
          "text-white",
          "hover:bg-c-orange-dark"
        ]
      },
      {
        color: "secondary-warning",
        classes: [
          "border-c-orange",
          "bg-white",
          "text-c-orange-dark",
          "hover:bg-c-orange-dark",
          "hover:text-white"
        ]
      },
      {
        color: "primary-error",
        classes: [
          "border-c-red-dark",
          "bg-c-red",
          "text-white",
          "hover:bg-c-red-dark"
        ]
      },
      {
        color: "secondary-error",
        classes: [
          "border-c-red",
          "bg-white",
          "text-c-red-dark",
          "hover:bg-c-red-dark",
          "hover:text-white"
        ]
      }
    ] as const;

    for (const { color, classes } of cases) {
      const wrapper = mount(BudgetButton, {
        props: { color },
        slots: { default: "Test" }
      });
      for (const className of classes) {
        expect(wrapper.classes()).toContain(className);
      }
    }
  });

  it("hides icons on loading by default and can show them when disabled", () => {
    const hidden = mount(BudgetButton, {
      props: { loading: true },
      slots: { icon: "<span>Icon</span>", default: "Chargement" }
    });
    expect(hidden.text()).toContain("Chargement");
    expect(hidden.text()).not.toContain("Icon");

    const visible = mount(BudgetButton, {
      props: { loading: true, hideIconsOnLoading: false },
      slots: { icon: "<span>Icon</span>", default: "Chargement" }
    });
    expect(visible.text()).toContain("Icon");
  });
});
