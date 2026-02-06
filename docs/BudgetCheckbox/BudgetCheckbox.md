# BudgetCheckbox

Case a cocher personnalisee avec support d'erreur.

## Usage

```vue
<BudgetCheckbox v-model="agreed" label="J'accepte" />
```

## Props

- `modelValue`: valeur booleenne
- `label`: texte de label
- `disabled`: desactive la case
- `error`: active l'etat d'erreur
- `errorMessage`: message d'erreur (defaut: "Valeur invalide")

## Examples

```vue
<BudgetCheckbox v-model="isChecked" />
```
