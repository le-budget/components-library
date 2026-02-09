# BudgetIcon

Icone de statut basee sur une registry interne Font Awesome.

## Usage

```vue
<BudgetIcon status="status-success" />
```

## Props

- `status`: `status-success | status-warning | status-error | status-info`
- `size`: `sm | md | lg | xl | xxl` (par defaut `md`)
- `label`: libelle accessible (optionnel)
- `color`: `primary | success | warning | error | neutral | white` (par defaut `primary`)
- `decorative`: masque l'icone aux technologies d'assistance (`aria-hidden=true`)

## Examples

```vue
<BudgetIcon status="status-warning" size="xl" color="warning" />
<BudgetIcon status="status-info" decorative />
```
