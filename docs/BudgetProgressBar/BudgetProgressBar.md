# BudgetProgressBar

Barre de progression horizontale qui prend toute la largeur de son parent.

## Usage

```vue
<BudgetProgressBar :value="72" :thickness="12" :display-value="true" display-value-position="topRight" />
```

## Props

- `value`: nombre de `0` a `100` (les valeurs hors plage sont bornees)
- `color`: variant simple (`primary | neutral | success | warning | error`) ou configuration par paliers:

```ts
{
  steps: [
    { min: 0, color: "error" },
    { min: 30, color: "warning" },
    { min: 60, color: "success" }
  ];
}
```

Regles des paliers:
- Le composant prend le dernier step dont `min <= displayedValue`.
- Si aucun step ne correspond, fallback sur `neutral` + warning dans la console.
- Si plusieurs steps ont le meme `min`, le dernier gagne + warning dans la console.

- `thickness`: epaisseur en pixels de la barre (par defaut `8`)
- `animated`: active l'animation de progression (par defaut `true`)
- `animationDuration`: duree de l'animation en millisecondes (par defaut `450`)
- `displayValue`: affiche la valeur au format pourcentage (par defaut `false`)
- `displayValuePosition`: position de la valeur:
  - `onBar`
  - `top`
  - `bottom`
  - `topLeft`
  - `topRight`
  - `bottomLeft`
  - `bottomRight`

## Accessibilite

- Le composant expose `role="progressbar"` avec `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
