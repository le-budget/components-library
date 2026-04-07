# BudgetCategoryContainer

Conteneur data-driven pour rendre plusieurs `BudgetCategoryGroup` et leurs `BudgetCategoryItem`, avec drag & drop natif HTML5.

## Usage

```vue
<BudgetCategoryContainer
  :groups="groups"
  size="md"
  @update:groups="groups = $event"
  @reorder="lastOrder = $event"
/>
```

## Props

- `groups`: liste des groupes et de leurs items
- `size`: densite visuelle globale (`sm | md | lg`), transmise aux groupes et items
- `disabled`: desactive tout le drag & drop
- `hasCheckbox`: valeur par defaut des checkboxes groupe/item
- `groupCheckboxColor`: couleur des checkboxes de groupe
- `itemCheckboxColor`: couleur des checkboxes d'item
- `showGroupDropIndicators`: affiche les indicateurs visuels de drop entre groupes
- `showItemDropIndicators`: affiche les indicateurs visuels de drop entre items

## Types publics

- `BudgetCategoryContainerGroup`
- `BudgetCategoryContainerItem`
- `BudgetCategoryContainerOrderEntry`

## Evenements

- `update:groups`: structure imbriquee mise a jour apres drop
- `reorder`: tableau arborescent `{ id, order, items: [{ id, order }] }` emis apres drop
- `update:collapsed`: changement d'etat replie d'un groupe
- `update:groupSelected`: changement de selection d'un groupe
- `update:itemSelected`: changement de selection d'un item

## Notes

- La V1 ne gere que la structure `groups -> items`.
- Le drag se fait via une poignee dediee sur les groupes et les items.
- Les groupes peuvent etre reordonnes.
- Les items peuvent etre reordonnes dans un groupe ou deplaces vers un autre groupe.
