# BudgetAccordionItem

Element unitaire pour `BudgetAccordion` avec en-tete colore, icone optionnelle et contenu repliable.

## Usage

```vue
<BudgetAccordionItem title="Resume" color="primary-warning">
  <template #icon>
    <BudgetIcon status="status-warning" decorative />
  </template>
  Details de la section.
</BudgetAccordionItem>
```

## Props

- `title`: titre affiche dans l'en-tete
- `color`: `primary | secondary | ghost | primary-success | secondary-success | primary-warning | secondary-warning | primary-error | secondary-error`
- `defaultOpen`: ouvre l'item au rendu initial
- `chevronLabel`: libelle aria du bouton chevron
- `disabled`: desactive l'ouverture/fermeture

## Slots

- `icon`: zone icone dans l'en-tete
- `default`: contenu de la section
