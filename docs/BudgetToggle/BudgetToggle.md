# BudgetToggle

Interrupteur binaire avec `v-model`, couleurs, tailles et texte d'etat optionnel.

## Usage

```vue
<BudgetToggle v-model="enabled" color="success" active-text="Actif" inactive-text="Inactif" />
```

## Props

- `modelValue`: etat actif/inactif (par defaut `false`)
- `color`: `primary | neutral | success | warning | error` (par defaut `primary`)
- `size`: `sm | md | lg | xl` (par defaut `md`)
- `activeText`: texte affiche a droite quand actif (optionnel)
- `inactiveText`: texte affiche a droite quand inactif (optionnel)
- `disabled`: desactive l'interaction
- `id`: identifiant HTML de l'input
- `name`: nom HTML de l'input
- `ariaLabel`: libelle annonce aux technologies d'assistance
