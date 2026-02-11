# BudgetBreadcrumb

Conteneur de navigation de type fil d'ariane compose de `BudgetBreadcrumbItem`.

## Usage

```vue
<BudgetBreadcrumb :max-items="3">
  <BudgetBreadcrumbItem label="Accueil" href="/" />
  <BudgetBreadcrumbItem label="Comptes" href="/comptes" />
  <BudgetBreadcrumbItem label="Detail" />
</BudgetBreadcrumb>
```

## Props

- `maxItems`: nombre maximal de vrais items avant troncature (par defaut `3`)
- `ariaLabel`: libelle accessible du `nav` (par defaut `Fil d'ariane`)

## Behavior

- si le nombre d'items depasse `maxItems`, le composant affiche `premier / ... / dernier`
- le separateur est un chevron vers la droite
