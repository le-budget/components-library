# BudgetLineChart

Courbe pour afficher l'evolution d'un solde ou d'un montant dans le temps.

## Usage

```vue
<BudgetLineChart
  :points="[
    { x: '2026-01-01', y: 420 },
    { x: '2026-01-02', y: 120 },
    { x: '2026-01-03', y: -90 }
  ]"
  :threshold="0"
  :fill="true"
  :color="{
    steps: [
      { min: -100000, color: 'error' },
      { min: 0, color: 'warning' },
      { min: 150, color: 'success' }
    ]
  }"
/>
```

## Props

- `points`: `Array<{ x: string | Date; y: number }>`
- `color`: variant (`primary | neutral | success | warning | error`) ou steps
- `threshold`: seuil de changement de couleur (defaut: `0`)
- `fill`: active la zone sous la courbe (defaut: `false`)
- `smooth`: active le lissage de la courbe (defaut: `true`)
- `tension`: niveau de lissage de `0` a `1` (defaut: `0.3`, ignore si `smooth=false`)
- `seriesLabel`: libelle de serie (defaut: `Solde`)
- `maxXAxisLabels`: limite de labels visibles sur l'axe X (defaut: `6`)
- `height`: hauteur du graphique en pixels (defaut: `320`)`r`n- `showLegend`: affiche ou masque la legende (defaut: `true`)

Regles steps:
- Le composant prend le dernier step dont `min <= value`.
- Si aucun step ne correspond, fallback sur `neutral` + warning console.
- Si plusieurs steps ont le meme `min`, le dernier gagne + warning console.

Props d'etat:
- `loading` / `loadingMessage`
- `error` / `errorMessage`
- `emptyMessage`

## Slots

- `loading`
- `error`
- `empty`

## Comportement

- Coloration de la ligne segment par segment selon la valeur, y compris lors du franchissement du seuil entre deux points.
- Si `fill=true`, la zone est coloree avec une teinte transparente.
- Si `value < threshold`, la couleur de ligne et de zone bascule selon la configuration.
- Format date axe X: `dd/mm`.
- Format montants axe Y et tooltip: `1 000,00 €` (locale `fr-FR`).
- Legende masquee sur mobile (`<768px`) et labels X rotates sur mobile.


