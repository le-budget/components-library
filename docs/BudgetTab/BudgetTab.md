# BudgetTab

Conteneur d'onglets horizontaux compose de plusieurs `BudgetTabItem`.

## Usage

```vue
<BudgetTab>
  <BudgetTabItem title="Synthese" :default-active="true">
    Contenu
  </BudgetTabItem>
</BudgetTab>
```

## Props

- `spaced`: `false` par defaut, colle les onglets entre eux; `true` ajoute un espacement entre onglets
- `borderWidth`: `sm | md | lg`, definit l'epaisseur de bordure des onglets et du contenu

## Accessibility

- `role="tablist"` avec orientation horizontale
- chaque onglet expose `role="tab"` avec `aria-selected` et `aria-controls`
- chaque panneau expose `role="tabpanel"` avec `aria-labelledby`
- navigation clavier: `ArrowLeft`, `ArrowRight`, `Home`, `End`, `Enter`, `Space`
