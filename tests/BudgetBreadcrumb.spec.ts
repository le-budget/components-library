import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BudgetBreadcrumb from "../src/components/BudgetBreadcrumb/BudgetBreadcrumb.vue";
import BudgetBreadcrumbItem from "../src/components/BudgetBreadcrumbItem/BudgetBreadcrumbItem.vue";
import { budgetBreadcrumbContextKey } from "../src/components/BudgetBreadcrumb/breadcrumbContext";

describe("BudgetBreadcrumb", () => {
  it("renders links and static items with default nav label", async () => {
    const wrapper = mount(BudgetBreadcrumb, {
      slots: {
        default: `
          <BudgetBreadcrumbItem label="Accueil" href="/accueil" />
          <BudgetBreadcrumbItem label="Comptes" href="/comptes" />
          <BudgetBreadcrumbItem label="Detail" />
        `
      },
      global: {
        components: { BudgetBreadcrumbItem }
      }
    });
    await nextTick();

    const nav = wrapper.find("nav");
    const links = wrapper.findAll("a");
    expect(nav.attributes("aria-label")).toBe("Fil d'ariane");
    expect(links).toHaveLength(2);
    expect(links[0].attributes("href")).toBe("/accueil");
    expect(wrapper.text()).toContain("Detail");
  });

  it("supports icon slot rendering", async () => {
    const wrapper = mount(BudgetBreadcrumb, {
      slots: {
        default: `
          <BudgetBreadcrumbItem label="Accueil" href="/accueil">
            <template #icon>
              <span data-testid="item-icon">*</span>
            </template>
          </BudgetBreadcrumbItem>
          <BudgetBreadcrumbItem label="Detail" />
        `
      },
      global: {
        components: { BudgetBreadcrumbItem }
      }
    });
    await nextTick();

    expect(wrapper.find('[data-testid="item-icon"]').exists()).toBe(true);
  });

  it("truncates to first, ellipsis and last when total exceeds maxItems", async () => {
    const wrapper = mount(BudgetBreadcrumb, {
      props: {
        maxItems: 3
      },
      slots: {
        default: `
          <BudgetBreadcrumbItem label="Accueil" href="/accueil" />
          <BudgetBreadcrumbItem label="Administration" href="/admin" />
          <BudgetBreadcrumbItem label="Clients" href="/clients" />
          <BudgetBreadcrumbItem label="Profil" />
        `
      },
      global: {
        components: { BudgetBreadcrumbItem }
      }
    });
    await nextTick();

    const items = wrapper.findAll("ol > li");
    expect(items).toHaveLength(3);
    expect(wrapper.text()).toContain("Accueil");
    expect(wrapper.text()).toContain("...");
    expect(wrapper.text()).toContain("Profil");
    expect(wrapper.text()).not.toContain("Administration");
    expect(wrapper.text()).not.toContain("Clients");
  });

  it("shows all items when total is below or equal to maxItems and renders separators", async () => {
    const wrapper = mount(BudgetBreadcrumb, {
      props: {
        maxItems: 4,
        ariaLabel: "Breadcrumb custom"
      },
      slots: {
        default: `
          <BudgetBreadcrumbItem label="A" href="/a" />
          <BudgetBreadcrumbItem label="B" href="/b" />
          <BudgetBreadcrumbItem label="C" href="/c" />
          <BudgetBreadcrumbItem label="D" />
        `
      },
      global: {
        components: { BudgetBreadcrumbItem }
      }
    });
    await nextTick();

    expect(wrapper.find("nav").attributes("aria-label")).toBe("Breadcrumb custom");
    expect(wrapper.findAll("ol > li")).toHaveLength(4);
    expect(wrapper.text()).not.toContain("...");
    expect(wrapper.findAll("svg")).toHaveLength(3);
  });

  it("covers context guards for duplicate register and missing update target", async () => {
    const wrapper = mount(BudgetBreadcrumb);
    const context = (wrapper.vm as { $: { provides: Record<symbol, unknown> } }).$.provides[
      budgetBreadcrumbContextKey as symbol
    ] as {
      registerItem: (item: { id: string; label: string; href?: string }) => void;
      updateItem: (
        id: string,
        item: { label: string; href?: string }
      ) => void;
    };

    context.registerItem({ id: "manual", label: "Premier" });
    await nextTick();
    expect(wrapper.text()).toContain("Premier");

    context.registerItem({ id: "manual", label: "Mis a jour" });
    await nextTick();
    expect(wrapper.findAll("ol > li")).toHaveLength(1);
    expect(wrapper.text()).toContain("Mis a jour");

    context.updateItem("inconnu", { label: "Ignore" });
    await nextTick();
    expect(wrapper.text()).not.toContain("Ignore");
  });
});
