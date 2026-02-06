# BudgetStatusIcon

Icone de statut basee sur une registry interne Font Awesome.

## Usage

```vue
<BudgetStatusIcon status="status-success" />
```

## Props

- `status`: `status-success | status-warning | status-error | status-info`
- `size`: `sm | md | lg` (par defaut `md`)
- `label`: libelle accessible (optionnel)
- `color`: `success | warning | error | primary | disabled | base` (optionnel)

## Examples

```vue
<BudgetStatusIcon status="status-warning" size="lg" color="warning" />
```
