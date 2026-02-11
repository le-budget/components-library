# BudgetBreadcrumbItem

Element enfant de `BudgetBreadcrumb`.

## Usage

```vue
<BudgetBreadcrumbItem label="Comptes" href="/comptes">
  <template #icon>
    <BudgetIcon status="status-info" decorative />
  </template>
</BudgetBreadcrumbItem>
```

## Props

- `label`: texte affiche pour l'item
- `href`: lien optionnel; sans `href`, l'item est rendu en texte non cliquable

## Slots

- `icon`: icone affichee avant le label
