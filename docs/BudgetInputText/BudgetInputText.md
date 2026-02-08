# BudgetInputText

Champ texte avec validation integree et icones prefix/suffix.

## Usage

```vue
<BudgetInputText v-model="name" label="Nom" />
```

## Props

- `modelValue`: valeur du champ
- `size`: taille du champ (`sm` | `md` | `lg`, defaut: `md`)
- `align`: alignement du texte (`left` | `right`, defaut: `left`)
- `label`: libelle au-dessus du champ
- `placeholder`: texte d'aide
- `autocomplete`: valeur HTML autocomplete (defaut: `off`)
- `disabled`: desactive le champ
- `error`: active l'etat d'erreur
- `success`: active l'etat de succes
- `errorMessage`: message d'erreur (defaut: "Valeur invalide")

## Slots

- `prefix`: icone avant le texte
- `suffix`: icone apres le texte

## Examples

```vue
<BudgetInputText v-model="email" label="Email" :error="hasError" />
```
