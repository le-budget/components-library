# BudgetTableHeader

Cellule d'entete (`th`) avec tri optionnel et slots `prefix`, `default`, `suffix`.

## Props

- `sortable`: active le bouton de tri
- `sortKey`: cle de tri utilisee par `BudgetTable`
- `sortFn`: fonction de tri personnalisee `(a, b) => number`
- `align`: `left | center | right`
- `span`: largeur cible de colonne sur une base `12` (ex: `3` = `25%`)
- `fitContent`: force une colonne a prendre la largeur de son contenu
- `size`: `sm | md | lg` (par defaut `sm`)
- `color`: `primary | success | warning | error | info | neutral | gray`

Sans `color`, l'entete utilise un fond blanc et une bordure grise.

