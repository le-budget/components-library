# BudgetAmountInput

Champ de saisie de montant formate en direct.

## Usage

```vue
<BudgetAmountInput v-model="amount" label="Montant" />
```

## Props

- `modelValue`: nombre en euros
- `allowEmpty`: autorise une valeur vide (null) au lieu de 0
- `label`: libelle au-dessus du champ
- `placeholder`: texte d'aide
- `disabled`: desactive le champ
- `error`: active l'etat d'erreur
- `errorMessage`: message d'erreur (defaut: "Valeur invalide")

## Examples

```vue
<BudgetAmountInput v-model="amount" :allowEmpty="true" />
```
