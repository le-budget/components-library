import { mount } from "@vue/test-utils";
import BudgetToastContainer from "../src/components/BudgetToastContainer/BudgetToastContainer.vue";
import { budgetToast } from "../src/components/BudgetToast/budgetToast.store";

describe("BudgetToastContainer", () => {
  beforeEach(() => {
    budgetToast.clear();
  });

  it("does not render container when empty", () => {
    const wrapper = mount(BudgetToastContainer, {
      global: {
        stubs: {
          teleport: true,
          "transition-group": false
        }
      }
    });

    expect(wrapper.find('[data-testid="budget-toast-container"]').exists()).toBe(false);
  });

  it("renders toasts from store", async () => {
    const wrapper = mount(BudgetToastContainer, {
      global: {
        stubs: {
          teleport: true,
          "transition-group": false
        }
      }
    });

    budgetToast.info("Titre 1", "Desc 1");
    budgetToast.success("Titre 2", "Desc 2");
    await wrapper.vm.$nextTick();

    const container = wrapper.find('[data-testid="budget-toast-container"]');
    expect(container.exists()).toBe(true);
    expect(container.text()).toContain("Titre 1");
    expect(container.text()).toContain("Titre 2");
  });

  it("removes toast when child emits close", async () => {
    const wrapper = mount(BudgetToastContainer, {
      global: {
        stubs: {
          teleport: true,
          "transition-group": false
        }
      }
    });

    budgetToast.info("Titre", "Desc", { duration: 0 });
    await wrapper.vm.$nextTick();

    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="budget-toast-container"]').exists()).toBe(false);
  });
});
