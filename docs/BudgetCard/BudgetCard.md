# BudgetCard

Section de contenu standard avec fond, bordure, titre et option de repli.

## Usage

```vue
<BudgetCard title="Titre">
  <p>Contenu</p>
</BudgetCard>
```

Avec icone:

```vue
<BudgetCard title="Budget">
  <template #icon>
    <BudgetIcon status="status-info" />
  </template>
  <p>Contenu</p>
</BudgetCard>
```

## Slots

- `default`: contenu libre
- `icon`: icone a gauche du titre

## Props

- `title`: titre optionnel affiche en haut de la card
- `collapsible`: active le mode repliable
- `collapsed`: etat replie controle par le parent (optionnel)

## Events

- `update:collapsed`: emis au clic sur l'icone si `collapsible` est actif

Si `collapsed` n'est pas fourni, la card gere son etat en interne tout en emettant `update:collapsed`.
