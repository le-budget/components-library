# BudgetRadialProgress

Barre de progression circulaire dans un conteneur carre. A `100`, le cercle est complet.

## Usage

```vue
<BudgetRadialProgress :value="72" size="xl" color="success" />
```

## Props

- `value`: nombre de `0` a `100` (les valeurs hors plage sont bornees)
- `size`: `sm | md | lg | xl | xxl` (par defaut `md`)
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

- `strokeWidth`: epaisseur en pixels (par defaut: ratio automatique selon la taille)
- `animated`: active l'animation de progression (par defaut `true`)
- `animationDuration`: duree de l'animation en millisecondes (par defaut `450`)

## Tailles

- `sm`: `16px`
- `md`: `24px`
- `lg`: `32px`
- `xl`: `64px`
- `xxl`: `92px`

## Accessibilite

- Le composant expose `role="progressbar"` avec `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- La valeur en pourcentage est affichee au centre pour `xl` et `xxl`.
