# BudgetDropdown

Liste deroulante single-select avec recherche locale, grouping et saisie libre optionnelle.

## Usage

```vue
<BudgetDropdown v-model="value" label="Categorie">
  <BudgetDropdownGroup label="Budget">
    <BudgetDropdownOption label="Depenses fixes" value="fixed" />
    <BudgetDropdownOption label="Depenses variables" value="variable" />
  </BudgetDropdownGroup>
</BudgetDropdown>
```

## Props

- `modelValue`: `string | number | null`
- `size`: taille du champ (`sm` | `md` | `lg`, defaut `md`)
- `label`: texte du label
- `placeholder`: placeholder de saisie
- `name`: attribut `name` HTML
- `autocomplete`: attribut `autocomplete` HTML (defaut `off`)
- `disabled`: desactive le composant
- `error`: active l'etat d'erreur
- `success`: active l'etat de succes
- `errorMessage`: message d'erreur (defaut: `Valeur invalide`)
- `searchable`: active la recherche locale (defaut `true`)
- `allowCustomValue`: autorise une valeur non presente dans la liste (defaut `false`)

## Slots

- `default`: contenu compose de `BudgetDropdownGroup` et `BudgetDropdownOption`
- `prefix`: contenu avant le champ
- `suffix`: contenu apres le champ
