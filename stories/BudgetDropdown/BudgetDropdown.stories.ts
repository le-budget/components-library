import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BudgetDropdown from "../../src/components/BudgetDropdown/BudgetDropdown.vue";
import BudgetDropdownGroup from "../../src/components/BudgetDropdownGroup/BudgetDropdownGroup.vue";
import BudgetDropdownOption from "../../src/components/BudgetDropdownOption/BudgetDropdownOption.vue";
import BudgetIcon from "../../src/components/BudgetIcon/BudgetIcon.vue";
import doc from "../../docs/BudgetDropdown/BudgetDropdown.md?raw";

const meta: Meta<typeof BudgetDropdown> = {
  title: "Components/Input/Dropdown",
  component: BudgetDropdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: doc
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof BudgetDropdown>;

export const Default: Story = {
  render: () => ({
    components: {
      BudgetDropdown,
      BudgetDropdownGroup,
      BudgetDropdownOption
    },
    setup() {
      const value = ref<string | number | null>(null);
      return { value };
    },
    template: `
      <BudgetDropdown v-model="value" label="Categorie" placeholder="Selectionner une categorie">
        <BudgetDropdownGroup label="Revenus">
          <BudgetDropdownOption label="Salaire" value="salary" />
          <BudgetDropdownOption label="Freelance" value="freelance" />
        </BudgetDropdownGroup>
        <BudgetDropdownGroup label="Depenses">
          <BudgetDropdownOption label="Loyer" value="rent" />
          <BudgetDropdownOption label="Courses" value="food" />
        </BudgetDropdownGroup>
      </BudgetDropdown>
    `
  })
};

export const SearchAndCustomValue: Story = {
  render: () => ({
    components: {
      BudgetDropdown,
      BudgetDropdownGroup,
      BudgetDropdownOption
    },
    setup() {
      const value = ref<string | number | null>(null);
      return { value };
    },
    template: `
      <BudgetDropdown
        v-model="value"
        label="Mot-cle"
        placeholder="Saisir ou rechercher"
        :allow-custom-value="true"
      >
        <BudgetDropdownGroup label="Suggestions">
          <BudgetDropdownOption label="Economie" value="economie" />
          <BudgetDropdownOption label="Épargne" value="epargne" />
          <BudgetDropdownOption label="Impôts" value="impots" />
        </BudgetDropdownGroup>
      </BudgetDropdown>
    `
  })
};

export const WithStatesAndIcons: Story = {
  render: () => ({
    components: {
      BudgetDropdown,
      BudgetDropdownGroup,
      BudgetDropdownOption,
      BudgetIcon
    },
    setup() {
      const value = ref<string | number | null>("food");
      return { value };
    },
    template: `
      <div class="grid gap-4">
        <BudgetDropdown v-model="value" label="Succes" success>
          <template #prefix>
            <BudgetIcon status="status-info" decorative />
          </template>
          <template #suffix>
            <BudgetIcon status="status-success" decorative />
          </template>
          <BudgetDropdownGroup label="Categories">
            <BudgetDropdownOption label="Courses" value="food" />
            <BudgetDropdownOption label="Transport" value="transport" />
            <BudgetDropdownOption label="Loyer" value="rent" disabled />
          </BudgetDropdownGroup>
        </BudgetDropdown>
        <BudgetDropdown v-model="value" label="Erreur" error error-message="Valeur invalide">
          <BudgetDropdownGroup label="Categories">
            <BudgetDropdownOption label="Courses" value="food" />
          </BudgetDropdownGroup>
        </BudgetDropdown>
      </div>
    `
  })
};

export const WithSuffixSlot: Story = {
  render: () => ({
    components: {
      BudgetDropdown,
      BudgetDropdownGroup,
      BudgetDropdownOption
    },
    setup() {
      const value = ref<string | number | null>(null);
      return { value };
    },
    template: `
      <BudgetDropdown v-model="value" label="Avec suffix" placeholder="Choisir une action">
        <template #suffix>
          <span class="text-xs font-medium text-slate-500">EUR</span>
        </template>
        <BudgetDropdownGroup label="Actions">
          <BudgetDropdownOption label="Ajouter" value="add">
            <template #right>+120,00</template>
          </BudgetDropdownOption>
          <BudgetDropdownOption label="Modifier" value="edit">
            <template #right>+45,00</template>
          </BudgetDropdownOption>
          <BudgetDropdownOption label="Supprimer" value="delete">
            <template #right>-30,00</template>
          </BudgetDropdownOption>
        </BudgetDropdownGroup>
      </BudgetDropdown>
    `
  })
};
