import { mount } from "@vue/test-utils";
import BudgetButton from "../src/components/BudgetButton/BudgetButton.vue";
import BudgetButtonGroup from "../src/components/BudgetButtonGroup/BudgetButtonGroup.vue";

describe("BudgetButtonGroup", () => {
  it("renders a group role and slot content", () => {
    const wrapper = mount(BudgetButtonGroup, {
      slots: {
        default: `
          <BudgetButton>Gauche</BudgetButton>
          <BudgetButton>Droite</BudgetButton>
        `
      },
      global: {
        components: { BudgetButton }
      }
    });

    expect(wrapper.attributes("role")).toBe("group");
    expect(wrapper.findAll("button")).toHaveLength(2);
    expect(wrapper.text()).toContain("Gauche");
    expect(wrapper.text()).toContain("Droite");
  });

  it("applies border and rounding strategy classes", () => {
    const wrapper = mount(BudgetButtonGroup, {
      slots: {
        default: "<BudgetButton>Unique</BudgetButton>"
      },
      global: {
        components: { BudgetButton }
      }
    });

    expect(wrapper.classes()).toContain("[&>*]:rounded-none");
    expect(wrapper.classes()).toContain("[&>*]:border-y-2");
    expect(wrapper.classes()).toContain("[&>*]:border-l");
    expect(wrapper.classes()).toContain("[&>*]:border-r-0");
    expect(wrapper.classes()).toContain("[&>*:first-child]:rounded-l-md");
    expect(wrapper.classes()).toContain("[&>*:first-child]:border-l-2");
    expect(wrapper.classes()).toContain("[&>*:last-child]:rounded-r-md");
    expect(wrapper.classes()).toContain("[&>*:last-child]:border-r-2");
  });
});
