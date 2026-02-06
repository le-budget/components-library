# BudgetInputText

Champ texte avec validation integree et icones prefix/suffix.

## Usage

```vue
<BudgetInputText v-model="name" label="Nom" />
```

## Props

- `modelValue`: valeur du champ
- `label`: libelle au-dessus du champ
- `placeholder`: texte d'aide
- `disabled`: desactive le champ
- `error`: active l'etat d'erreur
- `errorMessage`: message d'erreur (defaut: "Valeur invalide")

## Slots

- `prefix`: icone avant le texte
- `suffix`: icone apres le texte

## Examples

```vue
<BudgetInputText v-model="email" label="Email" :error="hasError" />
```
