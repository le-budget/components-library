# BudgetAlert

Conteneur d'information arrondi avec variantes de couleur, tailles et fermeture optionnelle.

## Usage

```vue
<BudgetAlert text="Montant en attente de validation." />
```

## Props

- `text`: texte affiche quand le slot par defaut n'est pas fourni
- `color`: `primary | secondary | ghost | primary-success | secondary-success | primary-warning | secondary-warning | primary-error | secondary-error`
- `size`: `sm | md | lg`
- `dismissible`: affiche un bouton de fermeture en haut a droite
- `closeLabel`: libelle aria du bouton de fermeture
- `autoDismiss`: ferme automatiquement l'alerte apres un delai
- `dismissAfter`: delai avant fermeture automatique (en millisecondes)
- `pauseOnHover`: met en pause l'auto-fermeture au survol

## Slots

- `default`: contenu principal de l'alerte
- `prefix`: contenu place a gauche (icone, badge, etc.)
- `suffix`: contenu place a droite (icone, badge, etc.)

## Events

- `dismiss`: emis quand l'utilisateur ferme l'alerte

## Examples

```vue
<BudgetAlert color="primary-error" dismissible>
  <template #prefix>
    <BudgetIcon status="status-error" />
  </template>
  Une erreur est survenue.
</BudgetAlert>
```
