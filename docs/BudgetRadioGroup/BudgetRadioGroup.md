# BudgetRadioGroup

Conteneur de radios avec gestion de la valeur, orientation et accessibilite.

## Usage

```vue
<BudgetRadioGroup v-model="frequency" label="Frequence">
  <BudgetRadio value="weekly" label="Hebdomadaire" />
  <BudgetRadio value="monthly" label="Mensuel" />
</BudgetRadioGroup>
```

## Props

- `modelValue`: valeur selectionnee
- `label`: libelle du groupe
- `name`: nom HTML partage par les radios
- `orientation`: `horizontal | vertical` (par defaut `horizontal`)
- `disabled`: desactive toutes les options
- `color`: couleur par defaut des options
- `size`: taille par defaut des options
- `error`: active `aria-invalid` et l'affichage d'erreur
- `errorMessage`: message d'erreur (defaut: `Valeur invalide`)

## Keyboard

- `ArrowRight` / `ArrowDown`: option suivante
- `ArrowLeft` / `ArrowUp`: option precedente
