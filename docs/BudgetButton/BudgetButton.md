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
- `error`: force un style d'erreur
- `type`: `button | submit | reset`
- `ariaLabel`: libelle pour un bouton icon-only

## Examples

```vue
<BudgetButton size="sm">Annuler</BudgetButton>
<BudgetButton loading>Chargement</BudgetButton>
```
