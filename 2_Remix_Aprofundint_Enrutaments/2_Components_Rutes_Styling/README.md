## Projecte Marketing 

Comencem afegint el nostre component `AuthForm` al nostre route `auth`. Com ho faries per injectar el component? 

Efectivament, simplement has d'importar el component `AuthForm` i afegir-lo al nostre route `auth`:

```javascript
import AuthForm from "../components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="container mx-auto p-4">
      <AuthForm />
    </div>
  );
}
```

Anem també a veure alguns components relacionants amb les despeses, és a dir `expenses`. La idea és que no haguem de dedicar massa temps a crear components i que els puguis utilitzar com a base pel teu projecte. També pots mirar de fer servir llibreries que ja et proporcionin components com `Material-UI` o `Flowbite` (https://flowbite.com/docs/getting-started/remix/). 


La ruta `expenses.analysis` ens permetrà representar alguns gràfics sobre les nostres despeses.

```javascript
import Chart from "../components/expenses/Chart";
import ExpenseStatistics from "../components/expenses/ExpenseStatistics";

export default function ExpensesAnalysisPage() {
  return (
    <main>
      <Chart />
      <ExpenseStatistics />
    </main>
  );
}
```

Si poses únicament això, veuràs que TS ja es queixa de que aquests components requereixen d'algunes propietats en forma de dades que els hi hem de passar per funcionar. Anem a fer servir una "dummy data" per aquest exemple:

```javascript
// /expenses.analysis.tsx

const DUMMY_EXPENSES = [
  {
    id: 'e1',
    title: 'First Expense',
    amount: 12.99,
    date: new Date().toISOString(),
  },
  {
    id: 'e2',
    title: 'Second Expense',
    amount: 16.99,
    date: new Date().toISOString(),
  },
];

export function loader() {
  return DUMMY_EXPENSES;
}
```

Això de moment no funcionarà tal i com ho tenim ara. El codi original depenia totalment en el disseny amb CSS. T'animo a tractar de mostrar les dades en un diagrama de barres fent servir el `chart` de `Flowbite` (https://flowbite.com/docs/plugins/charts/). 

Seguim. Afegeix ara el component `ExpenseForm` a la ruta `expenses.add`. Ja no et mostro el codi. Afegeix-lo tu mateix. Tantmateix, aquest form també el farem servir en el cas de `expenses.$id` per editar les despeses així que també el pots afegir. 


### Llistat de Despeses. On el posem? 

Ara que ja tenim el formulari per afegir despeses, també ens caldrà un llistat de despeses. Aquí podem tenir el dubte de si situar-ho a la ruta `expenses` o a la ruta `expenses._index`. La diferència és que si ho posem a `expenses` el llistat de despeses es mostrarà a totes les nostres subrutes o rutes filles d'`expenses` (add, id...). Si ho posem a `expenses._index` únicament hi hauria una pàgina amb el llistat. 

En el meu cas m'interessa mantenir-ho a `expenses.tsx` perquè faré servir un `modal` per editar les despeses de manera que no necessitaré una pàgina específica per aquesta tasca i ja em va bé que el llistat es mostri a totes les subrutes. Quan afegeixi una nova despesa, tot veient el llistat de les ja existents, el modal s'obrirà amb les dades de la despesa a editar o afegir sense sortir de la pàgina.  També farem servir les dades de `DUMMY_EXPENSES` per aquest exemple. 

```javascript
// /expenses -> Shared Layout

const DUMMY_EXPENSES = [
  {
    id: "e1",
    title: "First Expense",
    amount: 12.99,
    date: new Date().toISOString(),
  },
  {
    id: "e2",
    title: "Second Expense",
    amount: 16.99,
    date: new Date().toISOString(),
  },
];

import { Outlet } from "@remix-run/react";
import ExpensesList from "../components/expenses/ExpensesList";

export default function ExpensesLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-indigo-900">
      <header className="bg-indigo-700 p-4 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Expenses Dashboard</h1>
      </header>
      <>
        <Outlet />
        <main>
          <ExpensesList expenses={DUMMY_EXPENSES} />
        </main>
      </>
    </div>
  );
}
```
Si visites `/expenses` veuràs el llistat de despeses. Si visites `/expenses.add` per exemple, també hi serà. Encara és estrany perquè no hem fet servir cap `modal` per editar les despeses i per tant els continguts "modals" apareixen a sobre del llistat.

Hi ha potser alguna ruta que pot ser és estrany que afegeixi el llistat de despeses. Per exemple, la ruta `expenses.analysis`. 

En el cas de la V2 de Remix això ho podem solucionar fent servir el **sufix** `expenses_.analysis.tsx`. Amb això indiquem que no volem que hereti el layout de `expenses.tsx`. 

Pot ser un bon moment per acabar de "netejar" el teu return a `expenses.tsx`:

```javascript
// /expenses.tsx
export default function ExpensesLayout() {
  return (
    <>
      <Outlet />
      <main>
        <ExpensesList expenses={DUMMY_EXPENSES} />
      </main>
    </>
  );
}
```
i endur-te els teus estils genèrics al `root.tsx`:

```javascript
// /root.tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-gradient-to-r from-indigo-500 to-indigo-900">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

