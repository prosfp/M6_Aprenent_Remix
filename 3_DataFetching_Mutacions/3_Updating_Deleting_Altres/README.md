
### Gestionar l'acció d'actualització

Necessitem gestionar l'acció d'actualització de la despesa. Si ara tractes de guardar les dades, veuràs que no funcionarà perquè no tenim cap funció que ho faci.

Abans d'això però, fem atenció un moment a quelcom MOLT IMPORTANT.

Si et trobes en el punt d'editar un element i recarregues la pàgina, veuràs que tant el `loader` de la ruta `id` com els de `expenses` es carregaran i ho faran de manera paral·lela (un és pare de l'altre).

> **Així doncs: Tots els `loaders` aniuats (nested) que estiguin implicats en una ruta es carreguen de manera paral·lela**

No has pensat quelcom? Si carreguem totes les despeses, podem saber ja a través d'aquesta crida, quina és la que hauríem de carregar individualment per l'edició oi?

En un escenari així, podríem estalviar-nos aquest segon `loader` que hem posat a la ruta `/expenses/:id` i fer servir les dades que ja tenim carregades a la pàgina.

### Refactoritzant el codi

Anem a comentar el nostre segon `loader` així com l'import de `getExpense` de la ruta `/expenses/:id` i a fer servir les dades que ja tenim carregades a la pàgina.

Ara el `useLoaderData()` que es troba a `ExpenseForm` retornarà `undefined` perquè la ruta `/expenses/:id` ja no en té.

La ruta pare `expenses` sí que n'hi ha un, però `useLoaderData()` et dona accés al `loader` més proper de la ruta que es troba activa que seria `/expenses/$id`.

#### UseMatches()

Per fer això que volem, hem de fer servir un nou hook que ens proporciona `react-router-dom` que és `useMatches()`. Aquest hook ens permet.

El hook `useMatches` de Remix retorna un array d'objectes que representen les rutes actives en la jerarquia actual de rutes de l'aplicació. Cada objecte conté informació sobre una ruta concreta, incloent-hi:

- L'id de la ruta: Un identificador únic basat en la ubicació del fitxer dins el sistema de rutes (`routes/<path>`).
- El pathname: La URL completa de la ruta.
- Les dades carregades (`data`): Les dades retornades pel loader associat a aquesta ruta.
- Altres detalls sobre la ruta: Com els seus paràmetres (`params`) i el seu estat dins la jerarquia.

Així doncs, podem fer servir `useMatches()` per obtenir les dades de la ruta `/expenses` i passar-les a `ExpenseForm`.

```jsx
// ExpenseForm.tsx
import { useMatches } from "react-router-dom";
// ...
  // Necessitaré el paràmetre id per recuperar les dades de la despesa que vull editar
  const params = useParams();
  console.log(params);

  // En el cas de l'edició de despeses, fem servir les dades que ens venen del loader cridat a través de /$id:
  //const expenseData: Expense = useLoaderData();

  // Ara recuperem les dades des el `loader` d'expenses, que ja no és el pare.
  const matches = useMatches();
  // Nosaltres necessitem les dades de la ruta 'routes/_app/expenses/`
  const matchedRou  te = matches.find(
    (match) => match.id === "routes/_app.expenses",
  );
  console.log(matchedRoute);

  // Suposem que sempre hi haurà dades. Si no n'hi ha, posem valors per defecte.
  const expenseData = (matchedRoute?.data as Expense[])?.find(
    ({ id }) => id == params.id,
  ) || {
    title: "",
    amount: 0,
    date: today,
  };
  //...
```
### Expliquem el codi: 

#### **1. Recuperem el `params.id`**
```typescript
const params = useParams();
console.log(params);
```
- Utilitzo `useParams` per obtenir l'`id` de la URL actual (per exemple, `/expenses/1` → `{ id: "1" }`).
- Necessitem aquest `id` per identificar quina despesa volem editar.

---

#### **2. Accedim al `loader` de la ruta parent**
```typescript
const matches = useMatches();
const matchedRoute = matches.find(
  (match) => match.id === "routes/_app.expenses"
);
console.log(matchedRoute);
```
- `useMatches` retorna un array amb informació de totes les rutes actives i els seus `loaders`.
- Busco dins d'aquest array la ruta `routes/_app.expenses`, que conté totes les despeses carregades pel `loader` d'aquesta ruta.
- `matchedRoute` serà l'objecte associat a aquesta ruta.

---

#### **3. Recuperem la despesa que volem editar**
```typescript
const expenseData = (matchedRoute?.data as Expense[])?.find(
  ({ id }) => id == params.id
) || {
  title: "",
  amount: 0,
  date: today,
};
```
- `matchedRoute?.data` conté totes les despeses carregades al `loader` de `/expenses`.
- Amb `.find`, busco la despesa que té el mateix `id` que el paràmetre de la URL (`params.id`).
- Si no trobo cap despesa, assigno valors per defecte (`title: "", amount: 0, date: today`).

---
