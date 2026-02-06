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

    const medium = mount(BudgetButton, {
      props: { size: "md" },
      slots: { default: "Moyen" }
    });
    expect(medium.classes()).toContain("h-10");

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
          "hover:bg-c-blue-dark",
          "enabled:active:bg-c-blue-active"
        ]
      },
      {
        color: "secondary",
        classes: [
          "border-c-blue",
          "bg-white",
          "text-c-blue-dark",
          "hover:bg-c-blue-dark",
          "hover:text-white",
          "enabled:active:bg-c-blue-active",
          "enabled:active:text-white"
        ]
      },
      {
        color: "ghost",
        classes: [
          "border-transparent",
          "bg-transparent",
          "text-c-blue-dark",
          "hover:bg-c-blue-light/20",
          "enabled:active:bg-c-blue-active/20"
        ]
      },
      {
        color: "primary-success",
        classes: [
          "border-c-green-dark",
          "bg-c-green",
          "text-white",
          "hover:bg-c-green-dark",
          "enabled:active:bg-c-green-active"
        ]
      },
      {
        color: "secondary-success",
        classes: [
          "border-c-green",
          "bg-white",
          "text-c-green-dark",
          "hover:bg-c-green-dark",
          "hover:text-white",
          "enabled:active:bg-c-green-active",
          "enabled:active:text-white"
        ]
      },
      {
        color: "primary-warning",
        classes: [
          "border-c-orange-dark",
          "bg-c-orange",
          "text-white",
          "hover:bg-c-orange-dark",
          "enabled:active:bg-c-orange-active"
        ]
      },
      {
        color: "secondary-warning",
        classes: [
          "border-c-orange",
          "bg-white",
          "text-c-orange-dark",
          "hover:bg-c-orange-dark",
          "hover:text-white",
          "enabled:active:bg-c-orange-active",
          "enabled:active:text-white"
        ]
      },
      {
        color: "primary-error",
        classes: [
          "border-c-red-dark",
          "bg-c-red",
          "text-white",
          "hover:bg-c-red-dark",
          "enabled:active:bg-c-red-active"
        ]
      },
      {
        color: "secondary-error",
        classes: [
          "border-c-red",
          "bg-white",
          "text-c-red-dark",
          "hover:bg-c-red-dark",
          "hover:text-white",
          "enabled:active:bg-c-red-active",
          "enabled:active:text-white"
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
    hidden.findAll("span.inline-flex.items-center").forEach((node) => {
      expect(node.attributes("style")).toContain("display: none");
    });

    const visible = mount(BudgetButton, {
      props: { loading: true, hideIconsOnLoading: false },
      slots: { icon: "<span>Icon</span>", default: "Chargement" }
    });
    expect(visible.text()).toContain("Icon");
  });

  it("renders icon slots when not loading and applies icon size per button size", () => {
    const sm = mount(BudgetButton, {
      props: { size: "sm" },
      slots: { icon: "<span>Icon</span>", default: "Texte" }
    });
    expect(sm.find('span[class*="text-sm"]').exists()).toBe(true);

    const md = mount(BudgetButton, {
      props: { size: "md" },
      slots: { iconRight: "<span>Icon</span>", default: "Texte" }
    });
    expect(md.find('span[class*="text-base"]').exists()).toBe(true);

    const lg = mount(BudgetButton, {
      props: { size: "lg" },
      slots: { icon: "<span>Icon</span>", iconRight: "<span>Icon2</span>", default: "Texte" }
    });
    const lgIcons = lg.findAll('span[class*="text-lg"]');
    expect(lgIcons.length).toBeGreaterThan(0);
  });

  it("does not apply gap when icon-only and applies gap with text", () => {
    const iconOnly = mount(BudgetButton, {
      props: { ariaLabel: "Ajouter" },
      slots: { icon: "<span>Icon</span>" }
    });
    expect(iconOnly.classes()).not.toContain("gap-2");

    const withText = mount(BudgetButton, {
      slots: { icon: "<span>Icon</span>", default: "Texte" }
    });
    expect(withText.classes()).toContain("gap-2");
  });

  it("renders icon wrappers even when no icon slots are provided", () => {
    const wrapper = mount(BudgetButton, {
      slots: { default: "Texte" }
    });
    const iconWrappers = wrapper.findAll("span.inline-flex.items-center");
    expect(iconWrappers.length).toBe(2);
    iconWrappers.forEach((node) => {
      expect(node.text()).toBe("");
    });
  });

  it("renders icon wrappers when loading is false and hides them when loading with hideIconsOnLoading", () => {
    const visible = mount(BudgetButton, {
      props: { loading: false, hideIconsOnLoading: true },
      slots: { icon: "<span>Left</span>", iconRight: "<span>Right</span>", default: "Texte" }
    });
    expect(visible.findAll("span.inline-flex.items-center").length).toBe(2);

    const hidden = mount(BudgetButton, {
      props: { loading: true, hideIconsOnLoading: true },
      slots: { icon: "<span>Left</span>", iconRight: "<span>Right</span>", default: "Texte" }
    });
    const hiddenWrappers = hidden.findAll("span.inline-flex.items-center");
    expect(hiddenWrappers.length).toBe(2);
    hiddenWrappers.forEach((node) => {
      expect(node.attributes("style")).toContain("display: none");
    });
  });
});
