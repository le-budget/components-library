# BudgetAmountInput

Champ montant avec formatage en direct, validation integree et slots prefix/suffix.

## Usage

```vue
<BudgetAmountInput v-model="amount" label="Montant" />
```

## Props

- `modelValue`: nombre en euros
- `size`: taille du champ (`sm` | `md` | `lg`, defaut: `md`)
- `label`: libelle au-dessus du champ
- `placeholder`: texte d'aide
- `autocomplete`: valeur HTML autocomplete (defaut: `off`)
- `disabled`: desactive le champ
- `error`: active l'etat d'erreur
- `success`: active l'etat de succes
- `errorMessage`: message d'erreur (defaut: "Valeur invalide")
- `allowEmpty`: autorise une valeur vide (`null`) au lieu de `0`

## Slots

- `prefix`: contenu affiche avant la saisie
- `suffix`: contenu affiche apres la saisie

## Comportement

- Format affiche: `1 000,00 \u20AC` (espace inseparable avant la devise)
- Saisie negative autorisee
- Emission `update:modelValue` en `number` (ou `null` si `allowEmpty=true`)

## Examples

```vue
<BudgetAmountInput v-model="amount" :allowEmpty="true" success />
```
