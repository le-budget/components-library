import { mount } from "@vue/test-utils";
import BudgetToggle from "../src/components/BudgetToggle/BudgetToggle.vue";

describe("BudgetToggle", () => {
  it("emits update:modelValue on change", async () => {
    const wrapper = mount(BudgetToggle, {
      props: {
        modelValue: false
      }
    });

    const input = wrapper.find("input");
    await input.setValue(true);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
  });

  it("uses generated id, default aria label and default inactive style", () => {
    const wrapper = mount(BudgetToggle, {
      props: {
        modelValue: false
      }
    });

    const input = wrapper.find("input");
    const track = wrapper.find('span[aria-hidden="true"]');

    expect(input.attributes("id")).toMatch(/^budget-toggle-\d+$/);
    expect(input.attributes("aria-label")).toBe("Toggle");
    expect(input.attributes("aria-checked")).toBe("false");
    expect(track.classes()).toContain("bg-slate-300");
  });

  it("supports id, name, disabled and custom aria label", () => {
    const wrapper = mount(BudgetToggle, {
      props: {
        modelValue: true,
        id: "billing-toggle",
        name: "billing",
        disabled: true,
        ariaLabel: "Activer la facturation"
      }
    });

    const label = wrapper.find("label");
    const input = wrapper.find("input");

    expect(label.classes()).toContain("cursor-not-allowed");
    expect(input.attributes("id")).toBe("billing-toggle");
    expect(input.attributes("name")).toBe("billing");
    expect(input.attributes("disabled")).toBeDefined();
    expect(input.attributes("aria-label")).toBe("Activer la facturation");
    expect(input.attributes("aria-checked")).toBe("true");
  });

  it("shows optional state text only for the current state", async () => {
    const wrapper = mount(BudgetToggle, {
      props: {
        modelValue: true,
        activeText: "Actif",
        inactiveText: "Inactif"
      }
    });

    expect(wrapper.text()).toContain("Actif");
    expect(wrapper.text()).not.toContain("Inactif");

    await wrapper.setProps({
      modelValue: false
    });

    expect(wrapper.text()).toContain("Inactif");
    expect(wrapper.text()).not.toContain("Actif");

    await wrapper.setProps({
      modelValue: true,
      activeText: undefined
    });

    expect(wrapper.text()).toBe("");
  });

  it("applies all color variants and falls back to primary for unknown value", () => {
    const primary = mount(BudgetToggle, {
      props: { modelValue: true, color: "primary" }
    });
    expect(primary.find('span[aria-hidden="true"]').classes()).toContain("bg-c-blue");

    const neutral = mount(BudgetToggle, {
      props: { modelValue: true, color: "neutral" }
    });
    expect(neutral.find('span[aria-hidden="true"]').classes()).toContain("bg-slate-500");

    const success = mount(BudgetToggle, {
      props: { modelValue: true, color: "success" }
    });
    expect(success.find('span[aria-hidden="true"]').classes()).toContain("bg-c-green");

    const warning = mount(BudgetToggle, {
      props: { modelValue: true, color: "warning" }
    });
    expect(warning.find('span[aria-hidden="true"]').classes()).toContain("bg-c-orange");

    const error = mount(BudgetToggle, {
      props: { modelValue: true, color: "error" }
    });
    expect(error.find('span[aria-hidden="true"]').classes()).toContain("bg-c-red");

    const fallback = mount(BudgetToggle, {
      props: { modelValue: true, color: "unknown" as never }
    });
    expect(fallback.find('span[aria-hidden="true"]').classes()).toContain("bg-c-blue");
  });

  it("applies sm, md, lg and xl sizes", () => {
    const small = mount(BudgetToggle, {
      props: { modelValue: true, size: "sm", activeText: "S" }
    });
    const smallTrack = small.find('span[aria-hidden="true"]');
    const smallThumb = smallTrack.find("span");
    const smallText = small.findAll("span").at(-1);
    expect(smallTrack.classes()).toContain("h-5");
    expect(smallTrack.classes()).toContain("w-9");
    expect(smallThumb.classes()).toContain("h-4");
    expect(smallThumb.classes()).toContain("w-4");
    expect(smallThumb.classes()).toContain("translate-x-4");
    expect(smallText?.classes()).toContain("text-xs");

    const medium = mount(BudgetToggle, {
      props: { modelValue: true, activeText: "M" }
    });
    const mediumTrack = medium.find('span[aria-hidden="true"]');
    const mediumThumb = mediumTrack.find("span");
    const mediumText = medium.findAll("span").at(-1);
    expect(mediumTrack.classes()).toContain("h-6");
    expect(mediumTrack.classes()).toContain("w-11");
    expect(mediumThumb.classes()).toContain("h-5");
    expect(mediumThumb.classes()).toContain("w-5");
    expect(mediumThumb.classes()).toContain("translate-x-5");
    expect(mediumText?.classes()).toContain("text-sm");

    const large = mount(BudgetToggle, {
      props: { modelValue: true, size: "lg", activeText: "L" }
    });
    const largeTrack = large.find('span[aria-hidden="true"]');
    const largeThumb = largeTrack.find("span");
    const largeText = large.findAll("span").at(-1);
    expect(largeTrack.classes()).toContain("h-7");
    expect(largeTrack.classes()).toContain("w-[3.25rem]");
    expect(largeThumb.classes()).toContain("h-6");
    expect(largeThumb.classes()).toContain("w-6");
    expect(largeThumb.classes()).toContain("translate-x-6");
    expect(largeText?.classes()).toContain("text-base");

    const extraLarge = mount(BudgetToggle, {
      props: { modelValue: true, size: "xl", activeText: "XL" }
    });
    const extraLargeTrack = extraLarge.find('span[aria-hidden="true"]');
    const extraLargeThumb = extraLargeTrack.find("span");
    const extraLargeText = extraLarge.findAll("span").at(-1);
    expect(extraLargeTrack.classes()).toContain("h-8");
    expect(extraLargeTrack.classes()).toContain("w-[3.75rem]");
    expect(extraLargeThumb.classes()).toContain("h-7");
    expect(extraLargeThumb.classes()).toContain("w-7");
    expect(extraLargeThumb.classes()).toContain("translate-x-7");
    expect(extraLargeText?.classes()).toContain("text-lg");
  });

  it("keeps thumb white in both states and uses text as aria label fallback", () => {
    const wrapper = mount(BudgetToggle, {
      props: {
        modelValue: false,
        inactiveText: "Desactive"
      }
    });

    const input = wrapper.find("input");
    const thumb = wrapper.find('span[aria-hidden="true"]').find("span");

    expect(input.attributes("aria-label")).toBe("Desactive");
    expect(thumb.classes()).toContain("bg-white");
    expect(thumb.classes()).toContain("translate-x-0");
  });
});
