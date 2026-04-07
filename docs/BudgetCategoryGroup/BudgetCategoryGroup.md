# BudgetCategoryGroup

Conteneur de categories budgetaires avec en-tete repliable et slot pour les `BudgetCategoryItem`.

## Usage

```vue
<BudgetCategoryGroup
  v-model="selected"
  v-model:collapsed="collapsed"
  title="Factures"
  assigned="821,07 EUR"
  activity="-627,23 EUR"
  available="313,84 EUR"
>
  <BudgetCategoryItem
    v-model="itemSelected"
    label="Electricite"
    assigned="301,33 EUR"
    activity="-301,33 EUR"
    available="0,00 EUR"
    :progress="100"
    progress-label="Totalement depense"
  />
</BudgetCategoryGroup>
```

## Props

- `modelValue`: etat de la case a cocher du groupe
- `title`: titre du groupe
- `assigned`: montant assigne deja formate
- `activity`: montant d'activite deja formate
- `available`: montant disponible deja formate
- `size`: densite visuelle du groupe et de ses items (`sm | md | lg`), `lg` par defaut
- `hasDragHandle`: affiche une zone de poignee de drag avant le chevron, `false` par defaut
- `hasCheckbox`: affiche ou masque la case a cocher du groupe, `true` par defaut
- `collapsed`: etat replie/ouvert
- `indeterminate`: etat intermediaire de la case a cocher
- `disabled`: desactive l'interaction
- `checkboxColor`: couleur de la case a cocher

## Slots

- `prefix`: contenu place avant le titre
- `dragHandle`: remplace le rendu visuel de la poignee de drag
- `default`: contenu du groupe, generalement des `BudgetCategoryItem`

Les `BudgetCategoryItem` places dans le slot heritent automatiquement de la taille du groupe, sauf si une taille explicite leur est passee.

## Evenements

- `update:modelValue`
- `update:collapsed`
