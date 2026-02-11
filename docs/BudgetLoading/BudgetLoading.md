# BudgetLoading

Wrapper de chargement qui affiche un Skeleton ou un slot personnalise.

## Usage

```vue
<BudgetLoading :loading="isLoading">
  <template #loading>
    <BudgetSkeleton variant="text" :lines="2" />
  </template>
  <p>Contenu charge</p>
</BudgetLoading>
```

## Props

- `loading`: active le mode chargement
- `loadingLabel`: texte annonce pour lecteur d'ecran
- `variant`: variante du Skeleton fallback
- `size`: taille du Skeleton texte fallback
- `width`: largeur du Skeleton fallback
- `height`: hauteur du Skeleton fallback
- `lines`: nombre de lignes du Skeleton texte fallback
- `rounded`: rayon du Skeleton fallback
- `animated`: active/desactive l'animation du fallback
- `animation`: `pulse | shimmer` pour le fallback
- `ratio`: ratio image du fallback

## Slots

- `default`: contenu normal (affiche quand `loading=false`)
- `loading`: contenu de chargement personnalise (affiche quand `loading=true`)
