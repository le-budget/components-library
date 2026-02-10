# BudgetAccordion

Conteneur d'accordeon compose de plusieurs `BudgetAccordionItem`.

## Usage

```vue
<BudgetAccordion>
  <BudgetAccordionItem title="Section 1">
    Contenu
  </BudgetAccordionItem>
</BudgetAccordion>
```

## Props

- `multiple`: autorise plusieurs sections ouvertes en meme temps
- `spaced`: ajoute un espace de 10px entre chaque item

## Accessibility

- navigation clavier sur les chevrons: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
- chaque item expose `aria-expanded` et `aria-controls`
