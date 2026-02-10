import { mount } from "@vue/test-utils";
import { defineComponent, h, inject, nextTick, onMounted, ref } from "vue";
import BudgetAccordion from "../src/components/BudgetAccordion/BudgetAccordion.vue";
import BudgetAccordionItem from "../src/components/BudgetAccordionItem/BudgetAccordionItem.vue";
import { budgetAccordionContextKey } from "../src/components/BudgetAccordion/accordionContext";

describe("BudgetAccordion", () => {
  it("renders with grouped style by default and supports spaced layout", () => {
    const grouped = mount(BudgetAccordion, {
      slots: { default: "<div>Item</div>" }
    });
    expect(grouped.classes()).toContain("rounded-xl");

    const spaced = mount(BudgetAccordion, {
      props: { spaced: true },
      slots: { default: "<div>Item</div>" }
    });
    expect(spaced.classes()).toContain("gap-[10px]");
    expect(spaced.classes()).not.toContain("overflow-hidden");
  });

  it("keeps only one opened item in single mode", async () => {
    const wrapper = mount(BudgetAccordion, {
      slots: {
        default: `
          <BudgetAccordionItem title="A" :default-open="true">Contenu A</BudgetAccordionItem>
          <BudgetAccordionItem title="B">Contenu B</BudgetAccordionItem>
        `
      },
      global: {
        components: { BudgetAccordionItem },
        stubs: { transition: true }
      }
    });
    await nextTick();

    const buttons = wrapper.findAll("button");
    const contents = wrapper.findAll('[data-testid="accordion-content"]');

    expect(contents[0].element.style.display).toBe("");
    expect(contents[1].element.style.display).toBe("none");

    await buttons[1].trigger("click");
    expect(contents[0].element.style.display).toBe("none");
    expect(contents[1].element.style.display).toBe("");

    await buttons[1].trigger("click");
    expect(contents[1].element.style.display).toBe("none");

    await wrapper.setProps({ multiple: true });
  });

  it("supports multiple opened items and collapses to one when multiple becomes false", async () => {
    const wrapper = mount(BudgetAccordion, {
      props: { multiple: true, spaced: true },
      slots: {
        default: `
          <BudgetAccordionItem title="A" :default-open="true">Contenu A</BudgetAccordionItem>
          <BudgetAccordionItem title="B" :default-open="true">Contenu B</BudgetAccordionItem>
        `
      },
      global: {
        components: { BudgetAccordionItem },
        stubs: { transition: true }
      }
    });
    await nextTick();

    const contents = wrapper.findAll('[data-testid="accordion-content"]');
    expect(contents[0].element.style.display).toBe("");
    expect(contents[1].element.style.display).toBe("");

    const buttons = wrapper.findAll("button");
    await buttons[1].trigger("click");
    expect(contents[1].element.style.display).toBe("none");
    await buttons[1].trigger("click");
    expect(contents[1].element.style.display).toBe("");

    await wrapper.setProps({ multiple: false });
    await nextTick();
    expect(contents[0].element.style.display).toBe("");
    expect(contents[1].element.style.display).toBe("none");
  });

  it("ignores additional defaultOpen items in single mode", async () => {
    const wrapper = mount(BudgetAccordion, {
      slots: {
        default: `
          <BudgetAccordionItem title="A" :default-open="true">Contenu A</BudgetAccordionItem>
          <BudgetAccordionItem title="B" :default-open="true">Contenu B</BudgetAccordionItem>
        `
      },
      global: {
        components: { BudgetAccordionItem },
        stubs: { transition: true }
      }
    });
    await nextTick();

    const contents = wrapper.findAll('[data-testid="accordion-content"]');
    expect(contents[0].element.style.display).toBe("");
    expect(contents[1].element.style.display).toBe("none");
  });

  it("supports keyboard navigation between chevrons and skips disabled items", async () => {
    const wrapper = mount(BudgetAccordion, {
      attachTo: document.body,
      slots: {
        default: `
          <BudgetAccordionItem title="A">Contenu A</BudgetAccordionItem>
          <BudgetAccordionItem title="B" disabled>Contenu B</BudgetAccordionItem>
          <BudgetAccordionItem title="C">Contenu C</BudgetAccordionItem>
        `
      },
      global: {
        components: { BudgetAccordionItem }
      }
    });
    await nextTick();

    const buttons = wrapper.findAll("button");
    buttons[0].element.focus();
    await buttons[0].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(buttons[2].element);

    await buttons[2].trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(buttons[0].element);
    wrapper.unmount();
  });

  it("handles navigation with no enabled item", async () => {
    const wrapper = mount(BudgetAccordion, {
      attachTo: document.body,
      slots: {
        default: `
          <BudgetAccordionItem title="A" disabled>Contenu A</BudgetAccordionItem>
          <BudgetAccordionItem title="B" disabled>Contenu B</BudgetAccordionItem>
        `
      },
      global: {
        components: { BudgetAccordionItem }
      }
    });
    await nextTick();

    const button = wrapper.find("button");
    await button.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(document.body);
    wrapper.unmount();
  });

  it("covers duplicate register and unknown current focus navigation", () => {
    const Probe = defineComponent({
      setup() {
        const accordion = inject(budgetAccordionContextKey);
        const button = document.createElement("button");

        onMounted(() => {
          accordion?.focusByStep("empty", 1);
          accordion?.registerItem("same-id", button, true);
          accordion?.registerItem("same-id", button, false);
          accordion?.focusByStep("unknown-id", 1);
        });

        return () => h("div");
      }
    });

    const wrapper = mount(BudgetAccordion, {
      props: { multiple: true },
      slots: {
        default: () => h(Probe)
      }
    });

    expect(wrapper.find('[data-testid="accordion-root"]').exists()).toBe(true);
  });

  it("unregisters removed items", async () => {
    const Host = defineComponent({
      components: { BudgetAccordion, BudgetAccordionItem },
      setup() {
        const visible = ref(true);
        return { visible };
      },
      template: `
        <BudgetAccordion>
          <BudgetAccordionItem v-if="visible" title="A" :default-open="true">Contenu A</BudgetAccordionItem>
          <BudgetAccordionItem title="B">Contenu B</BudgetAccordionItem>
        </BudgetAccordion>
      `
    });

    const wrapper = mount(Host, {
      global: { stubs: { transition: true } }
    });
    await nextTick();

    expect(wrapper.findAll('[data-testid="accordion-content"]')[0].element.style.display).toBe("");
    wrapper.vm.visible = false;
    await nextTick();

    const button = wrapper.find("button");
    await button.trigger("click");
    expect(wrapper.find('[data-testid="accordion-content"]').element.style.display).toBe("");
  });
});

