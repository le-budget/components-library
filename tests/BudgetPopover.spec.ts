import { nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import BudgetPopover from "../src/components/BudgetPopover/BudgetPopover.vue";

const mountedWrappers: VueWrapper[] = [];

function mountPopover(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {}
) {
  const wrapper = mount(BudgetPopover, {
    props,
    attachTo: document.body,
    slots: {
      trigger: "<button type='button' data-testid='trigger'>Info</button>",
      default: "<p data-testid='content'>Texte popover</p>",
      ...slots
    }
  });

  mountedWrappers.push(wrapper);
  return wrapper;
}

function getTriggerHost() {
  return document.body.querySelector("[data-popover-trigger]") as HTMLElement | null;
}

function getTriggerButton() {
  return document.body.querySelector("[data-testid='trigger']") as HTMLButtonElement | null;
}

function getTooltip() {
  return document.body.querySelector("[role='tooltip']") as HTMLElement | null;
}

function createFocusEvent(type: "focusin" | "focusout", relatedTarget?: EventTarget | null) {
  const event = new FocusEvent(type, { bubbles: true });
  if (relatedTarget !== undefined) {
    Object.defineProperty(event, "relatedTarget", {
      value: relatedTarget,
      configurable: true
    });
  }
  return event;
}

function setRect(element: HTMLElement, rect: Partial<DOMRect>) {
  const normalized: DOMRect = {
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    width: rect.width ?? 0,
    height: rect.height ?? 0,
    top: rect.top ?? 0,
    right: rect.right ?? ((rect.left ?? 0) + (rect.width ?? 0)),
    bottom: rect.bottom ?? ((rect.top ?? 0) + (rect.height ?? 0)),
    left: rect.left ?? 0,
    toJSON: () => ({})
  };

  Object.defineProperty(element, "getBoundingClientRect", {
    value: () => normalized,
    configurable: true
  });
}

describe("BudgetPopover", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "innerWidth", { value: 1200, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    mountedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
  });

  it("opens on hover and closes on mouse leave", async () => {
    mountPopover();

    const triggerHost = getTriggerHost();
    expect(triggerHost).not.toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    expect(getTooltip()).not.toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(110);
    await nextTick();

    expect(getTooltip()).toBeNull();
  });

  it("opens on keyboard focus and closes on Escape", async () => {
    mountPopover();

    const triggerButton = getTriggerButton();
    expect(triggerButton).not.toBeNull();

    triggerButton?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    expect(getTooltip()).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(getTooltip()).toBeNull();
  });

  it("ignores non-escape keys and repositions when already open", async () => {
    mountPopover();
    const triggerHost = getTriggerHost();
    const triggerButton = getTriggerButton();

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    const firstDescribedBy = triggerButton?.getAttribute("aria-describedby");
    expect(firstDescribedBy).toMatch(/^budget-popover-\d+$/);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();
    expect(triggerButton?.getAttribute("aria-describedby")).toBe(firstDescribedBy);
  });

  it("manages aria-describedby on trigger element", async () => {
    mountPopover();

    const triggerButton = getTriggerButton();
    expect(triggerButton?.getAttribute("aria-describedby")).toBeNull();

    triggerButton?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const describedBy = triggerButton?.getAttribute("aria-describedby");
    expect(describedBy).toMatch(/^budget-popover-\d+$/);

    triggerButton?.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    vi.advanceTimersByTime(120);
    await nextTick();

    expect(triggerButton?.getAttribute("aria-describedby")).toBeNull();
  });

  it("restores initial aria-describedby value on close", async () => {
    mountPopover({}, {
      trigger: "<button type='button' data-testid='trigger' aria-describedby='existing-id'>Info</button>"
    });

    const triggerButton = getTriggerButton();
    expect(triggerButton?.getAttribute("aria-describedby")).toBe("existing-id");

    triggerButton?.dispatchEvent(createFocusEvent("focusin"));
    vi.advanceTimersByTime(90);
    await nextTick();

    const describedBy = triggerButton?.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("existing-id");
    expect(describedBy).toMatch(/budget-popover-\d+/);

    triggerButton?.dispatchEvent(createFocusEvent("focusout"));
    vi.advanceTimersByTime(110);
    await nextTick();

    expect(triggerButton?.getAttribute("aria-describedby")).toBe("existing-id");
  });

  it("applies title, icon and color classes", async () => {
    mountPopover({
      title: "Information",
      icon: "status-info",
      color: "warning"
    });

    const triggerHost = getTriggerHost();
    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip?.textContent).toContain("Information");
    expect(tooltip?.className).toContain("border-l-c-orange-dark");
    expect(document.body.querySelector("[data-icon='circle-info']")).not.toBeNull();
  });

  it("applies all color variants for border and title", async () => {
    const cases: Array<{
      color: "neutral" | "primary" | "success" | "warning" | "error";
      expectedBorder: string;
      expectedTitle: string;
    }> = [
      { color: "neutral", expectedBorder: "border-l-slate-500", expectedTitle: "text-slate-800" },
      { color: "primary", expectedBorder: "border-l-c-blue-dark", expectedTitle: "text-c-blue-dark" },
      { color: "success", expectedBorder: "border-l-c-green-dark", expectedTitle: "text-c-green-dark" },
      { color: "warning", expectedBorder: "border-l-c-orange-dark", expectedTitle: "text-c-orange-dark" },
      { color: "error", expectedBorder: "border-l-c-red-dark", expectedTitle: "text-c-red-dark" }
    ];

    for (const testCase of cases) {
      const wrapper = mountPopover({
        title: "Color test",
        icon: "status-info",
        color: testCase.color
      });
      const triggerHost = getTriggerHost();
      triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      vi.advanceTimersByTime(90);
      await nextTick();

      const tooltip = getTooltip();
      expect(tooltip?.className).toContain(testCase.expectedBorder);
      const title = tooltip?.querySelector("p");
      expect(title?.className).toContain(testCase.expectedTitle);

      wrapper.unmount();
      document.body.innerHTML = "";
    }
  });

  it("renders without header when title and icon are missing", async () => {
    mountPopover({ title: "", icon: undefined });
    const triggerHost = getTriggerHost();

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip?.querySelector("header")).toBeNull();
  });

  it("keeps open when moving focus between trigger and popover", async () => {
    mountPopover({ title: "Focus" }, {
      default: "<button type='button' data-testid='inside'>Inside</button>"
    });

    const triggerButton = getTriggerButton();
    triggerButton?.dispatchEvent(createFocusEvent("focusin"));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    const inside = document.body.querySelector("[data-testid='inside']") as HTMLButtonElement | null;
    expect(tooltip).not.toBeNull();
    expect(inside).not.toBeNull();

    triggerButton?.dispatchEvent(createFocusEvent("focusout", inside));
    vi.advanceTimersByTime(120);
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    inside?.dispatchEvent(createFocusEvent("focusout", triggerButton));
    vi.advanceTimersByTime(120);
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    inside?.dispatchEvent(createFocusEvent("focusout"));
    vi.advanceTimersByTime(120);
    await nextTick();
    expect(getTooltip()).toBeNull();
  });

  it("keeps open while pointer enters popover then closes after leaving it", async () => {
    mountPopover();
    const triggerHost = getTriggerHost();
    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    tooltip?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(120);
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    tooltip?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(120);
    await nextTick();
    expect(getTooltip()).toBeNull();
  });

  it("keeps open when close timer runs but focus is still within trigger", async () => {
    mountPopover();
    const triggerHost = getTriggerHost();
    const triggerButton = getTriggerButton();

    triggerButton?.dispatchEvent(createFocusEvent("focusin"));
    vi.advanceTimersByTime(90);
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(120);
    await nextTick();

    expect(getTooltip()).not.toBeNull();
  });

  it("falls back from top to bottom when top has no room", async () => {
    mountPopover({ placement: "top" });

    const triggerHost = getTriggerHost();
    const triggerButton = getTriggerButton();
    expect(triggerHost).not.toBeNull();
    expect(triggerButton).not.toBeNull();

    setRect(triggerButton as HTMLElement, {
      top: 10,
      left: 300,
      width: 100,
      height: 30
    });

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();

    setRect(tooltip as HTMLElement, {
      width: 240,
      height: 120
    });

    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(tooltip?.dataset.placement).toBe("bottom");
  });

  it("falls back from left to right when left has no room", async () => {
    mountPopover({ placement: "left" });

    const triggerHost = getTriggerHost();
    const triggerButton = getTriggerButton();
    expect(triggerHost).not.toBeNull();
    expect(triggerButton).not.toBeNull();

    setRect(triggerButton as HTMLElement, {
      top: 300,
      left: 4,
      width: 80,
      height: 28
    });

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();

    setRect(tooltip as HTMLElement, {
      width: 220,
      height: 90
    });

    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(tooltip?.dataset.placement).toBe("right");
  });

  it("keeps preferred left placement when enough room is available", async () => {
    mountPopover({ placement: "left" });
    const triggerHost = getTriggerHost();
    const triggerButton = getTriggerButton();
    expect(triggerHost).not.toBeNull();
    expect(triggerButton).not.toBeNull();

    setRect(triggerButton as HTMLElement, {
      top: 260,
      left: 700,
      width: 80,
      height: 28
    });

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();

    setRect(tooltip as HTMLElement, {
      width: 160,
      height: 80
    });

    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(tooltip?.dataset.placement).toBe("left");
  });

  it("keeps focus state when focus enters popover content", async () => {
    mountPopover({ title: "Focusable" }, {
      default: "<button type='button' data-testid='inside'>Inside</button>"
    });

    const triggerButton = getTriggerButton();
    triggerButton?.dispatchEvent(createFocusEvent("focusin"));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    const inside = document.body.querySelector("[data-testid='inside']") as HTMLButtonElement | null;
    expect(tooltip).not.toBeNull();
    expect(inside).not.toBeNull();

    triggerButton?.dispatchEvent(createFocusEvent("focusout", inside));
    inside?.dispatchEvent(createFocusEvent("focusin"));
    vi.advanceTimersByTime(120);
    await nextTick();

    expect(getTooltip()).not.toBeNull();
  });

  it("updates placement when prop changes while open", async () => {
    const wrapper = mountPopover({ placement: "top" });
    const triggerHost = getTriggerHost();
    const triggerButton = getTriggerButton();
    expect(triggerHost).not.toBeNull();
    expect(triggerButton).not.toBeNull();

    setRect(triggerButton as HTMLElement, {
      top: 300,
      left: 360,
      width: 120,
      height: 32
    });

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    setRect(tooltip as HTMLElement, { width: 160, height: 80 });
    window.dispatchEvent(new Event("resize"));
    await nextTick();
    expect(tooltip?.dataset.placement).toBe("top");

    await wrapper.setProps({ placement: "bottom" });
    await nextTick();
    expect(tooltip?.dataset.placement).toBe("bottom");
  });

  it("chooses the side with most space when none can fully fit", async () => {
    mountPopover({ placement: "top" });
    const triggerHost = getTriggerHost();
    const triggerButton = getTriggerButton();
    expect(triggerHost).not.toBeNull();
    expect(triggerButton).not.toBeNull();

    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 300, configurable: true });

    setRect(triggerButton as HTMLElement, {
      top: 100,
      left: 200,
      width: 80,
      height: 20
    });

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    setRect(tooltip as HTMLElement, { width: 1000, height: 1000 });

    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(tooltip?.dataset.placement).toBe("right");
  });

  it("does nothing on window change when closed", async () => {
    mountPopover();
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("scroll"));
    await nextTick();
    expect(getTooltip()).toBeNull();
  });

  it("covers closePopover guard when already closed", () => {
    const wrapper = mountPopover();
    const vm = wrapper.vm as unknown as { closePopover: () => void };
    vm.closePopover();
    expect(getTooltip()).toBeNull();
  });

  it("rebinds aria-describedby when anchor element changes", async () => {
    const wrapper = mountPopover(
      {},
      {
        trigger: `
          <div>
            <button type='button' data-testid='trigger'>Info</button>
            <a href='#' data-testid='alt-trigger'>Alt</a>
          </div>
        `
      }
    );

    const triggerButton = getTriggerButton();
    const triggerHost = getTriggerHost();
    const altTrigger = document.body.querySelector("[data-testid='alt-trigger']") as HTMLElement | null;

    expect(triggerButton).not.toBeNull();
    expect(triggerHost).not.toBeNull();
    expect(altTrigger).not.toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const firstId = triggerButton?.getAttribute("aria-describedby");
    expect(firstId).toMatch(/^budget-popover-\d+$/);

    triggerButton?.setAttribute("disabled", "true");

    const vm = wrapper.vm as unknown as { applyManagedDescription: () => void };
    vm.applyManagedDescription();

    expect(triggerButton?.getAttribute("aria-describedby")).toBeNull();
    expect(altTrigger?.getAttribute("aria-describedby")).toBe(firstId);
  });

  it("uses trigger host as anchor when no focusable child exists", async () => {
    mountPopover(
      {},
      {
        trigger: "<span data-testid='plain-trigger'>Texte</span>"
      }
    );

    const triggerHost = getTriggerHost();
    const plainTrigger = document.body.querySelector("[data-testid='plain-trigger']") as HTMLElement | null;
    expect(triggerHost).not.toBeNull();
    expect(plainTrigger).not.toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();

    const describedBy = triggerHost?.getAttribute("aria-describedby");
    expect(describedBy).toMatch(/^budget-popover-\d+$/);
    expect(plainTrigger?.getAttribute("aria-describedby")).toBeNull();
  });

  it("updates preferred placement while closed without opening", async () => {
    const wrapper = mountPopover({ placement: "top" });
    await wrapper.setProps({ placement: "right" });
    await nextTick();

    expect(getTooltip()).toBeNull();

    const vm = wrapper.vm as unknown as { computedPlacement: "top" | "bottom" | "left" | "right" };
    expect(vm.computedPlacement).toBe("right");
  });

  it("covers onWindowChanged branch for open and closed states", async () => {
    const wrapper = mountPopover();
    const vm = wrapper.vm as unknown as { onWindowChanged: () => void };
    const triggerHost = getTriggerHost();

    vm.onWindowChanged();
    expect(getTooltip()).toBeNull();

    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    vm.onWindowChanged();
    expect(getTooltip()).not.toBeNull();
  });

  it("covers helper guards for missing refs", async () => {
    const wrapper = mountPopover();
    const vm = wrapper.vm as unknown as {
      setPopoverPosition: () => void;
      applyManagedDescription: () => void;
      $: { setupState: Record<string, unknown> };
    };

    vm.setPopoverPosition();

    const triggerHost = getTriggerHost();
    triggerHost?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(90);
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    const setupState = vm.$.setupState as {
      triggerRef?: { value: HTMLElement | null };
      popoverRef?: { value: HTMLElement | null };
    };

    if (setupState.triggerRef) {
      setupState.triggerRef.value = null;
    }
    vm.applyManagedDescription();
    vm.setPopoverPosition();

    if (setupState.popoverRef) {
      setupState.popoverRef.value = null;
    }
    vm.setPopoverPosition();
  });

  it("covers internal utility helpers directly", () => {
    const wrapper = mountPopover();
    const vm = wrapper.vm as unknown as {
      getAvailableSpaces: (rect: DOMRect, padding: number) => {
        top: number;
        bottom: number;
        left: number;
        right: number;
      };
      resolveAnchorElement: () => HTMLElement | null;
      applyManagedDescription: () => void;
      setPopoverPosition: () => void;
      $: { setupState: Record<string, unknown> };
    };

    const setupState = vm.$.setupState as {
      triggerRef?: { value: HTMLElement | null };
      popoverRef?: { value: HTMLElement | null };
    };

    const spaces = vm.getAvailableSpaces(
      {
        x: 0,
        y: 0,
        width: 80,
        height: 20,
        top: 100,
        left: 200,
        right: 280,
        bottom: 120,
        toJSON: () => ({})
      } as DOMRect,
      8
    );

    expect(spaces.top).toBe(92);
    expect(spaces.left).toBe(192);
    expect(spaces.right).toBe(912);

    expect(vm.resolveAnchorElement()).not.toBeNull();
    vm.applyManagedDescription();

    if (setupState.popoverRef) {
      setupState.popoverRef.value = {
        getBoundingClientRect: () =>
          ({
            x: 0,
            y: 0,
            width: 100,
            height: 40,
            top: 0,
            left: 0,
            right: 100,
            bottom: 40,
            toJSON: () => ({})
          }) as DOMRect
      } as unknown as HTMLElement;
      vm.setPopoverPosition();
    }
  });
});
