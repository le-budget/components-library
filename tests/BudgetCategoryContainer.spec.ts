import { mount } from "@vue/test-utils";
import BudgetCategoryContainer from "../src/components/BudgetCategoryContainer/BudgetCategoryContainer.vue";
import type {
  BudgetCategoryContainerGroup,
  BudgetCategoryContainerOrderEntry
} from "../src/components/BudgetCategoryContainer/budgetCategoryContainer.types";

function createDataTransfer() {
  return {
    effectAllowed: "move",
    dropEffect: "move",
    setData: vi.fn(),
    getData: vi.fn(),
    setDragImage: vi.fn()
  };
}

function createGroups(): BudgetCategoryContainerGroup[] {
  return [
    {
      id: "group-factures",
      title: "Factures",
      assigned: "821,07 EUR",
      activity: "-627,23 EUR",
      available: "313,84 EUR",
      selected: false,
      collapsed: false,
      indeterminate: true,
      items: [
        {
          id: "item-electricite",
          label: "Electricite",
          assigned: "301,33 EUR",
          activity: "-301,33 EUR",
          available: "0,00 EUR",
          progress: 100,
          progressLabel: "Totalement depense",
          tone: "neutral",
          selected: false,
          prefixText: "ELEC"
        },
        {
          id: "item-eau",
          label: "Eau",
          assigned: "30,00 EUR",
          activity: "0,00 EUR",
          available: "150,00 EUR",
          progress: 20,
          progressLabel: "Finance",
          tone: "success",
          selected: true,
          prefixText: "EAU"
        }
      ]
    },
    {
      id: "group-credits",
      title: "Credits",
      assigned: "1489,81 EUR",
      activity: "-1374,58 EUR",
      available: "115,23 EUR",
      selected: false,
      collapsed: false,
      items: [
        {
          id: "item-auto",
          label: "Credit automobile",
          assigned: "536,90 EUR",
          activity: "-536,90 EUR",
          available: "0,00 EUR",
          progress: 100,
          progressLabel: "Totalement depense",
          tone: "neutral",
          selected: false,
          prefixText: "AUTO"
        }
      ]
    },
    {
      id: "group-epargne",
      title: "Epargne",
      assigned: "200,00 EUR",
      activity: "0,00 EUR",
      available: "200,00 EUR",
      selected: false,
      collapsed: false,
      items: []
    }
  ];
}

function mountContainer(
  props: Record<string, unknown> = {},
  groups: BudgetCategoryContainerGroup[] = createGroups()
) {
  return mount(BudgetCategoryContainer, {
    props: {
      groups,
      ...props
    }
  });
}

function latestPayload<T>(wrapper: ReturnType<typeof mount>, event: string) {
  const emitted = wrapper.emitted(event);
  expect(emitted).toBeTruthy();
  return emitted?.at(-1)?.[0] as T;
}