describe("BudgetAccordionItem", () => {
  it("works standalone with local state and icon slot", async () => {
    const wrapper = mount(BudgetAccordionItem, {
      props: {
        title: "Standalone",
        defaultOpen: false
      },
      slots: {
        icon: '<span data-testid="icon">I</span>',
        default: "Contenu standalone"
      },
      global: {
        stubs: { transition: true }
      }
    });

    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="accordion-item"]').classes()).toContain("border");
    expect(wrapper.find('[data-testid="accordion-item"]').classes()).toContain("rounded-xl");
    expect(wrapper.find('[data-testid="accordion-content"]').element.style.display).toBe("none");

    const button = wrapper.find("button");
    await button.trigger("keydown", { key: "Enter" });
    expect(wrapper.find('[data-testid="accordion-content"]').element.style.display).toBe("");

    await button.trigger("keydown", { key: " " });
    expect(wrapper.find('[data-testid="accordion-content"]').element.style.display).toBe("none");
    wrapper.unmount();
  });

  it("does not toggle when disabled", async () => {
    const wrapper = mount(BudgetAccordionItem, {
      props: {
        title: "Disabled",
        disabled: true,
        defaultOpen: false
      },
      slots: {
        default: "Contenu"
      },
      global: {
        stubs: { transition: true }
      }
    });

    const button = wrapper.find("button");
    button.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    button.element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextTick();
    expect(wrapper.find('[data-testid="accordion-content"]').element.style.display).toBe("none");
  });

  it("supports all color variants for the header", () => {
    const colors = [
      "primary",
      "secondary",
      "ghost",
      "primary-success",
      "secondary-success",
      "primary-warning",
      "secondary-warning",
      "primary-error",
      "secondary-error"
    ] as const;

    for (const color of colors) {
      const wrapper = mount(BudgetAccordionItem, {
        props: {
          title: color,
          color
        }
      });
      expect(wrapper.find("div.px-4.py-3").exists()).toBe(true);
    }
  });

  it("uses grouped wrapper style when inside non-spaced accordion", () => {
    const wrapper = mount(BudgetAccordion, {
      props: { spaced: false },
      slots: {
        default: `
          <BudgetAccordionItem title="A">Contenu A</BudgetAccordionItem>
        `
      },
      global: {
        components: { BudgetAccordionItem }
      }
    });

    const item = wrapper.find('[data-testid="accordion-item"]');
    expect(item.classes()).toContain("border-x");
    expect(item.classes()).toContain("border-b");
    expect(item.classes()).toContain("rounded-none");
    expect(item.classes()).toContain("first:rounded-t-xl");
    expect(item.classes()).toContain("last:rounded-b-xl");
  });

  it("handles full key map on chevron", async () => {
    const wrapper = mount(BudgetAccordion, {
      slots: {
        default: `
          <BudgetAccordionItem title="A">Contenu A</BudgetAccordionItem>
          <BudgetAccordionItem title="B">Contenu B</BudgetAccordionItem>
        `
      },
      global: {
        components: { BudgetAccordionItem },
        stubs: { transition: true }
      }
    });

    const buttons = wrapper.findAll("button");
    await buttons[0].trigger("keydown", { key: "ArrowRight" });
    await buttons[1].trigger("keydown", { key: "ArrowLeft" });
    await buttons[0].trigger("keydown", { key: "a" });
    await buttons[0].trigger("keydown", { key: "Enter" });
    expect(wrapper.findAll('[data-testid="accordion-content"]')[0].element.style.display).toBe("");
  });
});
