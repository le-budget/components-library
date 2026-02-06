# BudgetCheckbox

Case a cocher personnalisee avec variantes de couleur.

## Usage

```vue
<BudgetCheckbox v-model="agreed" label="J'accepte" />
```

## Props

- `modelValue`: valeur booleenne
- `label`: texte de label
- `disabled`: desactive la case
- `color`: `primary | success | warning | error`

## Examples

```vue
<BudgetCheckbox v-model="isChecked" color="success" />
```
