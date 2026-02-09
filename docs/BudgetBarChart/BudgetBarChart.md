# BudgetBarChart

Histogramme vertical pour afficher une serie de montants dates.

## Usage

```vue
<BudgetBarChart
  :points="[
    { x: '2026-01-01', y: 320 },
    { x: '2026-01-02', y: -120 },
    { x: '2026-01-03', y: 180 }
  ]"
  :color="{
    steps: [
      { min: -100000, color: 'error' },
      { min: 0, color: 'warning' },
      { min: 250, color: 'success' }
    ]
  }"
/>
```

## Props

- `points`: `Array<{ x: string | Date; y: number }>`
- `color`: variant (`primary | neutral | success | warning | error`) ou steps:

```ts
{
  steps: [
    { min: -100000, color: "error" },
    { min: 0, color: "warning" },
    { min: 250, color: "success" }
  ];
}
```

Regles steps:
- Le composant prend le dernier step dont `min <= value`.
- Si aucun step ne correspond, fallback sur `neutral` + warning console.
- Si plusieurs steps ont le meme `min`, le dernier gagne + warning console.

- `seriesLabel`: libelle de serie (defaut: `Montant`)
- `maxXAxisLabels`: limite de labels visibles sur l'axe X (defaut: `6`)
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

- Format date axe X: `dd/mm`.
- Format montants axe Y et tooltip: `1 000,00 €` (locale `fr-FR`).
- Legende masquee sur mobile (`<768px`) et labels X rotates sur mobile.


