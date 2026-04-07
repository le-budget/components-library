import { mount } from "@vue/test-utils";
import BudgetCategoryGroup from "../src/components/BudgetCategoryGroup/BudgetCategoryGroup.vue";
import BudgetCategoryItem from "../src/components/BudgetCategoryItem/BudgetCategoryItem.vue";

function mountGroup(props: Record<string, unknown> = {}) {
  return mount(BudgetCategoryGroup, {
    props: {
      modelValue: false,
      title: "Factures",
      assigned: "821,07 EUR",
      activity: "-627,23 EUR",
      available: "313,84 EUR",
      ...props
    },
    slots: {
      default: `
        <BudgetCategoryItem
          :model-value="false"
          label="Electricite"
          assigned="301,33 EUR"
          activity="-301,33 EUR"
          available="0,00 EUR"
          :progress="100"
          progress-label="Totalement depense"
        />
      `
    },
    global: {
      components: {
        BudgetCategoryItem
      }
    }
  });
}

describe("BudgetCategoryGroup", () => {
  it("renders the header labels and amounts", () => {
    const wrapper = mountGroup();

    expect(wrapper.text()).toContain("Factures");
    expect(wrapper.text()).toContain("821,07 EUR");
    expect(wrapper.text()).toContain("-627,23 EUR");
    expect(wrapper.text()).toContain("313,84 EUR");
  });

  it("emits update:modelValue when the group checkbox changes", async () => {
    const wrapper = mountGroup();

    await wrapper.find('input[type="checkbox"]').setValue(true);

    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
  });

  it("hides the checkbox when hasCheckbox is false", () => {
    const wrapper = mountGroup({ hasCheckbox: false });

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(1);
  });

  it("renders the drag handle when hasDragHandle is true", () => {
    const wrapper = mountGroup({ hasDragHandle: true });

    expect(wrapper.find('[data-testid="budget-category-group-drag-handle"]').exists()).toBe(true);
  });

  it("emits update:collapsed when the chevron button is clicked", async () => {
    const wrapper = mountGroup();

    const toggleButton = wrapper.find('button[aria-controls]');
    await toggleButton.trigger("click");

    expect(wrapper.emitted("update:collapsed")).toEqual([[true]]);
  });

  it("shows and hides slot content according to collapsed", async () => {
    const wrapper = mountGroup({ collapsed: false });
    const content = wrapper.find('[data-testid="budget-category-group-content"]');
    expect(content.attributes("style") ?? "").not.toContain("display: none");

    await wrapper.setProps({ collapsed: true });
    expect(content.attributes("style")).toContain("display: none");
  });

  it("supports the indeterminate checkbox state", async () => {
    const wrapper = mountGroup({ indeterminate: true });
    await wrapper.vm.$nextTick();

    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("renders the prefix slot", () => {
    const wrapper = mount(BudgetCategoryGroup, {
      props: {
        modelValue: false,
        title: "Credits",
        assigned: "1489,81 EUR",
        activity: "-1374,58 EUR",
        available: "115,23 EUR"
      },
      slots: {
        prefix: "CR",
        default: `<div>Contenu</div>`
      }
    });

    expect(wrapper.find('[data-testid="budget-category-group-prefix"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("CR");
  });

  it("renders the custom dragHandle slot", () => {
    const wrapper = mount(BudgetCategoryGroup, {
      props: {
        modelValue: false,
        title: "Credits",
        assigned: "1489,81 EUR",
        activity: "-1374,58 EUR",
        available: "115,23 EUR",
        hasDragHandle: true
      },
      slots: {
        dragHandle: "DRAG",
        default: `<div>Contenu</div>`
      }
    });

    expect(wrapper.find('[data-testid="budget-category-group-drag-handle"]').text()).toContain("DRAG");
  });

  it("updates the chevron according to the collapsed state", async () => {
    const wrapper = mountGroup({ collapsed: false });
    const toggleButton = wrapper.find('button[aria-controls]');
    expect(toggleButton.attributes("aria-label")).toContain("Replier");

    await wrapper.setProps({ collapsed: true });
    expect(toggleButton.attributes("aria-label")).toContain("Afficher");
  });

  it("defaults to the lg size", () => {
    const wrapper = mountGroup();

    expect(wrapper.attributes("data-size")).toBe("lg");
    expect(wrapper.find('button[aria-controls]').classes()).toContain("h-7");
    expect(wrapper.find('input[type="checkbox"] + span').classes()).toContain("h-6");
  });

  it("applies the expected classes for sm and md sizes", () => {
    const small = mountGroup({ size: "sm" });
    expect(small.attributes("data-size")).toBe("sm");
    expect(small.find('button[aria-controls]').classes()).toContain("h-5");
    expect(small.find('input[type="checkbox"] + span').classes()).toContain("h-4");

    const medium = mountGroup({ size: "md" });
    expect(medium.attributes("data-size")).toBe("md");
    expect(medium.find('button[aria-controls]').classes()).toContain("h-6");
    expect(medium.find('input[type="checkbox"] + span').classes()).toContain("h-5");
  });

  it("passes the group size down to child items", () => {
    const wrapper = mountGroup({ size: "sm" });

    expect(wrapper.findComponent(BudgetCategoryItem).attributes("data-size")).toBe("sm");
  });

  it("keeps a child explicit size over the inherited group size", () => {
    const wrapper = mount(BudgetCategoryGroup, {
      props: {
        modelValue: false,
        title: "Factures",
        assigned: "821,07 EUR",
        activity: "-627,23 EUR",
        available: "313,84 EUR",
        size: "sm"
      },
      slots: {
        default: `
          <BudgetCategoryItem
            :model-value="false"
            size="md"
            label="Electricite"
            assigned="301,33 EUR"
            activity="-301,33 EUR"
            available="0,00 EUR"
            :progress="100"
            progress-label="Totalement depense"
          />
        `
      },
      global: {
        components: {
          BudgetCategoryItem
        }
      }
    });

    expect(wrapper.findComponent(BudgetCategoryItem).attributes("data-size")).toBe("md");
  });
});
