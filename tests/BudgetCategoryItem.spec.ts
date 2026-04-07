import { computed } from "vue";
import { mount } from "@vue/test-utils";
import BudgetCategoryItem from "../src/components/BudgetCategoryItem/BudgetCategoryItem.vue";
import { budgetCategorySizeKey } from "../src/components/BudgetCategory/budgetCategory.shared";

function mountItem(props: Record<string, unknown> = {}) {
  return mount(BudgetCategoryItem, {
    props: {
      modelValue: false,
      label: "Internet et mobiles",
      assigned: "201,96 EUR",
      activity: "-126,98 EUR",
      available: "74,98 EUR",
      progress: 63,
      progressLabel: "Depense 126,98 EUR sur 201,96 EUR",
      ...props
    }
  });
}

describe("BudgetCategoryItem", () => {
  it("renders labels and formatted amounts", () => {
    const wrapper = mountItem();

    expect(wrapper.text()).toContain("Internet et mobiles");
    expect(wrapper.text()).toContain("201,96 EUR");
    expect(wrapper.text()).toContain("-126,98 EUR");
    expect(wrapper.text()).toContain("74,98 EUR");
  });

  it("renders the progress label", () => {
    const wrapper = mountItem();
    expect(wrapper.text()).toContain("Depense 126,98 EUR sur 201,96 EUR");
  });

  it("clamps progress to the 0-100 range", () => {
    const low = mountItem({ progress: -10 });
    expect(low.find('[role="progressbar"]').attributes("aria-valuenow")).toBe("0");

    const high = mountItem({ progress: 180 });
    expect(high.find('[role="progressbar"]').attributes("aria-valuenow")).toBe("100");
  });

  it("emits update:modelValue when checkbox changes", async () => {
    const wrapper = mountItem();

    await wrapper.find('input[type="checkbox"]').setValue(true);

    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
  });

  it("hides the checkbox when hasCheckbox is false", () => {
    const wrapper = mountItem({ hasCheckbox: false });

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
  });

  it("renders the drag handle when hasDragHandle is true", () => {
    const wrapper = mountItem({ hasDragHandle: true });

    expect(wrapper.find('[data-testid="budget-category-item-drag-handle"]').exists()).toBe(true);
  });

  it("renders the prefix slot", () => {
    const wrapper = mount(BudgetCategoryItem, {
      props: {
        modelValue: false,
        label: "Eau",
        assigned: "30,00 EUR",
        activity: "0,00 EUR",
        available: "150,00 EUR",
        progress: 20,
        progressLabel: "Finance"
      },
      slots: {
        prefix: "EAU"
      }
    });

    expect(wrapper.find('[data-testid="budget-category-item-prefix"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("EAU");
  });

  it("renders the custom dragHandle slot", () => {
    const wrapper = mount(BudgetCategoryItem, {
      props: {
        modelValue: false,
        label: "Eau",
        assigned: "30,00 EUR",
        activity: "0,00 EUR",
        available: "150,00 EUR",
        progress: 20,
        progressLabel: "Finance",
        hasDragHandle: true
      },
      slots: {
        dragHandle: "DRAG"
      }
    });

    expect(wrapper.find('[data-testid="budget-category-item-drag-handle"]').text()).toContain("DRAG");
  });

  it("applies the correct tone styles", () => {
    const success = mountItem({ tone: "success" });
    expect(success.find('[data-testid="budget-category-item-available"]').classes()).toContain("bg-c-green");
    expect(success.find('[role="progressbar"] div').classes()).toContain("bg-c-green-dark");

    const warning = mountItem({ tone: "warning" });
    expect(warning.find('[data-testid="budget-category-item-available"]').classes()).toContain("bg-c-orange");
    expect(warning.find('[role="progressbar"] div').classes()).toContain("bg-c-orange-dark");

    const error = mountItem({ tone: "error" });
    expect(error.find('[data-testid="budget-category-item-available"]').classes()).toContain("bg-c-red");
    expect(error.find('[role="progressbar"] div').classes()).toContain("bg-c-red-dark");

    const neutral = mountItem({ tone: "neutral" });
    expect(neutral.find('[data-testid="budget-category-item-available"]').classes()).toContain("bg-slate-100");
    expect(neutral.find('[role="progressbar"] div').classes()).toContain("bg-c-blue-dark");
  });

  it("defaults to the lg size", () => {
    const wrapper = mountItem();

    expect(wrapper.attributes("data-size")).toBe("lg");
    expect(wrapper.classes()).toContain("px-5");
    expect(wrapper.find('input[type="checkbox"] + span').classes()).toContain("h-6");
    expect(wrapper.find('[role="progressbar"]').attributes("style")).toContain("height: 5px;");
    expect(wrapper.find('[data-testid="budget-category-item-available"]').classes()).toContain("text-[12px]");
  });

  it("applies the expected classes for sm and md sizes", () => {
    const small = mountItem({ size: "sm" });
    expect(small.attributes("data-size")).toBe("sm");
    expect(small.classes()).toContain("px-3");
    expect(small.find('input[type="checkbox"] + span').classes()).toContain("h-4");
    expect(small.find('[role="progressbar"]').attributes("style")).toContain("height: 4px;");
    expect(small.find('[data-testid="budget-category-item-available"]').classes()).toContain("text-[10px]");

    const medium = mountItem({ size: "md" });
    expect(medium.attributes("data-size")).toBe("md");
    expect(medium.classes()).toContain("px-4");
    expect(medium.find('input[type="checkbox"] + span').classes()).toContain("h-5");
    expect(medium.find('[role="progressbar"]').attributes("style")).toContain("height: 4px;");
    expect(medium.find('[data-testid="budget-category-item-available"]').classes()).toContain("text-[11px]");
  });

  it("inherits the group size when no local size is provided", () => {
    const wrapper = mount({
      components: { BudgetCategoryItem },
      template: `
        <BudgetCategoryItem
          :model-value="false"
          label="Internet"
          assigned="201,96 EUR"
          activity="-126,98 EUR"
          available="74,98 EUR"
          :progress="63"
          progress-label="Depense 126,98 EUR sur 201,96 EUR"
        />
      `
    }, {
      global: {
        provide: {
          [budgetCategorySizeKey]: computed(() => "sm")
        }
      }
    });

    expect(wrapper.findComponent(BudgetCategoryItem).attributes("data-size")).toBe("sm");
  });

  it("prefers the local size over the inherited group size", () => {
    const wrapper = mount({
      components: { BudgetCategoryItem },
      template: `
        <BudgetCategoryItem
          :model-value="false"
          size="md"
          label="Internet"
          assigned="201,96 EUR"
          activity="-126,98 EUR"
          available="74,98 EUR"
          :progress="63"
          progress-label="Depense 126,98 EUR sur 201,96 EUR"
        />
      `
    }, {
      global: {
        provide: {
          [budgetCategorySizeKey]: computed(() => "sm")
        }
      }
    });

    expect(wrapper.findComponent(BudgetCategoryItem).attributes("data-size")).toBe("md");
  });
});
