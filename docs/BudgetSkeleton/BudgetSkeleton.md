# BudgetSkeleton

Placeholder visuel pour indiquer un chargement en cours.

## Usage

```vue
<BudgetSkeleton variant="text" :lines="3" />
```

## Props

- `variant`: `text | rect | circle | image`
- `size`: taille des lignes texte `sm | md | lg`
- `width`: largeur CSS (`number` en px ou `string`)
- `height`: hauteur CSS (`number` en px ou `string`)
- `lines`: nombre de lignes en mode `text`
- `rounded`: rayon `none | sm | md | lg | full`
- `animated`: active/desactive l'animation
- `animation`: `pulse | shimmer`
- `ratio`: ratio pour `variant="image"` (`1:1 | 4:3 | 16:9`)

Le composant est decoratif (`aria-hidden="true"`).
