## Project Agent Rules

### Scope
- This repository hosts a Vue 3 component library for a budget SaaS.
- Work is internal-only; avoid public references or external brand assets.

### Stack and constraints
- Vue 3 Composition API + TypeScript only.
- Build with Vite lib mode; target ES2022.
- Package manager: Yarn v4 with `.yarnrc.yml`, `node_modules` linker.
- Styles: Tailwind CSS compiled into the library bundle; avoid external design token systems.
- Peer dependencies: `vue` and `@fortawesome/*`.

### Component conventions
- Component prefix: `Budget*` (e.g., `BudgetButton`).
- Files per component: `ComponentName.vue`, `ComponentName.stories.ts`, `ComponentName.md`.
- Folder structure: `src/components/`, `stories/`, `docs/` organized by component.
- Export via a single `src/index.ts`.

### Storybook
- Use Storybook with Vite.
- Addons: docs, controls, actions, a11y, interactions, viewport.
- Docs: auto-props from TypeScript plus a short, factual description.
- Stories: one per component with state variations.
- Reference each `ComponentName.md` in Storybook.

### Accessibility
- Enforce focus-visible, aria labels/roles, and keyboard navigation.
- `aria-invalid` when `error=true`.
- Link error text with `aria-describedby`.
- Target WCAG AA for inputs and buttons.

### Testing
- Use Vitest + @vue/test-utils.
- 100% coverage for lines/branches/functions.
- No snapshots (unless explicitly added later).

### Icons
- Font Awesome SVG via `@fortawesome/vue-fontawesome`.
- Central registry mapping semantic names like `status-success`.
- Registry should only include icons used by components.

### Budget amount input
- Format: `1 000,00 €` (NBSP before `€`).
- Format live while typing; preserve cursor position.
- Always 2 decimals.
- Emits `number` in euros.
- Support a boolean prop to allow empty/null values instead of defaulting to `0`.
