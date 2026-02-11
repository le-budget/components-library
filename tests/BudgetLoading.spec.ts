import { mount } from "@vue/test-utils";
import BudgetLoading from "../src/components/BudgetLoading/BudgetLoading.vue";

describe("BudgetLoading", () => {
  it("renders default content when loading is false", () => {
    const wrapper = mount(BudgetLoading, {
      slots: {
        default: "<p data-testid='content'>Contenu</p>"
      }
    });

    expect(wrapper.attributes("aria-busy")).toBe("false");
    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true);
    expect(wrapper.findComponent({ name: "BudgetSkeleton" }).exists()).toBe(false);
    expect(wrapper.find(".sr-only").exists()).toBe(false);
  });

  it("renders fallback skeleton and loading label when loading is true", () => {
    const wrapper = mount(BudgetLoading, {
      props: {
        loading: true
      },
      slots: {
        default: "<p data-testid='content'>Contenu</p>"
      }
    });

    expect(wrapper.attributes("aria-busy")).toBe("true");
    expect(wrapper.find('[data-testid="content"]').exists()).toBe(false);
    expect(wrapper.findComponent({ name: "BudgetSkeleton" }).exists()).toBe(true);
    expect(wrapper.findAll(".budget-skeleton__line")).toHaveLength(3);
    expect(wrapper.find(".sr-only").text()).toBe("Chargement en cours");
  });

  it("passes fallback skeleton props", () => {
    const wrapper = mount(BudgetLoading, {
      props: {
        loading: true,
        variant: "image",
        ratio: "4:3",
        width: 240,
        rounded: "lg",
        animation: "shimmer"
      }
    });

    const block = wrapper.find(".budget-skeleton__block");
    expect(block.exists()).toBe(true);
    expect(block.attributes("style")).toContain("aspect-ratio: 4 / 3;");
    expect(block.attributes("style")).toContain("width: 240px;");
    expect(block.classes()).toContain("rounded-lg");
    expect(block.classes()).toContain("budget-skeleton--shimmer");
  });

  it("uses custom loading slot when provided", () => {
    const wrapper = mount(BudgetLoading, {
      props: {
        loading: true,
        loadingLabel: "Veuillez patienter"
      },
      slots: {
        loading: "<p data-testid='custom-loading'>Custom loading</p>",
        default: "<p data-testid='content'>Contenu</p>"
      }
    });

    expect(wrapper.find('[data-testid="custom-loading"]').exists()).toBe(true);
    expect(wrapper.findComponent({ name: "BudgetSkeleton" }).exists()).toBe(false);
    expect(wrapper.find(".sr-only").text()).toBe("Veuillez patienter");
  });

  it("updates rendered content when loading prop changes", async () => {
    const wrapper = mount(BudgetLoading, {
      props: {
        loading: true
      },
      slots: {
        default: "<p data-testid='content'>Contenu</p>"
      }
    });

    expect(wrapper.findComponent({ name: "BudgetSkeleton" }).exists()).toBe(true);

    await wrapper.setProps({ loading: false });

    expect(wrapper.findComponent({ name: "BudgetSkeleton" }).exists()).toBe(false);
    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true);

    await wrapper.setProps({ loading: true, animated: false, variant: "circle", height: 50 });

    const block = wrapper.find(".budget-skeleton__block");
    expect(block.exists()).toBe(true);
    expect(block.attributes("style")).toContain("height: 50px;");
    expect(block.classes()).toContain("rounded-full");
    expect(block.classes()).not.toContain("animate-pulse");
  });
});
