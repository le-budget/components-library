# BudgetTableRow

Ligne de tableau (`tr`) liee a une cle d'identification et a des valeurs de tri.

## Props

- `rowId`: identifiant unique de la ligne (obligatoire)
- `sortValues`: map des valeurs utilisees par le tri (`sortKey` => valeur)
- `checkboxColor`: couleur de la case de selection de la ligne (`primary | neutral | success | warning | error`)

## Slots

- `default`: cellules `BudgetTableCell`
- `actions`: contenu libre de la colonne d'actions

