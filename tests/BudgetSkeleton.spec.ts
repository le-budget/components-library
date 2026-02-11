import { mount } from "@vue/test-utils";
import BudgetSkeleton from "../src/components/BudgetSkeleton/BudgetSkeleton.vue";

describe("BudgetSkeleton", () => {
  it("renders a default animated text skeleton", () => {
    const wrapper = mount(BudgetSkeleton);
    const root = wrapper.find(".budget-skeleton");
    const lines = wrapper.findAll(".budget-skeleton__line");

    expect(root.attributes("aria-hidden")).toBe("true");
    expect(lines).toHaveLength(1);
    expect(lines[0].classes()).toContain("h-4");
    expect(lines[0].classes()).toContain("rounded-md");
    expect(lines[0].classes()).toContain("animate-pulse");
  });

  it("supports text sizes and falls back to md for invalid size", () => {
    const sm = mount(BudgetSkeleton, {
      props: { size: "sm" }
    });
    expect(sm.find(".budget-skeleton__line").classes()).toContain("h-3");

    const lg = mount(BudgetSkeleton, {
      props: { size: "lg" }
    });
    expect(lg.find(".budget-skeleton__line").classes()).toContain("h-5");

    const invalid = mount(BudgetSkeleton, {
      props: { size: "unknown" as never }
    });
    expect(invalid.find(".budget-skeleton__line").classes()).toContain("h-4");
  });

  it("supports rounded values and falls back to md for invalid rounded", () => {
    const roundedCases: Array<{ rounded: string; expected: string }> = [
      { rounded: "none", expected: "rounded-none" },
      { rounded: "sm", expected: "rounded-sm" },
      { rounded: "md", expected: "rounded-md" },
      { rounded: "lg", expected: "rounded-lg" },
      { rounded: "full", expected: "rounded-full" },
      { rounded: "unknown", expected: "rounded-md" }
    ];

    for (const testCase of roundedCases) {
      const wrapper = mount(BudgetSkeleton, {
        props: {
          rounded: testCase.rounded as never
        }
      });

      expect(wrapper.find(".budget-skeleton__line").classes()).toContain(testCase.expected);
    }
  });

  it("computes text line count and widths", () => {
    const invalidLines = mount(BudgetSkeleton, {
      props: { lines: 0 }
    });
    expect(invalidLines.findAll(".budget-skeleton__line")).toHaveLength(1);

    const invalidNumericLines = mount(BudgetSkeleton, {
      props: { lines: Number.NaN }
    });
    expect(invalidNumericLines.findAll(".budget-skeleton__line")).toHaveLength(1);

    const multiLine = mount(BudgetSkeleton, {
      props: { lines: 4 }
    });
    const lines = multiLine.findAll(".budget-skeleton__line");

    expect(lines).toHaveLength(4);
    expect(lines[3].attributes("style")).toContain("width: 75%;");
  });

  it("applies custom text dimensions", () => {
    const wrapper = mount(BudgetSkeleton, {
      props: {
        width: "60%",
        height: 14,
        lines: 2
      }
    });

    const containerStyle = wrapper.find(".budget-skeleton__text").attributes("style");
    const lines = wrapper.findAll(".budget-skeleton__line");

    expect(containerStyle).toContain("width: 60%;");
    expect(lines[0].attributes("style")).toContain("width: 60%;");
    expect(lines[0].attributes("style")).toContain("height: 14px;");
    expect(lines[1].attributes("style")).toContain("width: 60%;");
  });

  it("renders rect and circle variants", () => {
    const rect = mount(BudgetSkeleton, {
      props: {
        variant: "rect",
        rounded: "sm"
      }
    });

    const rectBlock = rect.find(".budget-skeleton__block");
    expect(rectBlock.classes()).toContain("h-6");
    expect(rectBlock.classes()).toContain("w-full");
    expect(rectBlock.classes()).toContain("rounded-sm");

    const circle = mount(BudgetSkeleton, {
      props: {
        variant: "circle",
        width: 40,
        height: 40
      }
    });

    const circleBlock = circle.find(".budget-skeleton__block");
    expect(circleBlock.classes()).toContain("rounded-full");
    expect(circleBlock.classes()).toContain("h-10");
    expect(circleBlock.classes()).toContain("w-10");
    expect(circleBlock.attributes("style")).toContain("width: 40px;");
    expect(circleBlock.attributes("style")).toContain("height: 40px;");
  });

  it("renders image variants with ratios and default ratio fallback", () => {
    const ratioSquare = mount(BudgetSkeleton, {
      props: {
        variant: "image",
        ratio: "1:1"
      }
    });
    expect(ratioSquare.find(".budget-skeleton__block").attributes("style")).toContain(
      "aspect-ratio: 1 / 1;"
    );

    const ratioFourThree = mount(BudgetSkeleton, {
      props: {
        variant: "image",
        ratio: "4:3"
      }
    });
    expect(ratioFourThree.find(".budget-skeleton__block").attributes("style")).toContain(
      "aspect-ratio: 4 / 3;"
    );

    const invalidRatio = mount(BudgetSkeleton, {
      props: {
        variant: "image",
        ratio: "custom" as never
      }
    });
    expect(invalidRatio.find(".budget-skeleton__block").attributes("style")).toContain(
      "aspect-ratio: 16 / 9;"
    );

    const fixedHeight = mount(BudgetSkeleton, {
      props: {
        variant: "image",
        height: 120
      }
    });
    expect(fixedHeight.find(".budget-skeleton__block").attributes("style")).toContain(
      "height: 120px;"
    );
    expect(fixedHeight.find(".budget-skeleton__block").attributes("style")).not.toContain(
      "aspect-ratio:"
    );
  });

  it("supports shimmer animation and allows disabling animation", () => {
    const shimmer = mount(BudgetSkeleton, {
      props: {
        animation: "shimmer"
      }
    });
    expect(shimmer.find(".budget-skeleton__line").classes()).toContain("budget-skeleton--shimmer");

    const disabled = mount(BudgetSkeleton, {
      props: {
        animated: false
      }
    });
    expect(disabled.find(".budget-skeleton__line").classes()).not.toContain("animate-pulse");
    expect(disabled.find(".budget-skeleton__line").classes()).not.toContain(
      "budget-skeleton--shimmer"
    );
  });

  it("covers non-text fallback branches with invalid variant", () => {
    const wrapper = mount(BudgetSkeleton, {
      props: {
        variant: "unknown" as never,
        width: 120
      }
    });
    const block = wrapper.find(".budget-skeleton__block");

    expect(block.exists()).toBe(true);
    expect(block.classes()).toContain("h-6");
    expect(block.classes()).toContain("w-full");
    expect(block.attributes("style")).toContain("width: 120px;");
  });

  it("covers internal branches not rendered in template shortcuts", () => {
    const rectWrapper = mount(BudgetSkeleton, {
      props: {
        variant: "rect",
        lines: 4
      }
    });
    const rectVm = rectWrapper.vm as unknown as {
      lineStyle: (index: number) => Record<string, string>;
    };

    expect(rectVm.lineStyle(0)).toEqual({});

    const textWrapper = mount(BudgetSkeleton, {
      props: {
        variant: "text",
        ratio: "16:9"
      }
    });
    const textVm = textWrapper.vm as unknown as {
      shapeClass: string;
    };

    expect(textVm.shapeClass).toBe("");

    const ratioSixteenNine = mount(BudgetSkeleton, {
      props: {
        variant: "image",
        ratio: "16:9"
      }
    });
    expect(ratioSixteenNine.find(".budget-skeleton__block").attributes("style")).toContain(
      "aspect-ratio: 16 / 9;"
    );
  });
});
