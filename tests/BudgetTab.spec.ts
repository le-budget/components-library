import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BudgetIcon from "../src/components/BudgetIcon/BudgetIcon.vue";
import BudgetTab from "../src/components/BudgetTab/BudgetTab.vue";
import BudgetTabItem from "../src/components/BudgetTabItem/BudgetTabItem.vue";

type BudgetTabVm = {
  registerItem: (item: {
    id: string;
    title: string;
    color: string;
    disabled: boolean;
    defaultActive: boolean;
    iconSlot?: () => unknown;
    contentSlot?: () => unknown;
  }) => void;
  updateItem: (id: string, item: {
    title: string;
    color: string;
    disabled: boolean;
    defaultActive: boolean;
    iconSlot?: () => unknown;
    contentSlot?: () => unknown;
  }) => void;
  unregisterItem: (id: string) => void;
  setButtonRef: (itemId: string, element: Element | null) => void;
  focusByStep: (currentId: string, step: -1 | 1) => void;
  focusEdge: (position: "first" | "last") => void;
  onTabKeydown: (event: KeyboardEvent, itemId: string) => void;
  getTabButtonToneClass: (item: {
    id: string;
    title: string;
    color: string;
    disabled: boolean;
    defaultActive: boolean;
  }) => string;
  getPanelToneClass: (color: string) => string;
  getPanelShapeClass: () => string;
  getPanelBorderWidthClass: () => string;
  getTabListClass: () => string;
  getTabListBorderClass: () => string;
  getTabListBorderWidthClass: () => string;
  getRootClass: () => string;
  getTabButtonBorderWidthClass: (itemId: string, index: number, total: number) => string;
  getTabButtonLayoutClass: (itemId: string, index: number, total: number) => string;
};

