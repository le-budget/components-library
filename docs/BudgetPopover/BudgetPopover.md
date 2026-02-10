# BudgetPopover

Infobulle enrichie avec titre et icone optionnels, ouverte au survol et au focus clavier.

## Usage

```vue
<BudgetPopover title="Information" icon="status-info">
  <template #trigger>
    <button type="button">Voir detail</button>
  </template>
  Texte du popover.
</BudgetPopover>
```

## Props

- `title`: titre optionnel affiche en haut du popover
- `icon`: nom d'icone (`StatusIconName`) depuis la librairie
- `color`: `neutral | primary | success | warning | error`
- `placement`: `top | bottom | left | right` (position preferee)
- `offset`: espace en pixels entre trigger et popover
- `maxWidthClass`: classes Tailwind pour la largeur maximale

## Placement intelligent

- Le composant essaie d'abord la valeur de `placement`
- Si l'espace est insuffisant, il bascule automatiquement vers les autres cotes
- Recalcul automatique a l'ouverture, au scroll et au resize

## Accessibilite

- `role="tooltip"` sur le contenu
- liaison `aria-describedby` automatique avec l'element de declenchement
- ouverture au survol et au focus clavier
- fermeture a la sortie (`mouseleave`/`blur`) et avec `Escape`

## Slots

- `trigger`: element qui declenche le popover
- `icon`: override de la zone icone
- `default`: contenu principal
