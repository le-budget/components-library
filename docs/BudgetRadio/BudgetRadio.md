# BudgetRadio

Bouton radio personnalise avec variantes de couleur et de taille.

## Usage

```vue
<BudgetRadio v-model="selected" name="frequency" value="monthly" label="Mensuel" />
```

## Props

- `modelValue`: valeur courante (standalone)
- `value`: valeur emise quand le radio est selectionne
- `label`: texte de label
- `name`: nom HTML du groupe radio
- `disabled`: desactive l'option
- `color`: `primary | neutral | success | warning | error`
- `size`: `sm | md | lg` (par defaut `md`)
- `error`: active `aria-invalid`
- `errorMessage`: message affiche en mode erreur hors groupe

## Examples

```vue
<BudgetRadio v-model="selected" name="status" value="active" color="success" />
```
