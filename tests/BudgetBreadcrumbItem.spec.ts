import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BudgetBreadcrumb from "../src/components/BudgetBreadcrumb/BudgetBreadcrumb.vue";
import BudgetBreadcrumbItem from "../src/components/BudgetBreadcrumbItem/BudgetBreadcrumbItem.vue";

describe("BudgetBreadcrumbItem", () => {
  it("works without breadcrumb context", async () => {
    const wrapper = mount(BudgetBreadcrumbItem, {
      props: {
        label: "Standalone",
        href: "/standalone"
      }
    });

    await wrapper.setProps({
      label: "Standalone 2",
      href: "/updated"
    });
    expect(wrapper.html()).toBe("");
    wrapper.unmount();
  });

  it("registers, updates and unregisters inside BudgetBreadcrumb", async () => {
    const Host = {
      components: { BudgetBreadcrumb, BudgetBreadcrumbItem },
      data() {
        return {
          visible: true,
          firstLabel: "Accueil",
          firstHref: "/accueil"
        };
      },
      template: `
        <BudgetBreadcrumb>
          <BudgetBreadcrumbItem
            v-if="visible"
            :label="firstLabel"
            :href="firstHref"
          />
          <BudgetBreadcrumbItem label="Detail" />
        </BudgetBreadcrumb>
      `
    };

    const wrapper = mount(Host);
    await nextTick();

    expect(wrapper.findAll("ol > li")).toHaveLength(2);
    expect(wrapper.text()).toContain("Accueil");
    expect(wrapper.find('a[href="/accueil"]').exists()).toBe(true);

    wrapper.vm.firstLabel = "Espace client";
    wrapper.vm.firstHref = "/espace-client";
    await nextTick();

    expect(wrapper.text()).toContain("Espace client");
    expect(wrapper.find('a[href="/espace-client"]').exists()).toBe(true);

    wrapper.vm.visible = false;
    await nextTick();

    expect(wrapper.findAll("ol > li")).toHaveLength(1);
    expect(wrapper.text()).toContain("Detail");
  });
});
