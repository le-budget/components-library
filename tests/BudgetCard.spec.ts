import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import BudgetCard from "../src/components/BudgetCard/BudgetCard.vue";

describe("BudgetCard", () => {
  it("renders slot content", () => {
    const wrapper = mount(BudgetCard, {
      slots: { default: "<p>Contenu</p>" }
    });

    expect(wrapper.text()).toContain("Contenu");
  });

  it("applies base classes", () => {
    const wrapper = mount(BudgetCard);
    expect(wrapper.classes()).toContain("rounded-xl");
    expect(wrapper.classes()).toContain("shadow-sm");
  });

  it("renders title", () => {
    const wrapper = mount(BudgetCard, {
      props: { title: "Titre" }
    });

    expect(wrapper.text()).toContain("Titre");
    expect(wrapper.find("h3").exists()).toBe(true);
  });

  it("renders icon slot", () => {
    const wrapper = mount(BudgetCard, {
      slots: { icon: "<span>Icone</span>" }
    });

    expect(wrapper.text()).toContain("Icone");
  });

  it("hides header when empty", () => {
    const wrapper = mount(BudgetCard);
    const header = wrapper.find("section > div");
    expect(header.exists()).toBe(true);
    expect(header.element.style.display).toBe("none");
    expect(wrapper.find("h3").exists()).toBe(false);
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("shows collapse button when collapsible", () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsible: true }
    });

    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("emits update when toggling collapse", async () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsible: true, collapsed: false }
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([true]);
  });

  it("hides content when collapsed", async () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsible: true, collapsed: true },
      slots: { default: "<p>Contenu</p>" },
      global: { stubs: { transition: true } }
    });

    await nextTick();
    const content = wrapper.find("[data-testid='card-content']");
    const button = wrapper.find("button");
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(content.element.style.display).toBe("none");

    await wrapper.setProps({ collapsed: false });
    await nextTick();
    const updated = wrapper.find("[data-testid='card-content']");
    const updatedButton = wrapper.find("button");
    expect(updatedButton.attributes("aria-expanded")).toBe("true");
    expect(updated.element.style.display).toBe("");
  });

  it("toggles internally when uncontrolled", async () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsible: true },
      slots: { default: "<p>Contenu</p>" },
      global: { stubs: { transition: true } }
    });

    await nextTick();
    const content = wrapper.find("[data-testid='card-content']");
    const button = wrapper.find("button");
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(content.element.style.display).toBe("");

    await wrapper.find("button").trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([true]);
    const updated = wrapper.find("[data-testid='card-content']");
    const updatedButton = wrapper.find("button");
    expect(updatedButton.attributes("aria-expanded")).toBe("false");
    expect(updated.element.style.display).toBe("none");
  });

  it("does not toggle when not collapsible", async () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsed: false },
      slots: { default: "<p>Contenu</p>" }
    });

    await nextTick();
    const content = wrapper.find("[data-testid='card-content']");
    expect(content.element.style.display).toBe("");
    await wrapper.trigger("click");
    expect(wrapper.emitted("update:collapsed")).toBeUndefined();
  });

  it("renders header when only collapsible is true", () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsible: true }
    });

    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.find("h3").exists()).toBe(false);
  });

  it("toggles header spacing with collapsed state", async () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsible: true, collapsed: true, title: "Titre" }
    });

    const header = wrapper.find("section > div");
    expect(header.classes()).not.toContain("mb-4");

    await wrapper.setProps({ collapsed: false });
    await nextTick();
    expect(header.classes()).toContain("mb-4");
  });

  it("syncs internal state when collapsed prop appears", async () => {
    const wrapper = mount(BudgetCard, {
      props: { collapsible: true },
      slots: { default: "<p>Contenu</p>" },
      global: { stubs: { transition: true } }
    });

    await nextTick();
    expect(wrapper.find("[data-testid='card-content']").element.style.display).toBe("");

    await wrapper.setProps({ collapsed: true });
    await nextTick();
    expect(wrapper.find("[data-testid='card-content']").element.style.display).toBe("none");
  });
});
