import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import BudgetDatepicker from "../src/components/BudgetDatepicker/BudgetDatepicker.vue";

function mountDatepicker(props: Record<string, unknown> = {}) {
  return mount(BudgetDatepicker, {
    attachTo: document.body,
    props: {
      modelValue: null,
      label: "Date",
      ...props
    }
  });
}

describe("BudgetDatepicker", () => {
  it("renders formatted french date from ISO model value", () => {
    const wrapper = mountDatepicker({ modelValue: "2026-02-08" });
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe("08/02/2026");
  });

  it("does not render label when omitted", () => {
    const wrapper = mountDatepicker({ label: undefined });
    expect(wrapper.find("label").exists()).toBe(false);
  });

  it("keeps calendar closed by default", () => {
    const wrapper = mountDatepicker();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it("renders calendar dialog when opened", async () => {
    const wrapper = mountDatepicker();
    await wrapper.find("input").trigger("focus");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
  });

  it("formats partial french input and emits null when emptied", async () => {
    const wrapper = mountDatepicker();
    const input = wrapper.find("input");

    await input.setValue("1202");
    expect((input.element as HTMLInputElement).value).toBe("12/02");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await input.setValue("");
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([null]);
  });

  it("emits ISO value when a valid french date is typed", async () => {
    const wrapper = mountDatepicker();
    const input = wrapper.find("input");

    await input.setValue("08022026");
    expect((input.element as HTMLInputElement).value).toBe("08/02/2026");
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-08"]);
  });

  it("does not emit for invalid typed date", async () => {
    const wrapper = mountDatepicker();
    const input = wrapper.find("input");

    await input.setValue("31/02/2026");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("does not emit when typed date is out of bounds", async () => {
    const wrapper = mountDatepicker({
      minDate: "2026-02-10",
      maxDate: "2026-02-20"
    });
    const input = wrapper.find("input");

    await input.setValue("09/02/2026");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("opens on focus and closes on escape and outside click", async () => {
    const wrapper = mountDatepicker({ modelValue: "2026-02-15" });
    const input = wrapper.find("input");

    expect(input.attributes("aria-expanded")).toBe("false");
    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("true");

    await input.trigger("keydown", { key: "Escape" });
    expect(input.attributes("aria-expanded")).toBe("false");

    await input.trigger("focus");
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("keeps calendar open on inside click", async () => {
    const wrapper = mountDatepicker({ modelValue: "2026-02-15" });
    const input = wrapper.find("input");
    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("true");

    input.element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("opens via trigger button and can navigate months", async () => {
    const wrapper = mountDatepicker({ modelValue: "2026-02-15" });
    const input = wrapper.find("input");
    const openButton = wrapper.find('button[aria-label="Ouvrir le calendrier"]');

    await openButton.trigger("click");
    expect(input.attributes("aria-expanded")).toBe("true");

    await wrapper.find('button[aria-label="Mois suivant"]').trigger("click");
    expect(wrapper.text()).toContain("mars 2026");

    await wrapper.find('button[aria-label="Mois precedent"]').trigger("click");
    expect(wrapper.text()).toContain("février 2026");
  });

  it("disables month navigation outside min and max bounds", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15",
      minDate: "2026-02-10",
      maxDate: "2026-02-20"
    });
    await wrapper.find("input").trigger("focus");

    const prevButton = wrapper.find('button[aria-label="Mois precedent"]');
    const nextButton = wrapper.find('button[aria-label="Mois suivant"]');
    expect(prevButton.attributes("disabled")).toBeDefined();
    expect(nextButton.attributes("disabled")).toBeDefined();
  });

  it("grays and disables out-of-range days, and selects enabled day", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15",
      minDate: "2026-02-10",
      maxDate: "2026-02-20"
    });
    await wrapper.find("input").trigger("focus");

    const dayNine = wrapper
      .findAll('button[role="gridcell"]')
      .find((node) => node.text() === "9");
    expect(dayNine).toBeDefined();
    expect(dayNine!.attributes("disabled")).toBeDefined();

    await dayNine!.trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    const dayFifteen = wrapper
      .findAll('button[role="gridcell"]')
      .find((node) => node.text() === "15");
    expect(dayFifteen).toBeDefined();
    await dayFifteen!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-15"]);
    expect(wrapper.find("input").attributes("aria-expanded")).toBe("false");
  });

  it("supports keyboard navigation and enter selection", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");

    await input.trigger("keydown", { key: "ArrowRight" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-16"]);
  });

  it("moves focus by week with ArrowDown when already open", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");

    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-22"]);
  });

  it("moves focus to previous day with ArrowLeft when open", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");

    await input.trigger("keydown", { key: "ArrowLeft" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-14"]);
  });

  it("moves focus by week backward with ArrowUp when open", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");

    await input.trigger("keydown", { key: "ArrowUp" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-08"]);
  });

  it("opens from ArrowDown when closed and closes on Tab", async () => {
    const wrapper = mountDatepicker();
    const input = wrapper.find("input");

    await input.trigger("keydown", { key: "ArrowDown" });
    expect(input.attributes("aria-expanded")).toBe("true");

    await input.trigger("keydown", { key: "Tab" });
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("opens on click when closed", async () => {
    const wrapper = mountDatepicker();
    const input = wrapper.find("input");
    expect(input.attributes("aria-expanded")).toBe("false");

    await input.trigger("click");
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("ignores non-navigation keydown when closed", async () => {
    const wrapper = mountDatepicker();
    const input = wrapper.find("input");

    await input.trigger("keydown", { key: "Enter" });
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("does not open when disabled", async () => {
    const wrapper = mountDatepicker({ disabled: true });
    const input = wrapper.find("input");

    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("false");

    await wrapper.find('button[aria-label="Ouvrir le calendrier"]').trigger("click");
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("emits null when parent value becomes outside bounds", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-08",
      minDate: "2026-02-01",
      maxDate: "2026-02-10"
    });

    await wrapper.setProps({ minDate: "2026-02-09" });
    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual([null]);
  });

  it("renders error state and default error message", () => {
    const wrapper = mountDatepicker({
      error: true
    });
    const input = wrapper.find("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    const errorId = input.attributes("aria-describedby");
    expect(errorId).toBeDefined();
    expect(wrapper.find(`#${errorId}`).text()).toContain("Valeur invalide");
  });

  it("applies success, size and align classes", () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-08",
      success: true,
      size: "sm",
      align: "right"
    });
    const input = wrapper.find("input");
    expect(input.classes()).toContain("border-c-green");
    expect(input.classes()).toContain("py-1.5");
    expect(input.classes()).toContain("text-right");
  });

  it("error style overrides success and uses lg classes", () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-08",
      error: true,
      success: true,
      size: "lg"
    });
    const input = wrapper.find("input");
    expect(input.classes()).toContain("border-c-red");
    expect(input.classes()).not.toContain("border-c-green");
    expect(input.classes()).toContain("py-2.5");
  });

  it("supports invalid iso and invalid bounds without crashing", async () => {
    const wrapper = mountDatepicker({
      modelValue: "invalid-value",
      minDate: "invalid-min",
      maxDate: "invalid-max"
    });
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe("");

    await wrapper.find("input").trigger("focus");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
  });

  it("treats impossible ISO dates as empty values", () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-31"
    });
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("clamps fallback month to maxDate when no value is selected", async () => {
    const wrapper = mountDatepicker({
      modelValue: null,
      maxDate: "2020-01-01"
    });
    await wrapper.find("input").trigger("focus");
    expect(wrapper.text()).toContain("janvier 2020");
  });

  it("keeps open state on repeated click and safely unmounts", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-08"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("true");

    await input.trigger("click");
    expect(input.attributes("aria-expanded")).toBe("true");

    wrapper.unmount();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  });

  it("updates focused day from mouseenter then selects with Enter", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");

    const dayTwenty = wrapper
      .findAll('button[role="gridcell"]')
      .find((node) => node.text() === "20");
    expect(dayTwenty).toBeDefined();
    await dayTwenty!.trigger("mouseenter");
    await input.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-20"]);
  });

  it("handles Enter key from native KeyboardEvent when open", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");
    input.element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.pop()).toEqual(["2026-02-15"]);
  });

  it("does not reset display from watcher while calendar is open", async () => {
    const wrapper = mountDatepicker({
      modelValue: "2026-02-15"
    });
    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.setValue("12/02");

    await wrapper.setProps({ modelValue: "2026-02-20" });
    expect((input.element as HTMLInputElement).value).toBe("12/02");
  });
});
