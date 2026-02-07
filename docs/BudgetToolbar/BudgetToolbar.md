# BudgetToolbar

Conteneur de barre d'outils avec orientation, taille et etat disabled.

## Usage

```vue
<BudgetToolbar label="Actions">
  <BudgetToolbarItem>
    <BudgetToolbarItemButton>Action</BudgetToolbarItemButton>
  </BudgetToolbarItem>
</BudgetToolbar>
```

## Props

- `label`: libelle accessible de la toolbar
- `orientation`: `horizontal | vertical` (par defaut `horizontal`)
- `size`: `sm | md | lg` (par defaut `md`)
- `align`: `left | right` (par defaut `left`)
- `disabled`: desactive les boutons de la toolbar
- `wrap`: autorise le retour a la ligne en horizontal
