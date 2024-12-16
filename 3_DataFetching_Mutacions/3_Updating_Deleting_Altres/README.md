
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

## UPDATE Expense

Per actualitzar una **Expense** necessitem passar-li l'id i la informació de les dades que volem actualitzar. 

Així doncs, podem començar actualitzant `expenses.server.ts` amb una nova funció `updateExpense` que rebrà l'id de la despesa i les dades que volem actualitzar.

```typescript
// UPDATE Expense
export async function updateExpense(
  id: string,
  expenseData: Expense,
): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .update({
      title: expenseData.title,
      amount: expenseData.amount,
      date: new Date(expenseData.date).toISOString(),
    })
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense.");
  }

  return data as Expense; // Garantim que `data` és del tipus `Expense`
}
```
Vale, però la veritable pregunta és on cridem a aquesta funció? 

Doncs ho volem fer quan és faci un "save", és a dir un "submit" del formulari trobant-nos en el mode d'edició. Això ho sabrem perquè ens trobarem a `$id.tsx`. 

Per tant si implementem un `Action` en aquesta ruta, qualssevol submit que es doni passarà per aquest action. Fem-ho doncs! 

Abans però, per insistir i aclarir... quins paràmetres necessitarem, dels que podem passar a l'action?

- `request`: Conté la informació de la petició HTTP, per poder accedir al valor dels camps del formulari.
- `params`: Conté els paràmetres de la URL, per poder accedir a l'id de la despesa que volem actualitzar.	

```typescript
// $id.tsx
// ...  

export async function action({ request, params }: LoaderFunctionArgs) {
  const expenseID = params.id as string;
  const formData = await request.formData();

  const expenseData = {
    title: formData.get("title") as string, // hauria de ser un string sempre i ens evita error TS
    amount: parseFloat(formData.get("amount") as string), // Converteix a número
    date: new Date(formData.get("date") as string), // Converteix a Data
  };

  try {
    // Validem les dades abans de fer la mutació
    validateExpenseInput(expenseData);
  } catch (error) {
    // En aquest cas ens volem assegurar que l'usuari vegi els errors que han provocat aquest error de validació
    return error;
  }

  console.log(expenseData);

  await updateExpense(expenseID, expenseData);
  redirect("/expenses");
}
```
La funció és molt similar a la que vam implementar a `add.tsx`, però en aquest cas passem les dades que farem servir per actualitzar.

Pots comprovar que efectivament tot s'actualitza correctament, les validacions s'apliquen, la base de dades modifica la despesa també.

### DELETE Expense

Ara per ara el nostre botó de "borrar" no fa absolutament res. Anem a començar per modificar aquesta part.

Recordes on està definit? Hem d'anar a `ExpenseListItem.tsx`.

Fixa't que ara per ara tenim únicament un botó que crida a un **handler** `deleteExpenseItemHandler()` que no fa res.

```typescript
// ExpenseListItem.tsx
//...
  <button
          onClick={deleteExpenseItemHandler}
          className="transform text-xl text-red-500 transition-transform hover:scale-125 hover:text-red-700"
  >
          <FaTrash />
  </button>
//...

```
Per fer que aquest botó faci una petició, un "request", haurem de convertir-lo en un `form`. Si fem servir `<form></form>` amb *html* aquest només permet posar els mètodes `GET` i `POST`.

Aquí necessitem però fer servir un mètode `DELETE`. Per això, farem servir un `Form` de React o Remix, que ens permetrà fer servir qualsevol mètode.

```typescript
// ExpenseListItem.tsx
//...
      <Form method="delete">
          <button
            onClick={deleteExpenseItemHandler}
            className="transform text-xl text-red-500 transition-transform hover:scale-125 hover:text-red-700"
          >
            <FaTrash />
          </button>
      </Form>
//...
```
I on anirà aquest request? Pensa-ho bé... 

* On es troba aquest component? Doncs forma part de `ExpenseList`. 
* I on es troba `ExpenseList`? Doncs l'injectem a `Expense` aixi que:
* Tècnicament hauríem d'implementar aquí el nostre `Action`!
* Però no seria més pràctic enviar-ho a la ruta `id` i allà gestionar-ho?

Com ho fem això? 

```typescript
// ExpenseListItem.tsx
        <Form method="delete" action={`/expenses/${id}`}>
//...
```
Amb això, quan fem click al botó de borrar, ens redirigirà a la ruta `/expenses/$id` amb el mètode `DELETE`.

I, oh sorpresa, aqui ja tenim un `Action` per gestionar l'edició de la despesa. 

Com podem gestionar dues peticions en un sol `Action`?

Abans de res, torna a fer un cop d'ull a `ExpenseForm`. Ara per ara el mètode que hi ha posat hardcoded és "post". Això no és del tot correcte. 

el `Form` en realitat hauria de contemplar: 
 - Si tenim `expenseData` (estem editant) el mètode hauria de ser `PATCH`.
 - Si no tenim `expenseData` (estem afegint) el mètode hauria de ser `POST`. 

Modifiquem això doncs:

```typescript
// ExpenseForm.tsx
// ...
      method={expenseData ? "patch" : "post"}
//...
```
Això farà que ara s'enviï un `Patch` quan editi. 

### Gestionant dues peticions en un sol Action

Ara podem afegir una gestió condicional a l'`Action` de la nostra ruta `id` per gestionar tant l'actualització com l'eliminació de la despesa.

```typescript
export async function action({ request, params }: LoaderFunctionArgs) {
  const expenseID = params.id as string;
  // Compte! DELETE ha de ser en majúscula si no fallarà!
  request.method === "DELETE";

  if (request.method === "PATCH") {
    // Vull editar la despesa
    const formData = await request.formData();

    const expenseData = {
      title: formData.get("title") as string, // hauria de ser un string sempre i ens evita error TS
      amount: parseFloat(formData.get("amount") as string), // Converteix a número
      date: new Date(formData.get("date") as string), // Converteix a Data
    };

    try {
      // Validem les dades abans de fer la mutació
      validateExpenseInput(expenseData);
    } catch (error) {
      // En aquest cas ens volem assegurar que l'usuari vegi els errors que han provocat aquest error de validació
      return error;
    }

    console.log(expenseData);

    await updateExpense(expenseID, expenseData);
    return redirect("/expenses");
  } else if (request.method === "DELETE") {
    // Aquí no vull modificar res, només eliminar
  }
}
```
Hauré d'implementar la funció a `expenses.server.ts` per eliminar una despesa.

```typescript
// DELETE Expense
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense.");
  }
}
```


