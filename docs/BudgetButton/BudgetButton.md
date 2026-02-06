# BudgetButton

Bouton principal pour les actions du produit.

## Usage

```vue
<BudgetButton>Valider</BudgetButton>
```

## Props

- `size`: `sm | md | lg` (par defaut `md`)
- `loading`: affiche un indicateur de chargement
- `disabled`: desactive le bouton
- `color`:
  `primary | secondary | ghost | primary-success | secondary-success | primary-warning | secondary-warning | primary-error | secondary-error`
- `hideIconsOnLoading`: masque les slots `icon` et `iconRight` quand `loading=true` (par defaut `true`)
- `type`: `button | submit | reset`
- `ariaLabel`: libelle pour un bouton icon-only

## Examples

```vue
<BudgetButton size="sm">Annuler</BudgetButton>
<BudgetButton loading>Chargement</BudgetButton>
<BudgetButton color="secondary">Secondaire</BudgetButton>
<BudgetButton color="primary-success">Succes</BudgetButton>
```
