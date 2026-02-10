import { nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import BudgetDialog from "../src/components/BudgetDialog/BudgetDialog.vue";

const mountedWrappers: VueWrapper[] = [];

function getDialog() {
  return document.body.querySelector('[role="dialog"]') as HTMLElement | null;
}

function mountDialog(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(BudgetDialog, {
    props,
    slots: {
      default: "<button type='button' data-testid='inner'>Action</button>",
      ...slots
    }
  });

  mountedWrappers.push(wrapper);
  return wrapper;
}

describe("BudgetDialog", () => {
  afterEach(() => {
    mountedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
  });

  it("is closed by default", () => {
    mountDialog();
    expect(getDialog()).toBeNull();
  });

  it("opens in uncontrolled mode with defaultOpen", () => {
    mountDialog({ defaultOpen: true, title: "Confirmation" });
    const dialog = getDialog();

    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(document.body.textContent).toContain("Confirmation");
  });

  it("supports controlled mode with open", async () => {
    const wrapper = mountDialog({ open: false, title: "Controle" });
    expect(getDialog()).toBeNull();

    await wrapper.setProps({ open: true });
    expect(getDialog()).not.toBeNull();

    await wrapper.setProps({ open: false });
    await nextTick();
    expect(getDialog()).toBeNull();
  });

  it("updates uncontrolled state when defaultOpen changes", async () => {
    const wrapper = mountDialog({ defaultOpen: false, open: null });
    expect(getDialog()).toBeNull();

    await wrapper.setProps({ defaultOpen: true });
    await nextTick();
    expect(getDialog()).not.toBeNull();

    await wrapper.setProps({ defaultOpen: false });
    await nextTick();
    expect(getDialog()).toBeNull();
  });

  it("ignores defaultOpen updates when controlled", async () => {
    const wrapper = mountDialog({ open: true, defaultOpen: true });
    expect(getDialog()).not.toBeNull();

    await wrapper.setProps({ defaultOpen: false });
    await nextTick();

    expect(getDialog()).not.toBeNull();
  });

  it("closes in uncontrolled mode and emits events", async () => {
    const wrapper = mountDialog({ defaultOpen: true, open: null });
    const button = document.body.querySelector(
      'button[aria-label="Fermer la fenetre"]'
    ) as HTMLButtonElement | null;

    expect(button).not.toBeNull();
    button?.click();
    await nextTick();

    expect(getDialog()).toBeNull();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("emits close and update:open on close button in controlled mode", async () => {
    const wrapper = mountDialog({ open: true, closeLabel: "Fermer le dialog" });
    const button = document.body.querySelector(
      'button[aria-label="Fermer le dialog"]'
    ) as HTMLButtonElement | null;

    expect(button).not.toBeNull();
    button?.click();
    await nextTick();

    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("hides close button when showClose is false and focuses dialog", async () => {
    mountDialog({ open: true, showClose: false, title: "Sans croix" });
    await nextTick();

    const dialog = getDialog();
    expect(document.body.querySelector('button[aria-label="Fermer la fenetre"]')).toBeNull();
    expect(dialog).not.toBeNull();
    expect(document.activeElement).toBe(dialog);
  });

  it("closes on overlay click when enabled", async () => {
    const wrapper = mountDialog({ open: true, closeOnOverlay: true });
    const overlay = document.body.querySelector(".bg-black\\/50") as HTMLElement | null;

    expect(overlay).not.toBeNull();
    overlay?.click();
    await nextTick();

    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("does not close on overlay click when disabled", async () => {
    const wrapper = mountDialog({ open: true, closeOnOverlay: false });
    const overlay = document.body.querySelector(".bg-black\\/50") as HTMLElement | null;

    expect(overlay).not.toBeNull();
    overlay?.click();
    await nextTick();

    expect(wrapper.emitted("close")).toBeUndefined();
  });

  it("hides overlay when showOverlay is false", () => {
    mountDialog({ open: true, showOverlay: false });
    expect(document.body.querySelector(".bg-black\\/50")).toBeNull();
  });

  it("closes on Escape when enabled and ignores when disabled", async () => {
    const enabled = mountDialog({ open: true, closeOnEscape: true });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(enabled.emitted("close")).toHaveLength(1);

    const disabled = mountDialog({ open: true, closeOnEscape: false });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(disabled.emitted("close")).toBeUndefined();
  });

  it("applies all color variants", () => {
    const cases: Array<{ color: "neutral" | "primary" | "success" | "warning" | "error"; expected: string }> = [
      { color: "neutral", expected: "border-t-slate-500" },
      { color: "primary", expected: "border-t-c-blue-dark" },
      { color: "success", expected: "border-t-c-green-dark" },
      { color: "warning", expected: "border-t-c-orange-dark" },
      { color: "error", expected: "border-t-c-red-dark" }
    ];

    for (const testCase of cases) {
      mountDialog({ open: true, color: testCase.color });
      expect(getDialog()?.className).toContain("border-t-4");
      expect(getDialog()?.className).toContain(testCase.expected);
      document.body.innerHTML = "";
    }
  });

  it("applies default and custom max width classes", () => {
    mountDialog({ open: true });
    expect(getDialog()?.className).toContain("max-w-lg");

    document.body.innerHTML = "";
    mountDialog({ open: true, maxWidthClass: "max-w-2xl" });
    expect(getDialog()?.className).toContain("max-w-2xl");
  });

  it("renders title association, icon slot and footer slot", () => {
    mountDialog(
      { open: true, title: "Information" },
      {
        icon: "<span data-testid='icon'>i</span>",
        footer: "<div data-testid='footer'>Actions</div>"
      }
    );

    const dialog = getDialog();
    expect(dialog?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(document.body.querySelector('[data-testid="icon"]')).not.toBeNull();
    expect(document.body.querySelector('[data-testid="footer"]')).not.toBeNull();
  });

  it("does not set aria-labelledby without title", () => {
    mountDialog({ open: true, title: "" });
    expect(getDialog()?.getAttribute("aria-labelledby")).toBeNull();
  });

  it("traps tab focus inside dialog", async () => {
    mountDialog({ open: true });
    await nextTick();

    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer la fenetre"]'
    ) as HTMLButtonElement | null;
    const innerButton = document.body.querySelector(
      "[data-testid='inner']"
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

  it("moves focus to first focusable element when tab is pressed from outside", async () => {
    mountDialog({ open: true });
    await nextTick();

    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer la fenetre"]'
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

  it("wraps focus from last to first on non-shift Tab via handler call", async () => {
    const wrapper = mountDialog({ open: true });
    await nextTick();

    const vm = wrapper.vm as unknown as {
      getFocusableElements: () => HTMLElement[];
      onDocumentKeydown: (event: KeyboardEvent) => void;
    };

    const focusable = vm.getFocusableElements();
    const first = focusable[0] as HTMLElement | undefined;
    const last = focusable[focusable.length - 1] as HTMLElement | undefined;

    expect(first).toBeDefined();
    expect(last).toBeDefined();
    expect(first).not.toBe(last);

    last?.focus();
    expect(document.activeElement).toBe(last);

    vm.onDocumentKeydown(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(first);
  });

  it("does not wrap on non-shift Tab when active element is not last", async () => {
    const wrapper = mountDialog({ open: true });
    await nextTick();

    const vm = wrapper.vm as unknown as {
      getFocusableElements: () => HTMLElement[];
      onDocumentKeydown: (event: KeyboardEvent) => void;
    };

    const focusable = vm.getFocusableElements();
    const first = focusable[0] as HTMLElement | undefined;

    expect(first).toBeDefined();

    first?.focus();
    vm.onDocumentKeydown(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(first);
  });

  it("focuses dialog container when there are no focusable elements", async () => {
    mountDialog(
      { open: true, title: "No focusable" },
      { default: "<span>Sans focusable</span>" }
    );
    await nextTick();

    const dialog = getDialog();
    const closeButton = document.body.querySelector(
      'button[aria-label="Fermer la fenetre"]'
    ) as HTMLButtonElement | null;

    expect(dialog).not.toBeNull();
    expect(closeButton).not.toBeNull();

    closeButton?.setAttribute("disabled", "true");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(dialog);
  });

  it("covers internal guard branches", async () => {
    const wrapper = mountDialog({ open: false });
    const vm = wrapper.vm as unknown as {
      getFocusableElements: () => HTMLElement[];
      closeDialog: () => void;
      onDocumentKeydown: (event: KeyboardEvent) => void;
    };

    expect(vm.getFocusableElements()).toEqual([]);
    vm.onDocumentKeydown(new KeyboardEvent("keydown", { key: "Tab" }));
    vm.onDocumentKeydown(new KeyboardEvent("keydown", { key: "Enter" }));
    vm.closeDialog();
    await nextTick();

    expect(wrapper.emitted("close")).toBeUndefined();
  });
});


