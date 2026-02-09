import { mount } from "@vue/test-utils";
import BudgetAvatar from "../src/components/BudgetAvatar/BudgetAvatar.vue";

describe("BudgetAvatar", () => {
  const image = "https://example.com/avatar.jpg";

  it("renders image with default props", () => {
    const wrapper = mount(BudgetAvatar, {
      props: { image }
    });

    const img = wrapper.get("img");
    expect(img.attributes("src")).toBe(image);
    expect(img.attributes("alt")).toBe("Avatar");
    expect(wrapper.classes()).toContain("rounded-full");
    expect(wrapper.classes()).toContain("h-[64px]");
    expect(wrapper.classes()).toContain("w-[64px]");
    expect(wrapper.classes()).toContain("border-2");
    expect(wrapper.classes()).toContain("border-c-blue-dark");
  });

  it("applies shape variants", () => {
    const rounded = mount(BudgetAvatar, {
      props: { image, shape: "rounded" }
    });
    expect(rounded.classes()).toContain("rounded-xl");

    const square = mount(BudgetAvatar, {
      props: { image, shape: "square" }
    });
    expect(square.classes()).toContain("rounded-none");
  });

  it("applies size variants", () => {
    const cases = [
      { size: "sm", classes: ["h-[48px]", "w-[48px]"] },
      { size: "md", classes: ["h-[64px]", "w-[64px]"] },
      { size: "lg", classes: ["h-[92px]", "w-[92px]"] },
      { size: "xl", classes: ["h-[128px]", "w-[128px]"] },
      { size: "xxl", classes: ["h-[256px]", "w-[256px]"] }
    ] as const;

    for (const { size, classes } of cases) {
      const wrapper = mount(BudgetAvatar, {
        props: { image, size }
      });
      for (const className of classes) {
        expect(wrapper.classes()).toContain(className);
      }
    }
  });

  it("applies border thickness variants", () => {
    const sm = mount(BudgetAvatar, {
      props: { image, thickness: "sm" }
    });
    expect(sm.classes()).toContain("border");

    const md = mount(BudgetAvatar, {
      props: { image, thickness: "md" }
    });
    expect(md.classes()).toContain("border-2");

    const lg = mount(BudgetAvatar, {
      props: { image, thickness: "lg" }
    });
    expect(lg.classes()).toContain("border-4");
  });

  it("applies alert color variants", () => {
    const cases = [
      { color: "primary", classes: ["border-c-blue-dark", "bg-c-blue-light/30"] },
      { color: "secondary", classes: ["border-c-blue", "bg-white"] },
      { color: "ghost", classes: ["border-c-blue/40", "bg-transparent"] },
      {
        color: "primary-success",
        classes: ["border-c-green-dark", "bg-c-green/15"]
      },
      { color: "secondary-success", classes: ["border-c-green", "bg-white"] },
      {
        color: "primary-warning",
        classes: ["border-c-orange-dark", "bg-c-orange/20"]
      },
      { color: "secondary-warning", classes: ["border-c-orange", "bg-white"] },
      { color: "primary-error", classes: ["border-c-red-dark", "bg-c-red/15"] },
      { color: "secondary-error", classes: ["border-c-red", "bg-white"] }
    ] as const;

    for (const { color, classes } of cases) {
      const wrapper = mount(BudgetAvatar, {
        props: { image, color }
      });
      for (const className of classes) {
        expect(wrapper.classes()).toContain(className);
      }
    }
  });

  it("uses custom alt text", () => {
    const wrapper = mount(BudgetAvatar, {
      props: {
        image,
        alt: "Photo de profil"
      }
    });

    expect(wrapper.get("img").attributes("alt")).toBe("Photo de profil");
  });
});
