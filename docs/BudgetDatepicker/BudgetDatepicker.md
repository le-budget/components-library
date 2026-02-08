# BudgetDatepicker

Datepicker pour saisir une date au format francais et exposer une valeur ISO.

## Usage

```vue
<BudgetDatepicker v-model="dateIso" label="Date" />
```

## Props

- `modelValue`: date selectionnee au format `YYYY-MM-DD` ou `null`
- `size`: taille du champ (`sm` | `md` | `lg`, defaut: `md`)
- `align`: alignement du texte (`left` | `right`, defaut: `left`)
- `label`: libelle au-dessus du champ
- `placeholder`: texte d'aide (defaut: `jj/mm/aaaa`)
- `autocomplete`: valeur HTML autocomplete (defaut: `off`)
- `disabled`: desactive le champ
- `error`: active l'etat d'erreur
- `success`: active l'etat de succes
- `errorMessage`: message d'erreur (defaut: "Valeur invalide")
- `minDate`: borne minimale ISO `YYYY-MM-DD` (defaut: vide)
- `maxDate`: borne maximale ISO `YYYY-MM-DD` (defaut: vide)

## Comportement

- Affichage et saisie utilisateur en `dd/mm/yyyy`
- Emission en ISO `YYYY-MM-DD`
- Si le champ est vide, emission de `null`
- Les dates hors bornes sont desactivees et grisees dans le calendrier
