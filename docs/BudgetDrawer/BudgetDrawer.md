# BudgetDrawer

Panneau lateral affiche au-dessus de la page, place a gauche ou a droite.

## Usage

```vue
<BudgetDrawer v-model="open" title="Filtres">
  <p>Contenu du drawer</p>
</BudgetDrawer>
```

## Props

- `modelValue`: controle l'ouverture via `v-model`
- `defaultOpen`: ouverture initiale en mode non controle
- `placement`: `left | right`
- `title`: titre affiche dans le header
- `icon`: icone de statut (`StatusIconName`) ou `false`
- `closeLabel`: libelle aria du bouton fermer
- `closeOnOverlay`: ferme au clic sur le fond
- `closeOnEscape`: ferme sur la touche Echap
- `showOverlay`: affiche ou masque le fond assombri
- `widthClass`: classes Tailwind pour la largeur du panneau
- `borderColor`: `neutral | primary | success | warning | error`
- `borderThickness`: `none | sm | md | lg`

## Slots

- `default`: contenu principal du panneau
- `footer`: zone d'actions en bas du panneau

## Events

- `update:modelValue`: emis a chaque ouverture/fermeture
- `close`: emis a la fermeture utilisateur (croix, overlay, Echap)

