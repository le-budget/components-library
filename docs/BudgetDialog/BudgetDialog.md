# BudgetDialog

Fenetre modale centree, affichee au-dessus de la page.

## Usage

```vue
<BudgetDialog v-model:open="open" title="Confirmer">
  <p>Contenu du dialog</p>
</BudgetDialog>
```

## Props

- `open`: controle l'ouverture via `v-model:open`
- `defaultOpen`: ouverture initiale en mode non controle
- `title`: titre affiche dans le header
- `closeLabel`: libelle aria du bouton fermer
- `closeOnOverlay`: ferme au clic sur le fond
- `closeOnEscape`: ferme sur la touche Echap
- `showOverlay`: affiche ou masque le fond assombri
- `showClose`: affiche ou masque la croix de fermeture
- `color`: `neutral | primary | success | warning | error`
- `maxWidthClass`: classes Tailwind pour la largeur maximale

## Slots

- `icon`: zone icone a gauche du titre
- `default`: contenu principal du dialog
- `footer`: zone d'actions en bas du dialog

## Events

- `update:open`: emis a chaque ouverture/fermeture
- `close`: emis a la fermeture utilisateur (croix, overlay, Echap)
