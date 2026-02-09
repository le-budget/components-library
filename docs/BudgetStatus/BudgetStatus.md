# BudgetStatus

Indicateur de statut visuel sous forme de pastille coloree.

## Usage

```vue
<BudgetStatus color="success" size="md" label="Paiement confirme" />
```

## Props

- `color`: `primary | neutral | success | warning | error` (par defaut `primary`)
- `size`: `sm | md | lg | xl | xxl` (par defaut `md`, `xxl` = `h-5 w-5`)
- `animation`: `null | bounce | pulse | ping` (par defaut `null`)
- `label`: libelle accessible pour lecteurs d'ecran. Si absent, le composant est decoratif (`aria-hidden=true`).
