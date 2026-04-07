# BudgetCategoryItem

Ligne de categorie budgetaire avec case a cocher, progression et montants formates.

## Usage

```vue
<BudgetCategoryItem
  v-model="selected"
  label="Internet"
  assigned="201,96 EUR"
  activity="-126,98 EUR"
  available="74,98 EUR"
  :progress="63"
  progress-label="Depense 126,98 EUR sur 201,96 EUR"
  tone="warning"
/>
```

## Props

- `modelValue`: etat de la case a cocher
- `label`: libelle de la categorie
- `assigned`: montant assigne deja formate
- `activity`: montant d'activite deja formate
- `available`: montant disponible deja formate
- `progress`: valeur de progression entre `0` et `100` (bornee automatiquement)
- `progressLabel`: texte d'etat affiche a droite du libelle
- `tone`: style visuel (`neutral | success | warning | error`) applique a la barre et au badge `available`
- `size`: densite visuelle (`sm | md | lg`), `lg` par defaut
- `hasDragHandle`: affiche une zone de poignee de drag a gauche, `false` par defaut
- `hasCheckbox`: affiche ou masque la case a cocher, `true` par defaut
- `disabled`: desactive l'interaction
- `checkboxColor`: couleur de la case a cocher

Si le composant est place dans un `BudgetCategoryGroup`, il herite automatiquement de la taille du groupe sauf si `size` est renseigne localement.

## Slots

- `prefix`: contenu place avant le libelle (emoji, icone, avatar, etc.)
- `dragHandle`: remplace le rendu visuel de la poignee de drag

## Evenements

- `update:modelValue`
