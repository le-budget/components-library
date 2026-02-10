import { mount } from "@vue/test-utils";
import BudgetInputFile from "../src/components/BudgetInputFile/BudgetInputFile.vue";

function createFile(name: string, type: string, size = 10) {
  const blob = new Blob(["a".repeat(size)], { type });
  return new File([blob], name, { type });
}

describe("BudgetInputFile", () => {
  it("renders label and default placeholder", () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        label: "Piece jointe"
      }
    });

    expect(wrapper.text()).toContain("Piece jointe");
    expect(wrapper.text()).toContain("Aucun fichier selectionne");
  });

  it("emits selected file", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null }
    });

    const input = wrapper.find("input[type='file']");
    const file = createFile("doc.pdf", "application/pdf", 20);

    Object.defineProperty(input.element, "files", {
      value: [file],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([file]);
  });

  it("emits null when selection is cleared by input", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null }
    });

    const input = wrapper.find("input[type='file']");

    Object.defineProperty(input.element, "files", {
      value: [],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
  });

  it("rejects invalid type and emits invalid payload", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        accept: ".pdf"
      }
    });

    const input = wrapper.find("input[type='file']");
    const file = createFile("image.png", "image/png", 20);

    Object.defineProperty(input.element, "files", {
      value: [file],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("invalid")?.[0]?.[0]).toMatchObject({
      reason: "type",
      file,
      acceptedTypes: [".pdf"]
    });
    expect(wrapper.text()).toContain("Type de fichier non autorise");
  });

  it("accepts wildcard mime rules", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        accept: "image/*"
      }
    });

    const input = wrapper.find("input[type='file']");
    const file = createFile("image.png", "image/png", 20);

    Object.defineProperty(input.element, "files", {
      value: [file],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([file]);
  });

  it("accepts exact mime type rules", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        accept: "application/pdf"
      }
    });

    const input = wrapper.find("input[type='file']");
    const file = createFile("doc.pdf", "application/pdf", 20);

    Object.defineProperty(input.element, "files", {
      value: [file],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([file]);
  });

  it("rejects file over max size", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        maxFileSize: 5
      }
    });

    const input = wrapper.find("input[type='file']");
    const file = createFile("doc.pdf", "application/pdf", 10);

    Object.defineProperty(input.element, "files", {
      value: [file],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("invalid")?.[0]?.[0]).toMatchObject({
      reason: "size",
      file,
      maxFileSize: 5
    });
    expect(wrapper.text()).toContain("Fichier trop volumineux");
  });

  it("formats max size in Mo when over 1MB", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        maxFileSize: 2 * 1024 * 1024
      }
    });

    const input = wrapper.find("input[type='file']");
    const file = createFile("doc.pdf", "application/pdf", 3 * 1024 * 1024);

    Object.defineProperty(input.element, "files", {
      value: [file],
      configurable: true
    });
    await input.trigger("change");

    expect(wrapper.text()).toContain("max 2.0 Mo");
  });

  it("handles drag and drop", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null }
    });

    const dropzone = wrapper.find("[role='button']");
    const file = createFile("drop.pdf", "application/pdf", 20);

    await dropzone.trigger("dragover", {
      preventDefault: () => undefined
    });
    expect(dropzone.classes()).toContain("bg-slate-50");

    await dropzone.trigger("drop", {
      preventDefault: () => undefined,
      dataTransfer: {
        files: [file]
      }
    });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([file]);
  });

  it("clears drag state on dragleave", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null }
    });

    const dropzone = wrapper.find("[role='button']");
    await dropzone.trigger("dragover", {
      preventDefault: () => undefined
    });
    expect(dropzone.classes()).toContain("bg-slate-50");

    await dropzone.trigger("dragleave", {
      preventDefault: () => undefined
    });
    expect(dropzone.classes()).not.toContain("bg-slate-50");
  });

  it("ignores drop when no file is provided", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null }
    });

    const dropzone = wrapper.find("[role='button']");
    await dropzone.trigger("drop", {
      preventDefault: () => undefined,
      dataTransfer: {
        files: []
      }
    });

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("ignores drop when disabled", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null, disabled: true }
    });

    const dropzone = wrapper.find("[role='button']");
    await dropzone.trigger("drop", {
      preventDefault: () => undefined,
      dataTransfer: {
        files: [createFile("doc.pdf", "application/pdf", 20)]
      }
    });

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("ignores dragover and dragleave when disabled", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null, disabled: true }
    });

    const dropzone = wrapper.find("[role='button']");
    await dropzone.trigger("dragover", {
      preventDefault: () => undefined
    });
    await dropzone.trigger("dragleave", {
      preventDefault: () => undefined
    });

    expect(dropzone.classes()).not.toContain("bg-slate-50");
  });

  it("opens picker with keyboard", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null }
    });

    const input = wrapper.find("input[type='file']");
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, "click");

    await wrapper.find("[role='button']").trigger("keydown", {
      key: "Enter",
      preventDefault: () => undefined
    });

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("ignores unsupported keyboard keys", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: { modelValue: null }
    });

    const input = wrapper.find("input[type='file']");
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, "click");

    await wrapper.find("[role='button']").trigger("keydown", {
      key: "Escape",
      preventDefault: () => undefined
    });

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("supports clear action", async () => {
    const file = createFile("doc.pdf", "application/pdf", 20);
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: file
      }
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
  });

  it("does not clear when disabled", async () => {
    const file = createFile("doc.pdf", "application/pdf", 20);
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: file,
        disabled: true
      }
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("covers disabled clear guard via setup method", () => {
    const file = createFile("doc.pdf", "application/pdf", 20);
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: file,
        disabled: true
      }
    });

    const clearFile = (wrapper.vm as any).$?.setupState?.clearFile as
      | (() => void)
      | undefined;
    expect(typeof clearFile).toBe("function");
    clearFile?.();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("resets native input and local error when modelValue is cleared", async () => {
    const initialFile = createFile("doc.pdf", "application/pdf", 20);
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: initialFile,
        accept: ".pdf"
      }
    });

    const input = wrapper.find("input[type='file']");
    Object.defineProperty(input.element, "value", {
      value: "C:\\fakepath\\doc.pdf",
      writable: true,
      configurable: true
    });

    const invalidFile = createFile("image.png", "image/png", 20);
    Object.defineProperty(input.element, "files", {
      value: [invalidFile],
      configurable: true
    });
    await input.trigger("change");
    expect(wrapper.text()).toContain("Type de fichier non autorise");

    await wrapper.setProps({ modelValue: null });

    expect((input.element as HTMLInputElement).value).toBe("");
    expect(wrapper.text()).not.toContain("Type de fichier non autorise");
  });

  it("handles watcher path when modelValue becomes non-null", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null
      }
    });

    await wrapper.setProps({
      modelValue: createFile("new.pdf", "application/pdf", 20)
    });

    expect(wrapper.text()).toContain("new.pdf");
  });

  it("keeps local error when external error prop is true", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        error: true,
        accept: ".pdf"
      }
    });

    const input = wrapper.find("input[type='file']");
    const invalidFile = createFile("image.png", "image/png", 20);
    Object.defineProperty(input.element, "files", {
      value: [invalidFile],
      configurable: true
    });
    await input.trigger("change");
    expect(wrapper.text()).toContain("Type de fichier non autorise");

    await wrapper.setProps({
      modelValue: createFile("valid.pdf", "application/pdf", 20)
    });

    expect(wrapper.text()).toContain("Type de fichier non autorise");
  });

  it("covers clear path when input ref is null", () => {
    const file = createFile("doc.pdf", "application/pdf", 20);
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: file
      }
    });

    const setupState = (wrapper.vm as any).$?.setupState;
    setupState.inputRef = null;
    const clearFile = setupState.clearFile as () => void;
    clearFile();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
  });

  it("applies color variants", () => {
    const success = mount(BudgetInputFile, {
      props: { modelValue: null, color: "success" }
    });
    expect(success.find("[role='button']").classes()).toContain("border-c-green");

    const warning = mount(BudgetInputFile, {
      props: { modelValue: null, color: "warning" }
    });
    expect(warning.find("[role='button']").classes()).toContain("border-c-orange");

    const neutral = mount(BudgetInputFile, {
      props: { modelValue: null, color: "neutral" }
    });
    expect(neutral.find("[role='button']").classes()).toContain("border-slate-400");
  });

  it("error state overrides color and binds aria-describedby", () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        color: "success",
        error: true,
        errorMessage: "Erreur"
      }
    });

    const input = wrapper.find("input[type='file']");
    const dropzone = wrapper.find("[role='button']");

    expect(dropzone.classes()).toContain("border-c-red");
    expect(input.attributes("aria-invalid")).toBe("true");
    const errorId = input.attributes("aria-describedby");
    expect(errorId).toBeDefined();
    expect(wrapper.find(`#${errorId}`).text()).toContain("Erreur");
  });

  it("uses default error message when error is true", () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        error: true
      }
    });

    expect(wrapper.text()).toContain("Fichier invalide");
  });

  it("supports size classes", () => {
    const sm = mount(BudgetInputFile, {
      props: { modelValue: null, size: "sm" }
    });
    expect(sm.find("[role='button']").classes()).toContain("p-3");

    const md = mount(BudgetInputFile, {
      props: { modelValue: null, size: "md" }
    });
    expect(md.find("[role='button']").classes()).toContain("p-4");

    const lg = mount(BudgetInputFile, {
      props: { modelValue: null, size: "lg" }
    });
    expect(lg.find("[role='button']").classes()).toContain("p-5");
  });

  it("renders accept and max file size hints", () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        accept: [".pdf", "image/*"],
        maxFileSize: 2048
      }
    });

    expect(wrapper.text()).toContain("Types autorises: .pdf,image/*");
    expect(wrapper.text()).toContain("Taille max:");
  });

  it("is non interactive when disabled", async () => {
    const wrapper = mount(BudgetInputFile, {
      props: {
        modelValue: null,
        disabled: true
      }
    });

    const dropzone = wrapper.find("[role='button']");
    expect(dropzone.attributes("tabindex")).toBe("-1");
    expect(dropzone.attributes("aria-disabled")).toBe("true");

    const input = wrapper.find("input[type='file']");
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, "click");

    await dropzone.trigger("keydown", {
      key: "Enter",
      preventDefault: () => undefined
    });

    expect(clickSpy).not.toHaveBeenCalled();
  });
});
