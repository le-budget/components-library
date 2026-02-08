# BudgetCheckbox

Case a cocher personnalisee avec variantes de couleur et de taille.

## Usage

```vue
<BudgetCheckbox v-model="agreed" label="J'accepte" />
```

## Props

- `modelValue`: valeur booleenne
- `label`: texte de label
- `disabled`: desactive la case
- `color`: `primary | neutral | success | warning | error`
- `size`: `sm | md | lg` (par defaut `md`)

## Examples

```vue
<BudgetCheckbox v-model="isChecked" color="success" size="lg" />
```