describe("BudgetCategoryContainer", () => {
  it("renders groups and items from the provided data", () => {
    const wrapper = mountContainer();

    expect(wrapper.find('[data-testid="budget-category-container-group-group-factures"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="budget-category-container-item-group-factures-item-electricite"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Factures");
    expect(wrapper.text()).toContain("Electricite");
    expect(wrapper.text()).toContain("EAU");
  });

  it("reorders groups on drop and only emits on drop", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-group-handle-group-credits"]')
      .trigger("dragstart", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-group-drop-0"]')
      .trigger("dragover", { dataTransfer });

    expect(wrapper.emitted("update:groups")).toBeFalsy();
    expect(wrapper.emitted("reorder")).toBeFalsy();

    await wrapper
      .get('[data-testid="budget-category-container-group-drop-0"]')
      .trigger("drop", { dataTransfer });

    const nextGroups = latestPayload<BudgetCategoryContainerGroup[]>(wrapper, "update:groups");
    const order = latestPayload<BudgetCategoryContainerOrderEntry[]>(wrapper, "reorder");

    expect(nextGroups.map((group) => group.id)).toEqual([
      "group-credits",
      "group-factures",
      "group-epargne"
    ]);
    expect(order).toEqual([
      {
        id: "group-credits",
        order: 0,
        items: [{ id: "item-auto", order: 0 }]
      },
      {
        id: "group-factures",
        order: 1,
        items: [
          { id: "item-electricite", order: 0 },
          { id: "item-eau", order: 1 }
        ]
      },
      {
        id: "group-epargne",
        order: 2,
        items: []
      }
    ]);
  });

  it("does not expose item drop zones while dragging a group", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-group-handle-group-factures"]')
      .trigger("dragstart", { dataTransfer });

    expect(
      wrapper.get('[data-testid="budget-category-container-item-drop-group-factures-0"]').classes()
    ).toContain("pointer-events-none");
  });

  it("renders a group ghost and hides the native drag image", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-group-handle-group-factures"]')
      .trigger("dragstart", { dataTransfer, clientX: 120, clientY: 140 });

    expect(dataTransfer.setDragImage).toHaveBeenCalledTimes(1);
    expect(wrapper.get('[data-testid="budget-category-container-ghost"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="budget-category-container-ghost-group"]').text()).toContain("Factures");
    expect(wrapper.get('[data-testid="budget-category-container-ghost-group"]').text()).toContain("Electricite");
    expect(wrapper.find('[data-testid="budget-category-container-ghost-item"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="budget-category-container-ghost"] input[type="checkbox"]').exists()).toBe(false);
  });

  it("renders a translucent group preview at the future drop position", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-group-handle-group-factures"]')
      .trigger("dragstart", { dataTransfer, clientX: 120, clientY: 140 });
    await wrapper
      .get('[data-testid="budget-category-container-group-drop-3"]')
      .trigger("dragover", { dataTransfer, clientX: 80, clientY: 24 });

    expect(wrapper.get('[data-testid="budget-category-container-preview"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="budget-category-container-preview-group"]').text()).toContain("Factures");
    expect(wrapper.get('[data-testid="budget-category-container-preview-group"]').text()).toContain("Electricite");
    expect(wrapper.find('[data-testid="budget-category-container-preview-group"] input[type="checkbox"]').exists()).toBe(false);
  });

  it("reorders items inside the same group", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-eau"]')
      .trigger("dragstart", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-factures-0"]')
      .trigger("dragover", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-factures-0"]')
      .trigger("drop", { dataTransfer });

    const nextGroups = latestPayload<BudgetCategoryContainerGroup[]>(wrapper, "update:groups");
    const factures = nextGroups.find((group) => group.id === "group-factures");

    expect(factures?.items.map((item) => item.id)).toEqual(["item-eau", "item-electricite"]);
  });

  it("moves an item from one group to another", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-credits-1"]')
      .trigger("dragover", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-credits-1"]')
      .trigger("drop", { dataTransfer });

    const nextGroups = latestPayload<BudgetCategoryContainerGroup[]>(wrapper, "update:groups");
    const credits = nextGroups.find((group) => group.id === "group-credits");
    const factures = nextGroups.find((group) => group.id === "group-factures");

    expect(credits?.items.map((item) => item.id)).toEqual(["item-auto", "item-electricite"]);
    expect(factures?.items.map((item) => item.id)).toEqual(["item-eau"]);
  });

  it("emits reorder as a group tree with nested item order", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-credits-1"]')
      .trigger("dragover", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-credits-1"]')
      .trigger("drop", { dataTransfer });

    const order = latestPayload<BudgetCategoryContainerOrderEntry[]>(wrapper, "reorder");

    expect(order).toEqual([
      {
        id: "group-factures",
        order: 0,
        items: [{ id: "item-eau", order: 0 }]
      },
      {
        id: "group-credits",
        order: 1,
        items: [
          { id: "item-auto", order: 0 },
          { id: "item-electricite", order: 1 }
        ]
      },
      {
        id: "group-epargne",
        order: 2,
        items: []
      }
    ]);
  });

  it("renders an item ghost, updates its position, and removes it on dragend", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer, clientX: 110, clientY: 150 });

    expect(dataTransfer.setDragImage).toHaveBeenCalledTimes(1);
    expect(wrapper.get('[data-testid="budget-category-container-ghost-item"]').text()).toContain("Electricite");
    expect(wrapper.find('[data-testid="budget-category-container-ghost-group"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="budget-category-container-ghost"] input[type="checkbox"]').exists()).toBe(false);

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("drag", { dataTransfer, clientX: 220, clientY: 260 });

    expect(wrapper.get('[data-testid="budget-category-container-ghost"]').attributes("style")).toContain("left: 220px;");
    expect(wrapper.get('[data-testid="budget-category-container-ghost"]').attributes("style")).toContain("top: 260px;");
    expect(wrapper.get('[data-testid="budget-category-container-ghost"]').attributes("style")).toContain("translate(14px, 14px)");

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragend", { dataTransfer });

    expect(wrapper.find('[data-testid="budget-category-container-ghost"]').exists()).toBe(false);
  });

  it("renders a translucent item preview at the future drop position and cleans it up on dragend", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer, clientX: 110, clientY: 150 });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-credits-1"]')
      .trigger("dragover", { dataTransfer, clientX: 220, clientY: 260 });

    expect(wrapper.get('[data-testid="budget-category-container-preview"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="budget-category-container-preview-item"]').text()).toContain("Electricite");
    expect(wrapper.find('[data-testid="budget-category-container-preview-item"] input[type="checkbox"]').exists()).toBe(false);

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragend", { dataTransfer });

    expect(wrapper.find('[data-testid="budget-category-container-preview"]').exists()).toBe(false);
  });

  it("allows dropping an item into an empty group", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-epargne-0"]')
      .trigger("dragover", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-epargne-0"]')
      .trigger("drop", { dataTransfer });

    const nextGroups = latestPayload<BudgetCategoryContainerGroup[]>(wrapper, "update:groups");
    const epargne = nextGroups.find((group) => group.id === "group-epargne");

    expect(epargne?.items.map((item) => item.id)).toEqual(["item-electricite"]);
  });

  it("keeps intermediate item drop zones interactive while the preview ghost is visible", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer });
    await wrapper
      .get('[data-testid="budget-category-container-item-drop-group-credits-1"]')
      .trigger("dragover", { dataTransfer });

    expect(
      wrapper.get('[data-testid="budget-category-container-item-drop-group-credits-1"]').classes()
    ).toContain("pointer-events-auto");
    expect(wrapper.get('[data-testid="budget-category-container-preview"]').exists()).toBe(true);
  });

  it("does not expose group drop zones while dragging an item", async () => {
    const wrapper = mountContainer();
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer });

    expect(
      wrapper.get('[data-testid="budget-category-container-group-drop-0"]').classes()
    ).toContain("pointer-events-none");
  });

  it("emits selection and collapsed events from child components", async () => {
    const wrapper = mountContainer();

    await wrapper
      .get('[data-testid="budget-category-container-group-group-factures"] input[type="checkbox"]')
      .setValue(true);
    await wrapper
      .get('[data-testid="budget-category-container-item-group-factures-item-electricite"] input[type="checkbox"]')
      .setValue(true);
    await wrapper
      .get('[data-testid="budget-category-container-group-group-factures"] button[aria-controls]')
      .trigger("click");

    expect(wrapper.emitted("update:groupSelected")).toEqual([
      [{ groupId: "group-factures", value: true }]
    ]);
    expect(wrapper.emitted("update:itemSelected")).toEqual([
      [{ groupId: "group-factures", itemId: "item-electricite", value: true }]
    ]);
    expect(wrapper.emitted("update:collapsed")).toEqual([
      [{ groupId: "group-factures", collapsed: true }]
    ]);
  });

  it("supports global hasCheckbox=false and size inheritance", () => {
    const wrapper = mountContainer({ hasCheckbox: false, size: "sm" });

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="budget-category-group"]').attributes("data-size")).toBe("sm");
    expect(wrapper.find('[data-testid="budget-category-item"]').attributes("data-size")).toBe("sm");
  });

  it("lets local hasCheckbox overrides win over the container default", () => {
    const groups = createGroups();
    groups[0].hasCheckbox = false;
    groups[0].items[0].hasCheckbox = false;

    const wrapper = mountContainer({ hasCheckbox: true }, groups);

    expect(wrapper.find('[aria-label="Selectionner le groupe Factures"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Selectionner la categorie Electricite"]').exists()).toBe(false);
  });

  it("respects disabled states for drag handles and drop targets", async () => {
    const groups = createGroups();
    groups[1].disabled = true;
    groups[0].items[1].disabled = true;

    const wrapper = mountContainer({}, groups);
    const dataTransfer = createDataTransfer();

    expect(
      wrapper
        .get('[data-testid="budget-category-container-group-handle-group-credits"]')
        .attributes("disabled")
    ).toBeDefined();
    expect(
      wrapper
        .get('[data-testid="budget-category-container-item-handle-item-eau"]')
        .attributes("disabled")
    ).toBeDefined();

    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer });

    expect(
      wrapper.get('[data-testid="budget-category-container-item-drop-group-credits-0"]').classes()
    ).toContain("pointer-events-none");
    expect(
      wrapper.get('[data-testid="budget-category-container-item-drop-group-epargne-0"]').classes()
    ).toContain("pointer-events-auto");
  });

  it("respects the global disabled prop", () => {
    const wrapper = mountContainer({ disabled: true });

    expect(
      wrapper
        .get('[data-testid="budget-category-container-group-handle-group-factures"]')
        .attributes("disabled")
    ).toBeDefined();
    expect(
      wrapper
        .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
        .attributes("disabled")
    ).toBeDefined();
  });

  it("can hide visual drop indicators while keeping drop zones available", async () => {
    const wrapper = mountContainer({
      showGroupDropIndicators: false,
      showItemDropIndicators: false
    });
    const dataTransfer = createDataTransfer();

    await wrapper
      .get('[data-testid="budget-category-container-group-handle-group-factures"]')
      .trigger("dragstart", { dataTransfer });
    expect(wrapper.get('[data-testid="budget-category-container-group-drop-1"]').classes()).toContain("my-0");

    await wrapper
      .get('[data-testid="budget-category-container-group-handle-group-factures"]')
      .trigger("dragend");
    await wrapper
      .get('[data-testid="budget-category-container-item-handle-item-electricite"]')
      .trigger("dragstart", { dataTransfer });
    expect(wrapper.get('[data-testid="budget-category-container-item-drop-group-factures-1"]').classes()).toContain("my-0");
  });
});
