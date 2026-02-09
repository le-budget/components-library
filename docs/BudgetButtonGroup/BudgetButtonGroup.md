# BudgetButtonGroup

Conteneur horizontal pour coller plusieurs `BudgetButton`.

## Usage

```vue
<BudgetButtonGroup>
  <BudgetButton color="secondary">Jour</BudgetButton>
  <BudgetButton color="secondary">Semaine</BudgetButton>
  <BudgetButton color="secondary">Mois</BudgetButton>
</BudgetButtonGroup>
```

## Behavior

- conserve `border-top` et `border-bottom` sur tous les boutons
- applique les arrondis uniquement sur le premier et le dernier bouton
- garde une separation interne en `1px` entre boutons
- conserve une bordure externe gauche/droite sur les boutons extremes
