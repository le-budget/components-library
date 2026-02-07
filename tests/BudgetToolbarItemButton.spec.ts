import { mount } from "@vue/test-utils";
import { Comment, Text, h } from "vue";
import BudgetToolbar from "../src/components/BudgetToolbar/BudgetToolbar.vue";
import BudgetToolbarItem from "../src/components/BudgetToolbarItem/BudgetToolbarItem.vue";
import BudgetToolbarItemButton from "../src/components/BudgetToolbarItemButton/BudgetToolbarItemButton.vue";

describe("BudgetToolbarItemButton", () => {
  it("uses md size by default without toolbar context", () => {
    const wrapper = mount(BudgetToolbarItemButton, {
      slots: { default: "Action" }
    });

    expect(wrapper.find("button").classes()).toContain("h-10");
  });

  it("inherits size from toolbar and allows explicit override", () => {
    const inherited = mount(BudgetToolbar, {
      props: { size: "lg" },
      slots: {
        default: `
          <BudgetToolbarItem>
            <BudgetToolbarItemButton>Action</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        `
      },
      global: {
        components: { BudgetToolbarItem, BudgetToolbarItemButton }
      }
    });
    expect(inherited.find("button").classes()).toContain("h-12");

    const overridden = mount(BudgetToolbar, {
      props: { size: "lg" },
      slots: {
        default: `
          <BudgetToolbarItem>
            <BudgetToolbarItemButton size="sm">Action</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        `
      },
      global: {
        components: { BudgetToolbarItem, BudgetToolbarItemButton }
      }
    });
    expect(overridden.find("button").classes()).toContain("h-8");
  });

  it("uses disabled from prop and toolbar", () => {
    const ownDisabled = mount(BudgetToolbarItemButton, {
      props: { disabled: true },
      slots: { default: "Action" }
    });
    expect(ownDisabled.find("button").attributes("disabled")).toBeDefined();

    const toolbarDisabled = mount(BudgetToolbar, {
      props: { disabled: true },
      slots: {
        default: `
          <BudgetToolbarItem>
            <BudgetToolbarItemButton>Action</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        `
      },
      global: {
        components: { BudgetToolbarItem, BudgetToolbarItemButton }
      }
    });
    expect(toolbarDisabled.find("button").attributes("disabled")).toBeDefined();
  });

  it("applies active class and vertical layout class from toolbar", () => {
    const wrapper = mount(BudgetToolbar, {
      props: { orientation: "vertical" },
      slots: {
        default: `
          <BudgetToolbarItem>
            <BudgetToolbarItemButton active>Action</BudgetToolbarItemButton>
          </BudgetToolbarItem>
        `
      },
      global: {
        components: { BudgetToolbarItem, BudgetToolbarItemButton }
      }
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("w-full");
    expect(button.classes()).toContain("ring-2");
  });

  it("emits click and renders icon slots", async () => {
    const wrapper = mount(BudgetToolbarItemButton, {
      slots: {
        icon: "<span>Left</span>",
        default: "Action",
        iconRight: "<span>Right</span>"
      }
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
    expect(wrapper.text()).toContain("Left");
    expect(wrapper.text()).toContain("Action");
    expect(wrapper.text()).toContain("Right");
  });

  it("removes gap when icon-only", () => {
    const wrapper = mount(BudgetToolbarItemButton, {
      props: { ariaLabel: "Icon only" },
      slots: {
        icon: "<span>Icon</span>"
      }
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("gap-0");
    expect(button.classes()).not.toContain("gap-2");
  });

  it("handles default slot comments and vnode children for gap behavior", () => {
    const withCommentOnly = mount(BudgetToolbarItemButton, {
      props: { ariaLabel: "Icon only" },
      slots: {
        icon: "<span>Icon</span>",
        default: () => [h(Comment)]
      }
    });
    expect(withCommentOnly.find("button").classes()).toContain("gap-0");

    const withElementText = mount(BudgetToolbarItemButton, {
      slots: {
        icon: "<span>Icon</span>",
        default: () => [h("span", "Texte")]
      }
    });
    expect(withElementText.find("button").classes()).not.toContain("gap-0");

    const withEmptyElement = mount(BudgetToolbarItemButton, {
      slots: {
        icon: "<span>Icon</span>",
        default: () => [h("span")]
      }
    });
    expect(withEmptyElement.find("button").classes()).not.toContain("gap-0");
  });

  it("covers text-node and iconRight-only branches for gap resolution", () => {
    const withWhitespaceTextAndIconRight = mount(BudgetToolbarItemButton, {
      props: { ariaLabel: "Icon only" },
      slots: {
        iconRight: "<span>Icon</span>",
        default: () => [h(Text, "   ")]
      }
    });
    expect(withWhitespaceTextAndIconRight.find("button").classes()).toContain("gap-0");

    const withTextNode = mount(BudgetToolbarItemButton, {
      slots: {
        icon: "<span>Icon</span>",
        default: () => [h(Text, "Texte")]
      }
    });
    expect(withTextNode.find("button").classes()).not.toContain("gap-0");
  });
});
