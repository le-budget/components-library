import { mount } from "@vue/test-utils";
import BudgetNavbar from "../src/components/BudgetNavbar/BudgetNavbar.vue";
import BudgetNavbarMenu from "../src/components/BudgetNavbarMenu/BudgetNavbarMenu.vue";
import BudgetNavbarMenuItem from "../src/components/BudgetNavbarMenuItem/BudgetNavbarMenuItem.vue";

describe("BudgetNavbar", () => {
  it("renders with default props and a11y attributes", () => {
    const wrapper = mount(BudgetNavbar, {
      slots: {
        "user-menu": "<button type=\"button\">Profil</button>"
      }
    });

    const nav = wrapper.find("nav");
    expect(nav.attributes("aria-label")).toBe("Navigation principale");
    expect(nav.classes()).toContain("relative");

    const toggle = wrapper.find("button[aria-controls]");
    const menuId = toggle.attributes("aria-controls");
    const mobilePanel = wrapper.find(`#${menuId}`);

    expect(toggle.attributes("aria-expanded")).toBe("false");
    expect(toggle.attributes("aria-label")).toBe("Ouvrir la navigation");
    expect(mobilePanel.attributes("style")).toContain("display: none");
  });

  it("supports sticky and fixed positions", () => {
    const sticky = mount(BudgetNavbar, {
      props: { position: "sticky" }
    });
    expect(sticky.find("nav").classes()).toContain("sticky");
    expect(sticky.find("nav").classes()).toContain("top-0");

    const fixed = mount(BudgetNavbar, {
      props: { position: "fixed" }
    });
    expect(fixed.find("nav").classes()).toContain("fixed");
    expect(fixed.find("nav").classes()).toContain("inset-x-0");
  });

  it("toggles mobile menu and updates labels", async () => {
    const wrapper = mount(BudgetNavbar, {
      props: {
        openLabel: "Ouvrir",
        closeLabel: "Fermer"
      },
      slots: {
        brand: "<span>Marque</span>",
        default: "<a href=\"#\">Dashboard</a>",
        notifications: "<button type=\"button\">Notif</button>",
        "user-menu": "<button type=\"button\">Profil</button>"
      }
    });

    const toggle = wrapper.find("button[aria-controls]");
    const menuId = toggle.attributes("aria-controls");
    const mobilePanel = () => wrapper.find(`#${menuId}`);

    expect(toggle.attributes("aria-label")).toBe("Ouvrir");

    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("true");
    expect(toggle.attributes("aria-label")).toBe("Fermer");
    expect(mobilePanel().attributes("style")).toBe("");

    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("false");
    expect(toggle.attributes("aria-label")).toBe("Ouvrir");
    expect(mobilePanel().attributes("style")).toContain("display: none");
  });

  it("closes mobile menu on escape key", async () => {
    const wrapper = mount(BudgetNavbar, {
      props: { defaultOpen: true },
      slots: {
        "user-menu": "<button type=\"button\">Profil</button>"
      }
    });

    const toggle = wrapper.find("button[aria-controls]");
    expect(toggle.attributes("aria-expanded")).toBe("true");

    await toggle.trigger("keydown", { key: "Escape" });
    expect(toggle.attributes("aria-expanded")).toBe("false");
  });

  it("keeps user-menu outside collapsed content and renders notifications area labels", async () => {
    const wrapper = mount(BudgetNavbar, {
      props: { defaultOpen: true },
      slots: {
        brand: "<span>Brand</span>",
        default: "<a href=\"#\">Accueil</a>",
        notifications: "<button type=\"button\">Notif</button>",
        "user-menu": "<button type=\"button\">User</button>"
      }
    });

    const toggle = wrapper.find("button[aria-controls]");
    const menuId = toggle.attributes("aria-controls");
    const mobilePanel = wrapper.find(`#${menuId}`);

    expect(wrapper.findAll('[aria-label="Notifications"]')).toHaveLength(2);
    expect(wrapper.find('[aria-label="Menu utilisateur"]').exists()).toBe(true);
    expect(mobilePanel.text()).not.toContain("User");
  });

  it("does not render optional slot containers when slots are missing", () => {
    const wrapper = mount(BudgetNavbar);

    expect(wrapper.find('[aria-label="Menu utilisateur"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Notifications"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain("Profil");
  });

  it("supports stacked mobile menu items with BudgetNavbarMenu components", () => {
    const wrapper = mount(BudgetNavbar, {
      props: { defaultOpen: true },
      slots: {
        default: `
          <BudgetNavbarMenu>
            <BudgetNavbarMenuItem><a href="#">Accueil</a></BudgetNavbarMenuItem>
            <BudgetNavbarMenuItem><a href="#">Transactions</a></BudgetNavbarMenuItem>
          </BudgetNavbarMenu>
        `,
        "user-menu": "<button type=\"button\">User</button>"
      },
      global: {
        components: {
          BudgetNavbarMenu,
          BudgetNavbarMenuItem
        }
      }
    });

    const menu = wrapper.findComponent(BudgetNavbarMenu);
    const items = wrapper.findAllComponents(BudgetNavbarMenuItem);

    expect(menu.classes()).toContain("flex-col");
    expect(menu.classes()).toContain("md:flex-row");
    expect(items[0].classes()).toContain("w-full");
    expect(items[0].classes()).toContain("md:w-auto");
  });
});