describe("BudgetTab", () => {
  it("renders horizontal tablist and links tab with panel", async () => {
    const wrapper = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="Synthese" color="primary" :default-active="true">
            <template #icon>
              <BudgetIcon status="status-info" decorative />
            </template>
            Contenu A
          </BudgetTabItem>
          <BudgetTabItem title="Comptes" color="secondary-success">
            Contenu B
          </BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem, BudgetIcon }
      }
    });
    await nextTick();

    const list = wrapper.find('[data-testid="tab-list"]');
    const root = wrapper.find('[data-testid="tab-root"]');
    const tabs = wrapper.findAll('[role="tab"]');
    const panels = wrapper.findAll('[data-testid="tab-panel"]');

    expect(list.attributes("role")).toBe("tablist");
    expect(list.attributes("aria-orientation")).toBe("horizontal");
    expect(tabs).toHaveLength(2);
    expect(panels).toHaveLength(2);
    expect(tabs[0].attributes("aria-selected")).toBe("true");
    expect(tabs[1].attributes("aria-selected")).toBe("false");
    expect(panels[0].attributes("aria-labelledby")).toBe(tabs[0].attributes("id"));
    expect(tabs[0].attributes("aria-controls")).toBe(panels[0].attributes("id"));
    expect(tabs[0].find("svg").exists()).toBe(true);
    expect(list.classes()).toContain("gap-0");
    expect(list.classes()).toContain("border-b-0");
    expect(list.classes()).not.toContain("border-b");
    expect(root.classes()).toContain("gap-0");
    expect(tabs[0].classes()).toContain("rounded-tl-lg");
    expect(tabs[0].classes()).toContain("rounded-none");
    expect(tabs[0].classes()).toContain("border-t");
    expect(tabs[0].classes()).not.toContain("border-y");
    expect(tabs[1].classes()).toContain("rounded-tr-lg");
    expect(tabs[1].classes()).not.toContain("-mb-px");
    expect(tabs[1].classes()).toContain("border-r");
    expect(tabs[1].classes()).not.toContain("border-r-0");
    expect(panels[0].classes()).toContain("rounded-t-none");
    expect(panels[0].classes()).toContain("rounded-b-xl");
  });

  it("avoids double separators in compact mode with 2, 3 and 4 tabs", async () => {
    const twoTabs = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    let tabs = twoTabs.findAll('[role="tab"]');
    expect(tabs[0].classes()).toContain("border-r");
    expect(tabs[1].classes()).toContain("border-l-0");

    await tabs[1].trigger("click");
    tabs = twoTabs.findAll('[role="tab"]');
    expect(tabs[0].classes()).toContain("border-r-0");
    expect(tabs[1].classes()).toContain("border-l");

    const wrapper = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
          <BudgetTabItem title="C">Contenu C</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].classes()).toContain("border-r");
    expect(tabs[0].classes()).not.toContain("opacity-50");
    expect(tabs[1].classes()).toContain("opacity-50");
    expect(tabs[1].classes()).toContain("border-l-0");
    expect(tabs[1].classes()).toContain("border-r-0");

    await tabs[1].trigger("click");
    const refreshed = wrapper.findAll('[role="tab"]');
    expect(refreshed[0].classes()).toContain("opacity-50");
    expect(refreshed[1].classes()).not.toContain("opacity-50");
    expect(refreshed[1].classes()).toContain("border-r");
    expect(refreshed[2].classes()).toContain("border-l-0");
    expect(refreshed[0].classes()).toContain("border-r-0");

    const fourTabs = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="A">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B" :default-active="true">Contenu B</BudgetTabItem>
          <BudgetTabItem title="C">Contenu C</BudgetTabItem>
          <BudgetTabItem title="D">Contenu D</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    tabs = fourTabs.findAll('[role="tab"]');
    expect(tabs[2].classes()).toContain("border-l-0");
    expect(tabs[3].classes()).toContain("border-l");
  });

  it("supports spaced mode layout classes", async () => {
    const wrapper = mount(BudgetTab, {
      props: {
        spaced: true
      },
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    const list = wrapper.find('[data-testid="tab-list"]');
    const root = wrapper.find('[data-testid="tab-root"]');
    const tabs = wrapper.findAll('[role="tab"]');

    expect(list.classes()).toContain("gap-2");
    expect(list.classes()).toContain("pb-2");
    expect(list.classes()).toContain("border-b");
    expect(root.classes()).toContain("gap-3");
    expect(tabs[0].classes()).toContain("rounded-lg");
    expect(tabs[0].classes()).not.toContain("rounded-tl-lg");
    expect(wrapper.find('[data-testid="tab-panel"]').classes()).toContain("rounded-xl");
  });

  it("applies borderWidth on tabs and panel", async () => {
    const compact = mount(BudgetTab, {
      props: {
        borderWidth: "md"
      },
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
          <BudgetTabItem title="C">Contenu C</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    const compactTabs = compact.findAll('[role="tab"]');
    expect(compactTabs[0].classes()).toContain("border-t-2");
    expect(compactTabs[0].classes()).toContain("border-l-2");
    expect(compactTabs[1].classes()).toContain("border-t-2");
    expect(compactTabs[1].classes()).toContain("border-r-0");
    expect(compact.find('[data-testid="tab-panel"]').classes()).toContain("border-2");

    const spaced = mount(BudgetTab, {
      props: {
        spaced: true,
        borderWidth: "lg"
      },
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    expect(spaced.find('[role="tab"]').classes()).toContain("border-4");
    expect(spaced.find('[data-testid="tab-panel"]').classes()).toContain("border-4");
    expect(spaced.find('[data-testid="tab-list"]').classes()).toContain("border-b-4");

    const compactLg = mount(BudgetTab, {
      props: {
        borderWidth: "lg"
      },
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
          <BudgetTabItem title="C">Contenu C</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();
    const compactLgTabs = compactLg.findAll('[role="tab"]');
    expect(compactLgTabs[0].classes()).toContain("border-t-4");
    expect(compactLgTabs[1].classes()).toContain("border-t-4");
    expect(compactLgTabs[1].classes()).toContain("border-r-0");

    const spacedMd = mount(BudgetTab, {
      props: {
        spaced: true,
        borderWidth: "md"
      },
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();
    expect(spacedMd.find('[role="tab"]').classes()).toContain("border-2");
    expect(spacedMd.find('[data-testid="tab-list"]').classes()).toContain("border-b-2");
  });

  it("navigates with keyboard and skips disabled tabs", async () => {
    const wrapper = mount(BudgetTab, {
      attachTo: document.body,
      slots: {
        default: `
          <BudgetTabItem title="A" color="primary" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B" color="secondary-warning" :disabled="true">Contenu B</BudgetTabItem>
          <BudgetTabItem title="C" color="primary-error">Contenu C</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    const tabs = wrapper.findAll('[role="tab"]');
    tabs[0].element.focus();
    await tabs[0].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[2].element);
    expect(tabs[2].attributes("aria-selected")).toBe("true");

    await tabs[2].trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(tabs[0].element);
    expect(tabs[0].attributes("aria-selected")).toBe("true");

    await tabs[0].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(tabs[2].element);
    await tabs[2].trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(tabs[0].element);

    await tabs[2].trigger("keydown", { key: " " });
    expect(tabs[2].attributes("aria-selected")).toBe("true");
    await tabs[0].trigger("keydown", { key: "Enter" });
    expect(tabs[0].attributes("aria-selected")).toBe("true");
    await tabs[0].trigger("keydown", { key: "a" });
    expect(tabs[0].attributes("aria-selected")).toBe("true");

    wrapper.unmount();
  });

  it("uses first enabled tab when default active is disabled and ignores disabled click", async () => {
    const wrapper = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="A" color="primary" :default-active="true" :disabled="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B" color="secondary">Contenu B</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].attributes("aria-selected")).toBe("false");
    expect(tabs[1].attributes("aria-selected")).toBe("true");

    await tabs[0].trigger("click");
    expect(tabs[1].attributes("aria-selected")).toBe("true");
  });

  it("handles empty and all-disabled configurations", async () => {
    const empty = mount(BudgetTab, {
      slots: {
        default: "<div>Aucun onglet</div>"
      }
    });

    expect(empty.findAll('[role="tab"]')).toHaveLength(0);
    expect(empty.find('[data-testid="tab-panels"]').exists()).toBe(true);
    expect(empty.findAll('[role="tabpanel"]')).toHaveLength(0);

    const disabledOnly = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="A" :disabled="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B" :disabled="true">Contenu B</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    const vm = disabledOnly.vm as unknown as BudgetTabVm;
    vm.focusByStep("unknown", 1);
    vm.focusEdge("first");
    vm.focusEdge("last");

    const tabs = disabledOnly.findAll('[role="tab"]');
    expect(tabs[0].attributes("aria-selected")).toBe("false");
    expect(tabs[1].attributes("aria-selected")).toBe("false");
  });

  it("supports items without default slot content", async () => {
    const wrapper = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="Sans contenu" :default-active="true" />
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(1);
    expect(wrapper.find('[role="tabpanel"]').text()).toBe("");
  });

  it("covers registration updates, guards and fallback classes", async () => {
    const wrapper = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="Primary" color="primary" :default-active="true">A</BudgetTabItem>
          <BudgetTabItem title="Secondary" color="secondary">B</BudgetTabItem>
          <BudgetTabItem title="Ghost" color="ghost">C</BudgetTabItem>
          <BudgetTabItem title="Primary Success" color="primary-success">D</BudgetTabItem>
          <BudgetTabItem title="Secondary Success" color="secondary-success">E</BudgetTabItem>
          <BudgetTabItem title="Primary Warning" color="primary-warning">F</BudgetTabItem>
          <BudgetTabItem title="Secondary Warning" color="secondary-warning">G</BudgetTabItem>
          <BudgetTabItem title="Primary Error" color="primary-error">H</BudgetTabItem>
          <BudgetTabItem title="Secondary Error" color="secondary-error">I</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    const vm = wrapper.vm as unknown as BudgetTabVm;
    const tabs = wrapper.findAll('[role="tab"]');
    for (const tab of tabs) {
      await tab.trigger("click");
    }

    vm.updateItem("missing-id", {
      title: "Missing",
      color: "primary",
      disabled: false,
      defaultActive: false
    });
    vm.unregisterItem("missing-id");
    const firstId = wrapper.find('[role="tab"]').attributes("id").replace(/-tab$/, "");
    vm.updateItem(firstId, {
      title: "Primary Updated",
      color: "primary",
      disabled: false,
      defaultActive: false
    });
    vm.setButtonRef("ghost-id", document.createElement("div"));
    vm.setButtonRef("ghost-id", null);
    vm.focusByStep("unknown", 1);
    vm.onTabKeydown(new KeyboardEvent("keydown", { key: "Enter" }), "missing-id");

    const fallbackButtonClass = vm.getTabButtonToneClass({
      id: "x",
      title: "x",
      color: "unexpected",
      disabled: false,
      defaultActive: false
    });
    const fallbackPanelClass = vm.getPanelToneClass("unexpected");
    const listClass = vm.getTabListClass();
    const tabListBorderClass = vm.getTabListBorderClass();
    const tabListBorderWidthClass = vm.getTabListBorderWidthClass();
    const rootClass = vm.getRootClass();
    const panelShapeClass = vm.getPanelShapeClass();
    const panelBorderWidthClass = vm.getPanelBorderWidthClass();
    const tabBorderWidthClass = vm.getTabButtonBorderWidthClass("x", 0, 3);
    const buttonClass = vm.getTabButtonLayoutClass("x", 0, 3);

    expect(fallbackButtonClass).toContain("border-c-blue-dark");
    expect(fallbackPanelClass).toContain("border-c-blue-dark");
    expect(listClass).toContain("gap-0");
    expect(tabListBorderClass).toContain("border-b-0");
    expect(tabListBorderWidthClass).toContain("border-b");
    expect(rootClass).toContain("gap-0");
    expect(panelShapeClass).toContain("rounded-b-xl");
    expect(panelBorderWidthClass).toContain("border");
    expect(tabBorderWidthClass).toContain("border-t");
    expect(buttonClass).toContain("rounded-tl-lg");
  });

  it("keeps active selection after user choice and handles duplicate register", async () => {
    const wrapper = mount(BudgetTab, {
      slots: {
        default: `
          <BudgetTabItem title="A" :default-active="true">Contenu A</BudgetTabItem>
          <BudgetTabItem title="B">Contenu B</BudgetTabItem>
        `
      },
      global: {
        components: { BudgetTabItem }
      }
    });
    await nextTick();

    const tabs = wrapper.findAll('[role="tab"]');
    await tabs[1].trigger("click");
    expect(tabs[1].attributes("aria-selected")).toBe("true");

    const vm = wrapper.vm as unknown as BudgetTabVm;
    const firstId = tabs[0].attributes("id").replace(/-tab$/, "");

    vm.registerItem({
      id: firstId,
      title: "A bis",
      color: "primary",
      disabled: false,
      defaultActive: false
    });
    await nextTick();

    const refreshedTabs = wrapper.findAll('[role="tab"]');
    expect(refreshedTabs[1].attributes("aria-selected")).toBe("true");
    expect(refreshedTabs).toHaveLength(2);
    expect(wrapper.text()).toContain("A bis");
  });
});

describe("BudgetTabItem", () => {
  it("works without BudgetTab context and updates watched props", async () => {
    const wrapper = mount(BudgetTabItem, {
      props: {
        title: "Standalone",
        color: "primary",
        disabled: false,
        defaultActive: false
      },
      slots: {
        default: "Contenu seul"
      }
    });

    await wrapper.setProps({
      title: "Standalone 2",
      color: "secondary",
      disabled: true,
      defaultActive: true
    });

    expect(wrapper.html()).toBe("");
    wrapper.unmount();
  });

  it("registers to BudgetTab and unregisters on removal", async () => {
    const Host = {
      components: { BudgetTab, BudgetTabItem },
      data() {
        return { visible: true, title: "Visible" };
      },
      template: `
        <BudgetTab>
          <BudgetTabItem v-if="visible" :title="title" :default-active="true">Contenu visible</BudgetTabItem>
          <BudgetTabItem title="Toujours la" color="secondary">Contenu stable</BudgetTabItem>
        </BudgetTab>
      `
    };

    const wrapper = mount(Host);
    await nextTick();

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2);
    expect(wrapper.text()).toContain("Contenu visible");

    wrapper.vm.title = "Visible modifie";
    await nextTick();
    expect(wrapper.text()).toContain("Visible modifie");

    wrapper.vm.visible = false;
    await nextTick();

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(1);
    expect(wrapper.text()).toContain("Contenu stable");
  });
});
