import { mount } from "@vue/test-utils";
import BudgetBadge from "../src/components/BudgetBadge/BudgetBadge.vue";

describe("BudgetBadge", () => {
  it("renders text and color variants", () => {
    const cases = [
      {
        color: "primary",
        classes: [
          "bg-c-blue",
          "text-white",
          "border-c-blue-dark",
          "hover:bg-c-blue-active"
        ]
      },
      {
        color: "secondary",
        classes: [
          "bg-white",
          "text-c-blue-dark",
          "border-c-blue",
          "hover:bg-c-blue-active",
          "hover:text-white"
        ]
      },
      {
        color: "ghost",
        classes: [
          "bg-transparent",
          "text-c-blue-dark",
          "border-transparent",
          "hover:bg-c-blue-active/20"
        ]
      },
      {
        color: "success",
        classes: [
          "bg-c-green",
          "text-white",
          "border-c-green-dark",
          "hover:bg-c-green-active"
        ]
      },
      {
        color: "warning",
        classes: [
          "bg-c-orange",
          "text-white",
          "border-c-orange-dark",
          "hover:bg-c-orange-active"
        ]
      },
      {
        color: "error",
        classes: [
          "bg-c-red",
          "text-white",
          "border-c-red-dark",
          "hover:bg-c-red-active"
        ]
      }
    ] as const;

    for (const { color, classes } of cases) {
      const wrapper = mount(BudgetBadge, {
        props: { text: "Actif", color }
      });

      expect(wrapper.text()).toBe("Actif");
      for (const className of classes) {
        expect(wrapper.classes()).toContain(className);
      }
    }
  });

  it("applies size variants", () => {
    const xs = mount(BudgetBadge, {
      props: { text: "XS", size: "xs" }
    });
    expect(xs.classes()).toContain("text-[11px]");

    const lg = mount(BudgetBadge, {
      props: { text: "LG", size: "lg" }
    });
    expect(lg.classes()).toContain("text-sm");

    const md = mount(BudgetBadge, {
      props: { text: "MD", size: "md" }
    });
    expect(md.classes()).toContain("text-[13px]");
  });

  it("renders icon slots", () => {
    const wrapper = mount(BudgetBadge, {
      props: { text: "Icones" },
      slots: {
        icon: "<span>Left</span>",
        iconRight: "<span>Right</span>"
      }
    });

    expect(wrapper.text()).toContain("Left");
    expect(wrapper.text()).toContain("Right");
  });

  it("renders only one icon slot when provided", () => {
    const leftOnly = mount(BudgetBadge, {
      props: { text: "LeftOnly" },
      slots: {
        icon: "<span>Left</span>"
      }
    });
    expect(leftOnly.text()).toContain("Left");
    expect(leftOnly.text()).not.toContain("Right");

    const rightOnly = mount(BudgetBadge, {
      props: { text: "RightOnly" },
      slots: {
        iconRight: "<span>Right</span>"
      }
    });
    expect(rightOnly.text()).toContain("Right");
    expect(rightOnly.text()).not.toContain("Left");
  });

  it("hides icon wrappers when no slots are provided", () => {
    const wrapper = mount(BudgetBadge, {
      props: { text: "SansIcone" }
    });

    const iconWrappers = wrapper.findAll("span.inline-flex.items-center.text-xs");
    expect(iconWrappers.length).toBe(2);
    iconWrappers.forEach((node) => {
      expect(node.attributes("style")).toContain("display: none");
    });
  });

  it("applies icon size for lg badges", () => {
    const wrapper = mount(BudgetBadge, {
      props: { text: "LG", size: "lg" },
      slots: {
        icon: "<span>Left</span>",
        iconRight: "<span>Right</span>"
      }
    });

    const iconWrappers = wrapper.findAll("span > span.inline-flex.items-center");
    expect(iconWrappers.length).toBeGreaterThan(0);
    iconWrappers.forEach((node) => {
      expect(node.classes()).toContain("text-lg");
    });
  });
});
