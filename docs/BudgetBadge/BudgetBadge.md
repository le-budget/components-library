# BudgetBadge

Badge simple avec texte et couleur.

## Usage

```vue
<BudgetBadge text="Actif" />
```

## Props

- `text`: texte du badge
- `color`: `primary | secondary | ghost | success | warning | error`
- `size`: `sm | md | lg`

## Examples

```vue
<BudgetBadge text="Archive" color="secondary" />
<BudgetBadge text="SM" size="sm" />
<BudgetBadge text="Avec icone">
  <template #icon>
    <BudgetIcon status="status-info" size="sm" />
  </template>
</BudgetBadge>
```
