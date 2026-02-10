# BudgetTabItem

Element unitaire pour `BudgetTab` avec titre, icone optionnelle et contenu associe.

## Usage

```vue
<BudgetTabItem title="Alertes" color="primary-warning">
  <template #icon>
    <BudgetIcon status="status-warning" decorative />
  </template>
  Contenu de l'onglet.
</BudgetTabItem>
```

## Props

- `title`: titre affiche dans l'onglet
- `color`: `primary | neutral | secondary-neutral | secondary | ghost | primary-success | secondary-success | primary-warning | secondary-warning | primary-error | secondary-error`
- `disabled`: desactive l'onglet
- `defaultActive`: active l'onglet au rendu initial

## Slots

- `icon`: icone optionnelle dans le bouton d'onglet
- `default`: contenu du panneau
