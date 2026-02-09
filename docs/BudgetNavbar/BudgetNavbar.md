# BudgetNavbar

Barre de navigation principale pour l'espace connecte.

## Usage

```vue
<BudgetNavbar position="relative">
  <template #brand>
    <span>Budget SaaS</span>
  </template>

  <BudgetNavbarMenu>
    <BudgetNavbarMenuItem active>
      <a href="#" class="w-full">Tableau de bord</a>
    </BudgetNavbarMenuItem>
  </BudgetNavbarMenu>

  <template #notifications>
    <button type="button">Notifications</button>
  </template>

  <template #user-menu>
    <button type="button">Profil</button>
  </template>
</BudgetNavbar>
```

## Props

- `label`: libelle accessible de la navigation (par defaut `Navigation principale`)
- `position`: `relative | sticky | fixed` (par defaut `relative`)
- `defaultOpen`: ouvre le menu mobile au rendu initial
- `openLabel`: libelle du bouton d'ouverture mobile
- `closeLabel`: libelle du bouton de fermeture mobile

## Slots

- `brand`: zone marque/logo
- `default`: menu principal (recommande avec `BudgetNavbarMenu`)
- `notifications`: zone de notifications
- `user-menu`: zone menu utilisateur (futur `BudgetAvatar`)

## Responsive

- Mobile: menu repliable avec `brand/default/notifications`; `user-menu` reste visible
- Desktop: toutes les zones visibles en ligne