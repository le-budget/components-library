import { mount } from "@vue/test-utils";
import { afterEach, vi } from "vitest";
import BudgetToast from "../src/components/BudgetToast/BudgetToast.vue";

describe("BudgetToast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders title and description", () => {
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "Titre",
        description: "Description"
      }
    });

    expect(wrapper.text()).toContain("Titre");
    expect(wrapper.text()).toContain("Description");
    expect(wrapper.find('[role="status"]').attributes("aria-live")).toBe("polite");
  });

  it("uses assertive live region for error variant", () => {
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "Erreur",
        variant: "error"
      }
    });

    expect(wrapper.find('[role="status"]').attributes("aria-live")).toBe("assertive");
    expect(wrapper.find('[role="status"]').classes()).toContain("border-c-red");
  });

  it("applies warning and question visual variants", () => {
    const warning = mount(BudgetToast, {
      props: {
        id: "t-warning",
        title: "Warning",
        variant: "warning"
      }
    });
    expect(warning.find('[role="status"]').classes()).toContain("border-c-orange");

    const question = mount(BudgetToast, {
      props: {
        id: "t-question",
        title: "Question",
        variant: "question"
      }
    });
    expect(question.find('[role="status"]').classes()).toContain("border-c-blue-dark");
  });

  it("applies all alert-like color variants", () => {
    const cases = [
      { color: "primary", expectedClass: "border-c-blue-dark" },
      { color: "secondary", expectedClass: "border-c-blue" },
      { color: "ghost", expectedClass: "bg-transparent" },
      { color: "primary-success", expectedClass: "border-c-green-dark" },
      { color: "secondary-success", expectedClass: "border-c-green" },
      { color: "primary-warning", expectedClass: "border-c-orange-dark" },
      { color: "secondary-warning", expectedClass: "border-c-orange" },
      { color: "primary-error", expectedClass: "border-c-red-dark" },
      { color: "secondary-error", expectedClass: "border-c-red" }
    ] as const;

    for (const { color, expectedClass } of cases) {
      const wrapper = mount(BudgetToast, {
        props: {
          id: `t-${color}`,
          title: color,
          color
        }
      });
      expect(wrapper.find('[role="status"]').classes()).toContain(expectedClass);
    }
  });

  it("hides icon when icon is false", () => {
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "Sans icone",
        icon: false
      }
    });

    expect(wrapper.findComponent({ name: "BudgetIcon" }).exists()).toBe(false);
  });

  it("emits close when close button is clicked", async () => {
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "Fermeture manuelle"
      }
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("close")).toEqual([["t-1"]]);
  });

  it("auto closes after duration", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "Auto close",
        duration: 300
      }
    });

    vi.advanceTimersByTime(300);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toEqual([["t-1"]]);
  });

  it("does not auto close when duration is zero", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "Persistant",
        duration: 0
      }
    });

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toBeUndefined();
  });

  it("pauses timer on hover and resumes on mouseleave", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "Pause hover",
        duration: 1000,
        pauseOnHover: true
      }
    });

    const toast = wrapper.find('[role="status"]');

    vi.advanceTimersByTime(450);
    await toast.trigger("mouseenter");

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("close")).toBeUndefined();

    await toast.trigger("mouseleave");
    vi.advanceTimersByTime(550);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toEqual([["t-1"]]);
  });

  it("ignores pause and resume when pauseOnHover is false", async () => {
    vi.useFakeTimers();
    const wrapper = mount(BudgetToast, {
      props: {
        id: "t-1",
        title: "No pause",
        duration: 300,
        pauseOnHover: false
      }
    });

    const toast = wrapper.find('[role="status"]');
    await toast.trigger("mouseenter");
    await toast.trigger("mouseleave");

    vi.advanceTimersByTime(300);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toEqual([["t-1"]]);
  });
});
