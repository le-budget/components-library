import { nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import BudgetDrawer from "../src/components/BudgetDrawer/BudgetDrawer.vue";

const mountedWrappers: VueWrapper[] = [];

function getDialog() {
  return document.body.querySelector('[role="dialog"]') as HTMLElement | null;
}

function mountDrawer(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(BudgetDrawer, {
    props,
    slots: {
      default: "<button type='button' data-testid='inner'>Action</button>",
      ...slots
    }
  });

  mountedWrappers.push(wrapper);
  return wrapper;
}

describe("BudgetDrawer", () => {
  afterEach(() => {
    mountedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
  });

  it("is closed by default", () => {
    mountDrawer();
    expect(getDialog()).toBeNull();
  });

  it("opens in uncontrolled mode with defaultOpen", () => {
    mountDrawer({ defaultOpen: true, title: "Filtres" });
    const dialog = getDialog();

    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(document.body.textContent).toContain("Filtres");
  });

  it("supports controlled mode with modelValue", async () => {
    const wrapper = mountDrawer({ modelValue: false, title: "Panneau" });
    expect(getDialog()).toBeNull();

    await wrapper.setProps({ modelValue: true });
    expect(getDialog()).not.toBeNull();

    await wrapper.setProps({ modelValue: false });
    await nextTick();
    expect(getDialog()).toBeNull();
  });

  it("updates uncontrolled state when defaultOpen prop changes", async () => {
    const wrapper = mountDrawer({ defaultOpen: false, modelValue: null });
    expect(getDialog()).toBeNull();

    await wrapper.setProps({ defaultOpen: true });
    await nextTick();
    expect(getDialog()).not.toBeNull();

    await wrapper.setProps({ defaultOpen: false });
    await nextTick();
    expect(getDialog()).toBeNull();
  });

  it("closes in uncontrolled mode and emits events", async () => {
    const wrapper = mountDrawer({ defaultOpen: true, modelValue: null });
    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer le panneau"]'
    ) as HTMLButtonElement | null;

    expect(closeButton).not.toBeNull();
    closeButton?.click();
    await nextTick();

    expect(getDialog()).toBeNull();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("emits close and update:modelValue when clicking close button", async () => {
    const wrapper = mountDrawer({ modelValue: true, closeLabel: "Fermer le drawer" });
    const button = document.body.querySelector(
      'button[aria-label="Fermer le drawer"]'
    ) as HTMLButtonElement | null;

    expect(button).not.toBeNull();
    button?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("closes on overlay click when enabled", async () => {
    const wrapper = mountDrawer({ modelValue: true, closeOnOverlay: true });
    const overlay = document.body.querySelector(".bg-slate-900\\/40") as HTMLElement | null;

    expect(overlay).not.toBeNull();
    overlay?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("does not close on overlay click when disabled", async () => {
    const wrapper = mountDrawer({ modelValue: true, closeOnOverlay: false });
    const overlay = document.body.querySelector(".bg-slate-900\\/40") as HTMLElement | null;

    expect(overlay).not.toBeNull();
    overlay?.click();
    await nextTick();

    expect(wrapper.emitted("close")).toBeUndefined();
  });

  it("closes on Escape when enabled and ignores when disabled", async () => {
    const enabled = mountDrawer({ modelValue: true, closeOnEscape: true });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(enabled.emitted("close")).toHaveLength(1);

    const disabled = mountDrawer({ modelValue: true, closeOnEscape: false });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(disabled.emitted("close")).toBeUndefined();
  });

  it("applies placement and border classes", () => {
    mountDrawer({
      modelValue: true,
      placement: "left",
      borderColor: "primary",
      borderThickness: "md"
    });
    const leftDialog = getDialog();
    expect(leftDialog?.className).toContain("left-0");
    expect(leftDialog?.className).toContain("border-r-2");
    expect(leftDialog?.className).toContain("border-c-blue-dark");

    document.body.innerHTML = "";
    mountDrawer({
      modelValue: true,
      placement: "right",
      borderColor: "error",
      borderThickness: "lg"
    });
    const rightDialog = getDialog();
    expect(rightDialog?.className).toContain("right-0");
    expect(rightDialog?.className).toContain("border-l-4");
    expect(rightDialog?.className).toContain("border-c-red-dark");
  });

  it("applies right medium border thickness", () => {
    mountDrawer({
      modelValue: true,
      placement: "right",
      borderColor: "primary",
      borderThickness: "md"
    });
    const dialog = getDialog();
    expect(dialog?.className).toContain("border-l-2");
  });

  it("supports neutral border and no border thickness", () => {
    mountDrawer({
      modelValue: true,
      borderColor: "neutral",
      borderThickness: "sm"
    });
    const neutralDialog = getDialog();
    expect(neutralDialog?.className).toContain("border-slate-500");
    expect(neutralDialog?.className).toContain("border-l");

    document.body.innerHTML = "";
    mountDrawer({
      modelValue: true,
      borderThickness: "none"
    });
    const noBorderDialog = getDialog();
    expect(noBorderDialog?.className.includes("border-l")).toBe(false);
    expect(noBorderDialog?.className.includes("border-r")).toBe(false);
  });

  it("applies remaining border combinations (left sm/lg and success/warning colors)", () => {
    mountDrawer({
      modelValue: true,
      placement: "left",
      borderColor: "success",
      borderThickness: "sm"
    });
    let dialog = getDialog();
    expect(dialog?.className).toContain("border-r");
    expect(dialog?.className).toContain("border-c-green-dark");

    document.body.innerHTML = "";
    mountDrawer({
      modelValue: true,
      placement: "left",
      borderColor: "warning",
      borderThickness: "lg"
    });
    dialog = getDialog();
    expect(dialog?.className).toContain("border-r-4");
    expect(dialog?.className).toContain("border-c-orange-dark");
  });

  it("renders icon and footer slot", () => {
    mountDrawer(
      { modelValue: true, title: "Infos", icon: "status-info" },
      { footer: "<div data-testid='footer'>Actions</div>" }
    );

    expect(document.body.textContent).toContain("Infos");
    expect(document.body.querySelector("svg")).not.toBeNull();
    expect(document.body.querySelector('[data-testid="footer"]')).not.toBeNull();
  });

  it("hides overlay when showOverlay is false", () => {
    mountDrawer({ modelValue: true, showOverlay: false });
    expect(document.body.querySelector(".bg-slate-900\\/40")).toBeNull();
  });

  it("uses default width class and custom width class", () => {
    mountDrawer({ modelValue: true });
    expect(getDialog()?.className).toContain("max-w-md");

    document.body.innerHTML = "";
    mountDrawer({ modelValue: true, widthClass: "w-full max-w-xl" });
    expect(getDialog()?.className).toContain("max-w-xl");
  });

  it("traps tab focus inside drawer", async () => {
    mountDrawer({ modelValue: true, title: "Focus" });
    await nextTick();

    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer le panneau"]'
    ) as HTMLButtonElement | null;
    const innerButton = document.body.querySelector(
      '[data-testid="inner"]'
    ) as HTMLButtonElement | null;

    expect(closeButton).not.toBeNull();
    expect(innerButton).not.toBeNull();

    innerButton?.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();
    expect(document.activeElement).toBe(closeButton);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true })
    );
    await nextTick();
    expect(document.activeElement).toBe(innerButton);
  });

  it("wraps focus from last to first on Tab", async () => {
    mountDrawer({ modelValue: true, title: "Wrap focus" });
    await nextTick();

    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer le panneau"]'
    ) as HTMLButtonElement | null;
    const innerButton = document.body.querySelector(
      '[data-testid="inner"]'
    ) as HTMLButtonElement | null;

    expect(closeButton).not.toBeNull();
    expect(innerButton).not.toBeNull();

    innerButton?.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(closeButton);
  });

  it("covers non-shift tab branch from last element via handler call", async () => {
    const wrapper = mountDrawer({ modelValue: true });
    await nextTick();

    const vm = wrapper.vm as unknown as {
      onDocumentKeydown: (event: KeyboardEvent) => void;
    };
    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer le panneau"]'
    ) as HTMLButtonElement | null;
    const innerButton = document.body.querySelector(
      '[data-testid="inner"]'
    ) as HTMLButtonElement | null;

    expect(closeButton).not.toBeNull();
    expect(innerButton).not.toBeNull();

    innerButton?.focus();
    vm.onDocumentKeydown(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(closeButton);
  });

  it("covers non-shift tab condition when active element is not last", async () => {
    const wrapper = mountDrawer({ modelValue: true });
    await nextTick();

    const vm = wrapper.vm as unknown as {
      onDocumentKeydown: (event: KeyboardEvent) => void;
    };
    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer le panneau"]'
    ) as HTMLButtonElement | null;

    expect(closeButton).not.toBeNull();
    closeButton?.focus();
    vm.onDocumentKeydown(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(closeButton);
  });

  it("moves focus to first focusable element when tab is pressed from outside", async () => {
    mountDrawer({ modelValue: true, title: "Focus outside" });
    await nextTick();

    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer le panneau"]'
    ) as HTMLButtonElement | null;
    const outsideButton = document.createElement("button");
    outsideButton.type = "button";
    outsideButton.textContent = "Outside";
    document.body.appendChild(outsideButton);

    expect(closeButton).not.toBeNull();
    outsideButton.focus();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(closeButton);
  });

  it("focuses drawer container when no focusable elements are available", async () => {
    mountDrawer(
      { modelValue: true, title: "No focusable" },
      { default: "<span>Aucun focusable</span>" }
    );
    await nextTick();

    const dialog = getDialog();
    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer le panneau"]'
    ) as HTMLButtonElement | null;

    expect(dialog).not.toBeNull();
    expect(closeButton).not.toBeNull();

    closeButton?.setAttribute("disabled", "true");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(dialog);
  });

  it("covers internal early-return guards", async () => {
    const wrapper = mountDrawer({ modelValue: false, borderThickness: "none" });
    const vm = wrapper.vm as unknown as {
      getFocusableElements: () => HTMLElement[];
      closeDrawer: () => void;
      onDocumentKeydown: (event: KeyboardEvent) => void;
      borderSideClass: string;
    };

    expect(vm.getFocusableElements()).toEqual([]);
    expect(vm.borderSideClass).toBe("");
    vm.onDocumentKeydown(new KeyboardEvent("keydown", { key: "Tab" }));
    vm.closeDrawer();

    expect(wrapper.emitted("close")).toBeUndefined();
  });

  it("ignores defaultOpen updates when component is controlled", async () => {
    const wrapper = mountDrawer({ modelValue: true, defaultOpen: true });
    expect(getDialog()).not.toBeNull();

    await wrapper.setProps({ defaultOpen: false });
    await nextTick();

    expect(getDialog()).not.toBeNull();
  });
});
