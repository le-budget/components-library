# BudgetInputFile

Champ de selection de fichier unique avec drag and drop, filtrage par type et controle de taille.

## Usage

```vue
<BudgetInputFile
  v-model="file"
  label="Justificatif"
  accept=".pdf,image/*"
  :maxFileSize="2 * 1024 * 1024"
/>
```

## Props

- `modelValue`: fichier courant (`File | null`)
- `size`: taille visuelle (`sm` | `md` | `lg`, defaut: `md`)
- `color`: couleur de l'input (`primary` | `success` | `warning` | `error` | `neutral`, defaut: `primary`)
- `label`: libelle au-dessus du champ
- `placeholder`: texte affiche quand aucun fichier n'est selectionne
- `dropzoneLabel`: texte principal dans la zone de drop
- `name`: attribut HTML name
- `id`: id HTML personnalise
- `disabled`: desactive le champ
- `required`: rend le champ obligatoire
- `accept`: types acceptes (string HTML `accept` ou tableau)
- `maxFileSize`: taille max par fichier en octets
- `error`: active l'etat d'erreur
- `errorMessage`: message d'erreur personnalise

## Emits

- `update:modelValue`: emet le fichier valide ou `null`
- `invalid`: emet le detail d'un fichier refuse (`reason`, `file`, `acceptedTypes` ou `maxFileSize`)

## Accessibilite

- Navigation clavier sur la dropzone (`Enter` / `Espace`)
- `aria-invalid` active en erreur
- Liaison du message d'erreur via `aria-describedby`
- Indicateurs visuels `focus-visible`
