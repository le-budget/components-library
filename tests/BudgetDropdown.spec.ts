import { h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import BudgetDropdown from "../src/components/BudgetDropdown/BudgetDropdown.vue";
import BudgetDropdownGroup from "../src/components/BudgetDropdownGroup/BudgetDropdownGroup.vue";
import BudgetDropdownOption from "../src/components/BudgetDropdownOption/BudgetDropdownOption.vue";

function mountDropdown(props: Record<string, unknown> = {}) {
  return mount(BudgetDropdown, {
    props: {
      modelValue: null,
      label: "Categorie",
      ...props
    },
    slots: {
      default: `
        <BudgetDropdownGroup label="Revenus">
          <BudgetDropdownOption label="Salaire" value="salary" />
          <BudgetDropdownOption label="Freelance" value="freelance" />
        </BudgetDropdownGroup>
        <BudgetDropdownGroup label="Depenses">
          <BudgetDropdownOption label="Épargne" value="epargne" />
          <BudgetDropdownOption label="Loyer" value="rent" disabled />
        </BudgetDropdownGroup>
      `
    },
    global: {
      components: {
        BudgetDropdownGroup,
        BudgetDropdownOption
      }
    }
  });
}

describe("BudgetDropdown", () => {
  it("renders input with combobox attributes", () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");

    expect(input.attributes("role")).toBe("combobox");
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.text()).toContain("Categorie");
  });

  it("opens on focus and renders grouped options", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("focus");
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    const groups = wrapper.findAll('[role="presentation"]');
    expect(groups.length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain("Revenus");
    expect(wrapper.text()).toContain("Depenses");
  });

  it("filters options with accent-insensitive search", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.setValue("epargne");
    await nextTick();

    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].text()).toContain("Épargne");
  });

  it("selects option on mousedown and emits model value", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("focus");
    await nextTick();

    const option = wrapper.findAll('[role="option"]').find((node) =>
      node.text().includes("Freelance")
    );
    expect(option).toBeDefined();
    await option!.trigger("mousedown");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["freelance"]);
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("does not emit when selecting disabled option", async () => {
    const wrapper = mountDropdown();
    await wrapper.find("input").trigger("focus");
    await nextTick();

    const disabledOption = wrapper.findAll('[role="option"]').find((node) =>
      node.text().includes("Loyer")
    );
    expect(disabledOption).toBeDefined();
    await disabledOption!.trigger("mousedown");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("supports keyboard navigation and enter selection", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["salary"]);
  });

  it("handles ArrowUp opening and Escape closing", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("keydown", { key: "ArrowUp" });
    expect(input.attributes("aria-expanded")).toBe("true");

    await input.trigger("keydown", { key: "Escape" });
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("opens from ArrowDown when closed", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("closes on Tab and click outside", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.trigger("keydown", { key: "Tab" });
    expect(input.attributes("aria-expanded")).toBe("false");

    await input.trigger("focus");
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("creates custom value when allowed", async () => {
    const wrapper = mountDropdown({ allowCustomValue: true });
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.setValue("Nouvelle valeur");
    await input.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Nouvelle valeur"]);
  });

  it("shows empty state when no result and custom value disabled", async () => {
    const wrapper = mountDropdown({ allowCustomValue: false });
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.setValue("introuvable");
    await nextTick();

    expect(wrapper.text()).toContain("Aucune option");
  });

  it("supports non-searchable mode", async () => {
    const wrapper = mountDropdown({ searchable: false });
    const input = wrapper.find("input");

    expect(input.attributes("readonly")).toBeDefined();
    expect(input.attributes("aria-autocomplete")).toBeUndefined();
    await input.trigger("focus");
    expect(wrapper.findAll('[role="option"]').length).toBeGreaterThan(0);
  });

  it("applies success and error states with aria-describedby", async () => {
    const success = mountDropdown({ success: true });
    expect(success.find("input").classes()).toContain("border-c-green");

    const error = mountDropdown({ error: true, errorMessage: "Invalide" });
    const input = error.find("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    const describedBy = input.attributes("aria-describedby");
    expect(describedBy).toBeDefined();
    expect(error.find(`#${describedBy}`).text()).toContain("Invalide");
  });

  it("handles prefix and suffix slots", () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        prefix: "<span>p</span>",
        suffix: "<span>s</span>"
      }
    });
    const input = wrapper.find("input");
    expect(input.classes()).toContain("pl-9");
    expect(input.classes()).toContain("pr-9");
  });

  it("renders selected label from modelValue", () => {
    const wrapper = mountDropdown({ modelValue: "salary" });
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe("Salaire");
  });

  it("freezes selection when configured and value is preset", () => {
    const wrapper = mountDropdown({ modelValue: "salary", frozenSelection: true });
    const input = wrapper.find("input");
    expect(input.attributes("readonly")).toBeDefined();
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("does not freeze selection when allowCustomValue is true", () => {
    const wrapper = mountDropdown({
      modelValue: "salary",
      frozenSelection: true,
      allowCustomValue: true
    });
    const input = wrapper.find("input");
    expect(input.attributes("readonly")).toBeUndefined();
  });

  it("renders raw model value when not found in options", () => {
    const wrapper = mountDropdown({ modelValue: "hors-liste" });
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe("hors-liste");
  });

  it("handles disabled dropdown and enter key when closed", async () => {
    const disabled = mountDropdown({ disabled: true });
    const input = disabled.find("input");
    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("false");
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(input.attributes("aria-expanded")).toBe("false");

    const enabled = mountDropdown();
    const enabledInput = enabled.find("input");
    await enabledInput.trigger("keydown", { key: "Enter" });
    expect(enabled.emitted("update:modelValue")).toBeUndefined();
  });

  it("handles empty filter list with keyboard navigation", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.setValue("introuvable");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "ArrowUp" });
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0);
  });

  it("opens when typing without prior focus", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.setValue("sal");
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("ignores invalid options without value", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null, allowCustomValue: true },
      slots: {
        default: `
          <BudgetDropdownGroup label="Nesting">
            <BudgetDropdownOption label="Option valide" value="valid" />
            <BudgetDropdownOption label="Option invalide" />
          </BudgetDropdownGroup>
        `
      },
      global: {
        components: {
          BudgetDropdownGroup,
          BudgetDropdownOption
        }
      }
    });

    const input = wrapper.find("input");
    await input.trigger("focus");
    await nextTick();
    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].text()).toContain("Option valide");
  });

  it("renders create custom entry and does not create empty custom value", async () => {
    const wrapper = mountDropdown({ allowCustomValue: true });
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.setValue("nouveau");
    await nextTick();
    expect(wrapper.text()).toContain('Creer "nouveau"');

    await input.setValue("   ");
    await input.trigger("keydown", { key: "Enter" });
    const emitted = wrapper.emitted("update:modelValue") ?? [];
    expect(emitted.some((entry) => entry[0] === "   ")).toBe(false);
  });

  it("handles empty group and plain text nodes in slot parsing", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        default: `
          Texte brut
          <BudgetDropdownGroup label="Vide"></BudgetDropdownGroup>
        `
      },
      global: {
        components: {
          BudgetDropdownGroup,
          BudgetDropdownOption
        }
      }
    });

    const input = wrapper.find("input");
    await input.trigger("focus");
    await nextTick();
    expect(wrapper.text()).toContain("Aucune option");
  });

  it("syncs highlight with selected option when opening", async () => {
    const wrapper = mountDropdown({ modelValue: "freelance" });
    const input = wrapper.find("input");
    await input.trigger("focus");
    await nextTick();

    const selected = wrapper.findAll('[role="option"]').find((node) =>
      node.text().includes("Freelance")
    );
    expect(selected).toBeDefined();
    expect(selected!.attributes("aria-selected")).toBe("true");
  });

  it("closes and removes listener on unmount without throwing", async () => {
    const wrapper = mountDropdown();
    await wrapper.find("input").trigger("focus");
    wrapper.unmount();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  });

  it("moves highlight from -1 and skips disabled options", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null, searchable: false },
      slots: {
        default: `
          <BudgetDropdownGroup label="Liste">
            <BudgetDropdownOption label="Desactivee" value="d1" disabled />
            <BudgetDropdownOption label="Active" value="a1" />
          </BudgetDropdownGroup>
        `
      },
      global: {
        components: {
          BudgetDropdownGroup,
          BudgetDropdownOption
        }
      }
    });

    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const active = wrapper.findAll('[role="option"]').find((node) => node.text().includes("Active"));
    expect(active?.classes()).toContain("bg-c-blue-light/25");
  });

  it("returns early on Enter when closed", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("shows empty state for empty query when custom value is allowed", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null, allowCustomValue: true },
      slots: {
        default: ""
      }
    });

    const input = wrapper.find("input");
    await input.trigger("focus");
    await nextTick();

    expect(wrapper.text()).toContain("Aucune option");
    expect(wrapper.text()).not.toContain("Creer");
  });

  it("moves highlight to next enabled option on repeated ArrowDown", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null, searchable: false },
      slots: {
        default: `
          <BudgetDropdownGroup label="Liste">
            <BudgetDropdownOption label="Premier" value="v1" />
            <BudgetDropdownOption label="Second" value="v2" />
          </BudgetDropdownGroup>
        `
      },
      global: {
        components: {
          BudgetDropdownGroup,
          BudgetDropdownOption
        }
      }
    });

    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const second = wrapper.findAll('[role="option"]').find((node) => node.text().includes("Second"));
    expect(second?.classes()).toContain("bg-c-blue-light/25");
  });

  it("uses default error message when errorMessage is not provided", () => {
    const wrapper = mountDropdown({ error: true });
    expect(wrapper.text()).toContain("Valeur invalide");
  });

  it("supports unlabeled option outside groups and nested group label fallback", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        default: () => [
          h(BudgetDropdownOption, { value: "outside" }),
          h(BudgetDropdownGroup, { label: "Parent" }, {
            default: () => [
              h(BudgetDropdownGroup, null, {
                default: () => [h(BudgetDropdownOption, { label: "Interne", value: "inside" })]
              })
            ]
          })
        ]
      },
      global: {
        components: {
          BudgetDropdownGroup,
          BudgetDropdownOption
        }
      }
    });

    await wrapper.find("input").trigger("focus");
    await nextTick();

    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(2);
    expect(options[0].text()).toContain("outside");
    expect(wrapper.text()).toContain("Parent");
  });

  it("handles group with empty slot object and option without props", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        default: () => [
          h(BudgetDropdownGroup, null, {}),
          h(BudgetDropdownOption)
        ]
      },
      global: {
        components: {
          BudgetDropdownGroup,
          BudgetDropdownOption
        }
      }
    });

    await wrapper.find("input").trigger("focus");
    await nextTick();
    expect(wrapper.text()).toContain("Aucune option");
  });

  it("keeps dropdown open on inside click, handles non-tab key, and closes on Escape when closed", async () => {
    const wrapper = mount(BudgetDropdown, {
      attachTo: document.body,
      props: {
        modelValue: null,
        label: "Categorie"
      },
      slots: {
        default: `
          <BudgetDropdownGroup label="Revenus">
            <BudgetDropdownOption label="Salaire" value="salary" />
            <BudgetDropdownOption label="Freelance" value="freelance" />
          </BudgetDropdownGroup>
        `
      },
      global: {
        components: {
          BudgetDropdownGroup,
          BudgetDropdownOption
        }
      }
    });
    const input = wrapper.find("input");

    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("true");

    input.element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("true");

    await input.trigger("keydown", { key: "a" });
    expect(input.attributes("aria-expanded")).toBe("true");

    await input.trigger("keydown", { key: "Escape" });
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("false");

    await input.trigger("keydown", { key: "Escape" });
    expect(input.attributes("aria-expanded")).toBe("false");

    wrapper.unmount();
  });

  it("handles selected disabled option and enter with no custom value", async () => {
    const wrapper = mountDropdown({ modelValue: "rent", allowCustomValue: false });
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.setValue("introuvable");
    await input.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("navigates with only disabled options without selecting any highlight", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null, searchable: false },
      slots: {
        default: `
          <BudgetDropdownOption label="A" value="a" disabled />
          <BudgetDropdownOption label="B" value="b" disabled />
        `
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "ArrowUp" });
    await nextTick();

    expect(input.attributes("aria-activedescendant")).toBeUndefined();
  });

  it("can reopen while already open", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.trigger("focus");

    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("renders option right slot text aligned on the right", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        default: `
          <BudgetDropdownOption label="Salaire" value="salary">
            <template #right>1 000,00 €</template>
          </BudgetDropdownOption>
        `
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    await wrapper.find("input").trigger("focus");
    await nextTick();

    const option = wrapper.find('[role="option"]');
    expect(option.text()).toContain("Salaire");
    expect(option.text()).toContain("1 000,00 €");
  });

  it("extracts right slot text from nested slot component", async () => {
    const RightWrap = {
      template: "<span><slot /></span>"
    };

    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        default: `
          <BudgetDropdownOption label="Prime" value="bonus">
            <template #right><RightWrap>200,00 €</RightWrap></template>
          </BudgetDropdownOption>
        `
      },
      global: {
        components: {
          BudgetDropdownOption,
          RightWrap
        }
      }
    });

    await wrapper.find("input").trigger("focus");
    await nextTick();

    expect(wrapper.find('[role="option"]').text()).toContain("200,00 €");
  });

  it("ignores empty right slot content", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        default: `
          <BudgetDropdownOption label="Salaire" value="salary">
            <template #right><span /></template>
          </BudgetDropdownOption>
        `
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    await wrapper.find("input").trigger("focus");
    await nextTick();

    const rightText = wrapper.find('[role="option"] .shrink-0');
    expect(rightText.exists()).toBe(false);
  });

  it("shows clear button when modelValue is a number", () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: 0 },
      slots: {
        default: `<BudgetDropdownOption label="Zero" :value="0" />`
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    expect(wrapper.find('button[aria-label="Vider la selection"]').exists()).toBe(true);
  });

  it("clears selected value and restores dropdown suffix fallback", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: "add" },
      slots: {
        suffix: '<span data-testid="native-suffix">EUR</span>',
        default: `
          <BudgetDropdownOption label="Ajouter" value="add">
            <template #right>+120,00</template>
          </BudgetDropdownOption>
        `
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    expect(wrapper.text()).toContain("+120,00");

    await wrapper.find('button[aria-label="Vider la selection"]').trigger("mousedown");
    await wrapper.find('button[aria-label="Vider la selection"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);

    await wrapper.setProps({ modelValue: null });
    expect(wrapper.find('[data-testid="native-suffix"]').exists()).toBe(true);
  });

  it("shows option right text in input when disabled and keeps clear button hidden", () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: "add", disabled: true },
      slots: {
        suffix: '<span data-testid="native-suffix">EUR</span>',
        default: `
          <BudgetDropdownOption label="Ajouter" value="add">
            <template #right>+120,00</template>
          </BudgetDropdownOption>
        `
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    expect(wrapper.text()).toContain("+120,00");
    expect(wrapper.find('button[aria-label="Vider la selection"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="native-suffix"]').exists()).toBe(false);
  });

  it("keeps default input right padding when no suffix and no value", () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: null },
      slots: {
        default: `<BudgetDropdownOption label="Ajouter" value="add" />`
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    expect(wrapper.find("input").classes()).not.toContain("pr-9");
    expect(wrapper.find("input").classes()).not.toContain("pr-16");
  });

  it("resets clearing guard when parent sets a non-null value after clear", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: "add" },
      slots: {
        default: `
          <BudgetDropdownOption label="Ajouter" value="add">
            <template #right>+120,00</template>
          </BudgetDropdownOption>
          <BudgetDropdownOption label="Modifier" value="edit">
            <template #right>+45,00</template>
          </BudgetDropdownOption>
        `
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    await wrapper.find('button[aria-label="Vider la selection"]').trigger("click");
    await wrapper.setProps({ modelValue: "edit" });
    expect(wrapper.text()).toContain("+45,00");
  });

  it("shows native suffix shifted left when clear button is visible", () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: "add" },
      slots: {
        suffix: '<span data-testid="native-suffix">EUR</span>',
        default: `<BudgetDropdownOption label="Ajouter" value="add" />`
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    const nativeSuffix = wrapper.find('[data-testid="native-suffix"]');
    expect(nativeSuffix.exists()).toBe(true);
    expect(nativeSuffix.element.parentElement?.className).toContain("right-8");
    expect(wrapper.find('button[aria-label="Vider la selection"]').exists()).toBe(true);
  });

  it("reopens dropdown on click after clearing without leaving focus", async () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: "add" },
      slots: {
        default: `<BudgetDropdownOption label="Ajouter" value="add" />`
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-expanded")).toBe("false");

    await wrapper.find('button[aria-label="Vider la selection"]').trigger("click");
    await wrapper.setProps({ modelValue: null });
    expect(input.attributes("aria-expanded")).toBe("false");

    await input.trigger("click");
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("unfreezes input after clearing selection in frozen mode", async () => {
    const wrapper = mountDropdown({ modelValue: "salary", frozenSelection: true });
    const input = wrapper.find("input");
    expect(input.attributes("readonly")).toBeDefined();

    await wrapper.find('button[aria-label="Vider la selection"]').trigger("click");
    await wrapper.setProps({ modelValue: null });
    expect(input.attributes("readonly")).toBeUndefined();
  });

  it("freezes input after option selection in frozen mode", async () => {
    const wrapper = mountDropdown({ frozenSelection: true });
    const input = wrapper.find("input");
    expect(input.attributes("readonly")).toBeUndefined();

    await input.trigger("focus");
    const option = wrapper.findAll('[role="option"]').find((node) =>
      node.text().includes("Salaire")
    );
    expect(option).toBeDefined();
    await option!.trigger("mousedown");

    await wrapper.setProps({ modelValue: "salary" });
    expect(input.attributes("readonly")).toBeDefined();
    await input.trigger("click");
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("does not open dropdown on focus when selection is frozen", async () => {
    const wrapper = mountDropdown({ modelValue: "salary", frozenSelection: true });
    const input = wrapper.find("input");

    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("keeps dropdown open when clicking input while already open", async () => {
    const wrapper = mountDropdown();
    const input = wrapper.find("input");

    await input.trigger("focus");
    expect(input.attributes("aria-expanded")).toBe("true");

    await input.trigger("click");
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("renders selected option right text in input suffix area when clear is hidden", () => {
    const wrapper = mount(BudgetDropdown, {
      props: { modelValue: "add", disabled: true },
      slots: {
        default: `
          <BudgetDropdownOption label="Ajouter" value="add">
            <template #right>+120,00</template>
          </BudgetDropdownOption>
        `
      },
      global: {
        components: {
          BudgetDropdownOption
        }
      }
    });

    const suffixText = wrapper.find('span.absolute.right-3');
    expect(suffixText.exists()).toBe(true);
    expect(suffixText.text()).toContain("+120,00");
    expect(wrapper.find('button[aria-label="Vider la selection"]').exists()).toBe(false);
  });
});
