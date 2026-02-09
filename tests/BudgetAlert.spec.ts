import { mount } from "@vue/test-utils";
import { afterEach, vi } from "vitest";
import BudgetAlert from "../src/components/BudgetAlert/BudgetAlert.vue";

describe("BudgetAlert", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders text prop", () => {
    const wrapper = mount(BudgetAlert, {
      props: { text: "Information importante" }
    });

    const alert = wrapper.find('[role="status"]');
    expect(wrapper.text()).toContain("Information importante");
    expect(alert.exists()).toBe(true);
    expect(alert.attributes("role")).toBe("status");
  });

  it("renders default slot over text prop", () => {
    const wrapper = mount(BudgetAlert, {
      props: { text: "Texte prop" },
      slots: {
        default: "Texte slot"
      }
    });

    expect(wrapper.text()).toContain("Texte slot");
    expect(wrapper.text()).not.toContain("Texte prop");
  });

  it("applies size variants", () => {
    const sm = mount(BudgetAlert, {
      props: { text: "SM", size: "sm" }
    });
    expect(sm.find('[role="status"]').classes()).toContain("px-3");
    expect(sm.find('[role="status"]').classes()).toContain("py-2");

    const md = mount(BudgetAlert, {
      props: { text: "MD", size: "md" }
    });
    expect(md.find('[role="status"]').classes()).toContain("px-4");
    expect(md.find('[role="status"]').classes()).toContain("py-3");

    const lg = mount(BudgetAlert, {
      props: { text: "LG", size: "lg" }
    });
    expect(lg.find('[role="status"]').classes()).toContain("px-5");
    expect(lg.find('[role="status"]').classes()).toContain("py-4");
  });

  it("applies color variants", () => {
    const cases = [
      { color: "primary", classes: ["border-c-blue-dark", "bg-c-blue-light/30"] },
      { color: "secondary", classes: ["border-c-blue", "bg-white"] },
      { color: "ghost", classes: ["border-c-blue/40", "bg-transparent"] },
      { color: "primary-success", classes: ["border-c-green-dark", "bg-c-green/15"] },
      { color: "secondary-success", classes: ["border-c-green", "bg-white"] },
      { color: "primary-warning", classes: ["border-c-orange-dark", "bg-c-orange/20"] },
      { color: "secondary-warning", classes: ["border-c-orange", "bg-white"] },
      { color: "primary-error", classes: ["border-c-red-dark", "bg-c-red/15"] },
      { color: "secondary-error", classes: ["border-c-red", "bg-white"] }
    ] as const;

    for (const { color, classes } of cases) {
      const wrapper = mount(BudgetAlert, {
        props: { text: "Alerte", color }
      });

      for (const className of classes) {
        expect(wrapper.find('[role="status"]').classes()).toContain(className);
      }
    }
  });

  it("renders prefix and suffix slots", () => {
    const wrapper = mount(BudgetAlert, {
      props: { text: "Slots" },
      slots: {
        prefix: '<span data-testid="prefix">Left</span>',
        suffix: '<span data-testid="suffix">Right</span>'
      }
    });

    expect(wrapper.find('[data-testid="prefix"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="suffix"]').exists()).toBe(true);
  });

  it("shows dismiss button only when dismissible", () => {
    const hidden = mount(BudgetAlert, {
      props: { text: "Non dismissible" }
    });
    expect(hidden.find("button").exists()).toBe(false);

    const visible = mount(BudgetAlert, {
      props: { text: "Dismissible", dismissible: true }
    });
    expect(visible.find("button").exists()).toBe(true);
    expect(visible.find("button").attributes("aria-label")).toBe("Fermer l'alerte");
  });

  it("applies dismiss button size classes", () => {
    const lg = mount(BudgetAlert, {
      props: { text: "Large dismiss", dismissible: true, size: "lg" }
    });
    const lgButton = lg.find("button");
    expect(lgButton.classes()).toContain("top-3");
    expect(lgButton.classes()).toContain("right-3");
    expect(lgButton.classes()).toContain("text-lg");

    const sm = mount(BudgetAlert, {
      props: { text: "Small dismiss", dismissible: true, size: "sm" }
    });
    const smButton = sm.find("button");
    expect(smButton.classes()).toContain("top-1.5");
    expect(smButton.classes()).toContain("right-1.5");
    expect(smButton.classes()).toContain("text-sm");
  });

  it("dismisses alert and emits dismiss event", async () => {
    const wrapper = mount(BudgetAlert, {
      props: { text: "Dismissible", dismissible: true, closeLabel: "Fermer" }
    });

    const button = wrapper.find("button");
    await button.trigger("click");
    await button.trigger("click");

    expect(wrapper.emitted("dismiss")).toHaveLength(1);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("auto dismisses after configured delay", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetAlert, {
      props: { text: "Auto", autoDismiss: true, dismissAfter: 500 }
    });

    expect(wrapper.find('[role="status"]').exists()).toBe(true);

    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("dismiss")).toHaveLength(1);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("does not auto dismiss when autoDismiss is false", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetAlert, {
      props: { text: "Auto off", autoDismiss: false, dismissAfter: 200 }
    });

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("dismiss")).toBeUndefined();
    expect(wrapper.find('[role="status"]').exists()).toBe(true);
  });

  it("pauses auto dismiss on hover and resumes on mouseleave", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetAlert, {
      props: { text: "Pause on hover", autoDismiss: true, dismissAfter: 1000, pauseOnHover: true }
    });

    const alert = wrapper.find('[role="status"]');
    vi.advanceTimersByTime(400);
    await alert.trigger("mouseenter");
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[role="status"]').exists()).toBe(true);

    await alert.trigger("mouseleave");
    vi.advanceTimersByTime(600);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("dismiss")).toHaveLength(1);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("dismisses immediately when dismissAfter is zero", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetAlert, {
      props: { text: "Immediate", autoDismiss: true, dismissAfter: 0 }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("dismiss")).toHaveLength(1);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("does not pause or resume timer when pauseOnHover is false", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetAlert, {
      props: { text: "No hover pause", autoDismiss: true, dismissAfter: 500, pauseOnHover: false }
    });

    const alert = wrapper.find('[role="status"]');
    await alert.trigger("mouseenter");
    await alert.trigger("mouseleave");

    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("dismiss")).toHaveLength(1);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("clears running timer on unmount", () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const wrapper = mount(BudgetAlert, {
      props: { text: "Unmount", autoDismiss: true, dismissAfter: 2000 }
    });

    wrapper.unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("removes alert node with transition rendered", async () => {
    const wrapper = mount(BudgetAlert, {
      props: { text: "With transition", dismissible: true },
      global: {
        stubs: {
          Transition: false
        }
      }
    });

    expect(wrapper.find('[role="status"]').exists()).toBe(true);
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });
});
