# BudgetTable

Tableau compose avec tri par colonne, selection, pagination client et groupes repliables.

## Usage

```vue
<BudgetTable v-model:selected="selectedRows" :page-size="5" selectable>
  <template #header>
    <BudgetTableHeader sortable sort-key="label">Libelle</BudgetTableHeader>
    <BudgetTableHeader sortable sort-key="amount" align="right">Montant</BudgetTableHeader>
  </template>

  <BudgetTableGroup title="Transactions a venir" collapsible color="info">
    <BudgetTableRow row-id="r1" :sort-values="{ label: 'Abonnement', amount: 25 }">
      <BudgetTableCell>Abonnement</BudgetTableCell>
      <BudgetTableCell align="right">25,00 €</BudgetTableCell>
      <template #actions>
        <button type="button">Ouvrir</button>
      </template>
    </BudgetTableRow>
  </BudgetTableGroup>
</BudgetTable>
```

## Props

- `selected`: ids des lignes selectionnees (`v-model:selected`)
- `selectable`: active les cases a cocher de selection
- `pageSize`: active la pagination interne si defini
- `loading`: affiche un etat de chargement
- `emptyText`: texte affiche quand aucune ligne visible

## Slots

- `header`: colonnes `BudgetTableHeader`
- `default`: lignes `BudgetTableRow` et groupes `BudgetTableGroup`
- `actionsHeader`: libelle de l'entete de colonne d'actions

## Sizing Colonnes

Utiliser sur `BudgetTableHeader`:

- `:span=\"n\"` pour une largeur cible `n/12`
- `fit-content` pour une colonne a la largeur de son contenu

