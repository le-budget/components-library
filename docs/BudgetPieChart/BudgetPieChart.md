# BudgetPieChart

Graphique camembert pour afficher une repartition de montants.

## Usage

```vue
<BudgetPieChart
  :slices="[
    { label: 'Logement', value: 900 },
    { label: 'Courses', value: 420 },
    { label: 'Transport', value: 180 }
  ]"
  color="primary"
/>
```

## Props

- `slices`: `Array<{ label: string; value: number }>`
- `color`: `primary | neutral | success | warning | error` (defaut: `primary`)
- `seriesLabel`: libelle de serie (defaut: `Repartition`)
- `height`: hauteur du graphique en pixels (defaut: `320`)`r`n- `showLegend`: affiche ou masque la legende (defaut: `true`)

Props d'etat:
- `loading` / `loadingMessage`
- `error` / `errorMessage`
- `emptyMessage`

## Slots

- `loading`
- `error`
- `empty`

## Comportement

- Format des montants en tooltip: `1 000,00 €` (locale `fr-FR`).
- Legende masquee sur mobile (`<768px`).


