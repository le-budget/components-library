# BudgetToolbarItemButton

Bouton d'action pour `BudgetToolbar`, inspire de `BudgetButton`.

## Props

- `type`: `button | submit | reset`
- `size`: `sm | md | lg` (heritage depuis `BudgetToolbar` si non defini)
- `loading`: affiche un indicateur de chargement
- `disabled`: desactive le bouton
- `color`:
  `primary | secondary | ghost | primary-success | secondary-success | primary-warning | secondary-warning | primary-error | secondary-error`
- `hideIconsOnLoading`: masque les slots `icon` et `iconRight` quand `loading=true`
- `ariaLabel`: libelle pour un bouton icon-only
- `active`: applique un anneau visuel actif

## Slots

- `default`: contenu texte
- `icon`: icone gauche
- `iconRight`: icone droite
