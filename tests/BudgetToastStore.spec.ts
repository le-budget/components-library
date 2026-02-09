import { budgetToast, useBudgetToast } from "../src/components/BudgetToast/budgetToast.store";

describe("budgetToast store", () => {
  beforeEach(() => {
    budgetToast.clear();
  });

  it("pushes toast with defaults", () => {
    const id = budgetToast.push({
      title: "Info"
    });

    const { toasts } = useBudgetToast();
    expect(id).toBeTruthy();
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({
      title: "Info",
      description: "",
      variant: "info",
      color: "secondary",
      duration: 4000,
      icon: "status-info",
      closeLabel: "Fermer la notification",
      pauseOnHover: true
    });
  });

  it("returns null when visible is false", () => {
    const id = budgetToast.push({
      title: "Hidden",
      visible: false
    });

    expect(id).toBeNull();
    expect(useBudgetToast().toasts).toHaveLength(0);
  });

  it("keeps only 10 toasts and drops oldest", () => {
    for (let index = 1; index <= 11; index += 1) {
      budgetToast.push({ title: `Toast ${index}` });
    }

    const titles = useBudgetToast().toasts.map((toast) => toast.title);
    expect(useBudgetToast().toasts).toHaveLength(10);
    expect(titles).toEqual([
      "Toast 2",
      "Toast 3",
      "Toast 4",
      "Toast 5",
      "Toast 6",
      "Toast 7",
      "Toast 8",
      "Toast 9",
      "Toast 10",
      "Toast 11"
    ]);
  });

  it("supports persistent toasts with duration zero", () => {
    budgetToast.push({
      title: "Persistent",
      duration: 0,
      variant: "error"
    });

    const toast = useBudgetToast().toasts[0];
    expect(toast.duration).toBe(0);
    expect(toast.variant).toBe("error");
    expect(toast.color).toBe("secondary-error");
    expect(toast.icon).toBe("status-error");
  });

  it("supports question variant and icon mapping", () => {
    budgetToast.question("Question", "Description");

    const toast = useBudgetToast().toasts[0];
    expect(toast.variant).toBe("question");
    expect(toast.color).toBe("primary");
    expect(toast.icon).toBe("status-question");
  });

  it("supports explicit color override", () => {
    budgetToast.info("Info", "Ghost color", { color: "ghost" });

    const toast = useBudgetToast().toasts[0];
    expect(toast.color).toBe("ghost");
  });

  it("allows icon override and hidden icon", () => {
    budgetToast.success("Success", "Custom", { icon: "status-info" });
    budgetToast.warning("Warning", "No icon", { icon: false });

    expect(useBudgetToast().toasts[0].icon).toBe("status-info");
    expect(useBudgetToast().toasts[1].icon).toBe(false);
  });

  it("removes toast by id and ignores unknown id", () => {
    const id = budgetToast.info("Info") as string;

    budgetToast.remove("unknown");
    expect(useBudgetToast().toasts).toHaveLength(1);

    budgetToast.remove(id);
    expect(useBudgetToast().toasts).toHaveLength(0);
  });

  it("clears all toasts", () => {
    budgetToast.info("One");
    budgetToast.error("Two");

    budgetToast.clear();

    expect(useBudgetToast().toasts).toHaveLength(0);
  });
});
