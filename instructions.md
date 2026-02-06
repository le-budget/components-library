# Instructions Projet - Components Library

## Objectif
- Bibliotheque de composants Vue 3 interne pour un SaaS de gestion de budget personnel.
- Composants basiques + composants métier.
- Documentation via Storybook, en francais.

## Stack et contraintes
- Vue 3 (Composition API uniquement) + TypeScript.
- Build via Vite en mode lib (Rollup), target ES2022.
- Package manager: Yarn v4 avec `.yarnrc.yml` (node-modules linker).
- Styles: Tailwind CSS compile dans le bundle (pas de design tokens externe).
- Dark mode: piloté par classe `.dark` via `@custom-variant` (Tailwind v4).
- Peer dependencies: `vue` + `@fortawesome/*`.
- Publication: GitHub Packages, versioning manuel + tag.
- Licence: UNLICENSED (private).

## Composants initiaux
- `BudgetInputText`
  - validation integree
  - icones prefix/suffix
- `BudgetButton`
  - etats: loading, disabled, error
  - variantes: texte seul, icone seule, icone + texte
  - tailles: sm, md, lg
- `BudgetCheckbox`
  - pas d’indeterminate
- `BudgetAmountInput`
  - format `1 000,00 €` (espace insecable avant €)
  - formatage en direct
  - curseur preserve
  - 2 decimales fixes
  - valeur emise: number (euros)
  - prop boolean pour autoriser `null`/vide (sinon 0)
- `BudgetBadge`
  - texte + couleur
- `BudgetIcon`
  - mapping semantique: `status-success`, `status-warning`, `status-error`, `status-info`

## Icônes
- Font Awesome free (solid/regular/brands), usage SVG via `@fortawesome/vue-fontawesome`.
- Registry centralisee (uniquement les icones utilisees par les composants).

## Storybook
- Storybook Vite.
- Addons: docs, a11y, themes (toolbar light/dark).
- Auto-props depuis TypeScript + description factuelle.
- Une story par composant + variantes d’etat.
- Docs par composant dans `docs/ComponentName/ComponentName.md` referencees dans Storybook.
- Toggle theme via addon themes + classe `.dark` sur `html`.

## Accessibilite
- Focus visible, roles/ARIA, navigation clavier.
- `aria-invalid` lorsque `error=true`.
- message d’erreur lie par `aria-describedby`.
- Objectif WCAG AA pour inputs et boutons.

## Tests
- Vitest + @vue/test-utils.
- Couverture 100% lignes/branches/fonctions (exclusions definies).
- Pas de snapshots pour l’instant.

## Structure et conventions
- Prefixe composants: `Budget*`.
- Fichiers: `ComponentName.vue`, `ComponentName.stories.ts`, `ComponentName.md`.
- Arborescence: `src/components/`, `stories/`, `docs/`.
- Export unique via `src/index.ts`.

## Distribution
- ESM uniquement (CJS possible plus tard si besoin).
- CSS embarque dans le bundle.
- Types generes via `vue-tsc`.

## CI / Publication
- CI: lint -> tests -> build -> build-storybook.
- Publish: GitHub Packages sur tag `X.Y.Z`.

## Note Tailwind v4
- `src/styles/tailwind.css` utilise `@import "tailwindcss";`
- `@custom-variant dark (&:where(.dark, .dark *));` pour forcer le mode class.
- PostCSS: `@tailwindcss/postcss` avec config `tailwind.config.js`.
