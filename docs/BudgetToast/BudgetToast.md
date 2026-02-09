# BudgetToast

Systeme de notifications temporaires pilote par API imperative avec pile limitee a 10 elements.

## Usage

```vue
<script setup lang="ts">
import { budgetToast, BudgetToastContainer } from "@le-budget/components-library";

function notify() {
  budgetToast.success("Succes", "Operation terminee");
}
</script>

<template>
  <button @click="notify">Notifier</button>
  <BudgetToastContainer />
</template>
```

## API imperative

- `budgetToast.push(options)`: ajoute un toast et retourne son id
- `budgetToast.info | success | warning | error | question(title, description?, options?)`
- `budgetToast.remove(id)`: supprime un toast
- `budgetToast.clear()`: vide la pile
- `useBudgetToast()`: acces reactif a `toasts` + memes methodes

## Options

- `title`: titre principal du toast (obligatoire)
- `description`: texte secondaire
- `variant`: `info | warning | question | error | success`
- `color`: `primary | secondary | ghost | primary-success | secondary-success | primary-warning | secondary-warning | primary-error | secondary-error`
- `duration`: duree en ms (`4000` par defaut, `0` = persistant)
- `icon`: icone forcee (`status-*`) ou `false` pour masquer
- `pauseOnHover`: pause/reprise du timer au survol (`true` par defaut)
- `closeLabel`: libelle aria du bouton fermer
- `visible`: `false` pour ne pas afficher le toast

## Comportement

- Position unique en haut a droite via `BudgetToastContainer`
- Maximum 10 toasts visibles
- Quand la limite est depassee, le plus ancien est retire
- Les toasts de type `error` utilisent `aria-live="assertive"`
- Par defaut, `color` est derivee de `variant` mais peut etre surchargee
