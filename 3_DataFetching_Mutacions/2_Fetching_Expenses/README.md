## Feedback quan enviem les dades

Abans de posar-nos amb la part de `Loader` anem a veure com millorar un comportament que tenim ara mateix. Un cop ha funcionat la crida a l'API i que hem guardat les dades a la nostra base de dades, hauríem de donar algun retorn, algun feedback a l'usuari que ha fet la crida.

Per fer-ho comencem canviant el `form` d'html pel `Form`de Remix. Recora que amb aquest `Form` ens quedem en el mateix component i no fem un refresh de la pàgina (Single Page) i la lògica es processa en el rerefons. 

El `Form` ens permetrà entre d'altres coses, donar feedback mentre la crida i càrrega de dades a l'API té lloc. Per fer-ho necessitem el hook `useNavigation` de Remix. Aquest hook ens permetrà navegar a una altra ruta de la nostra aplicació.

Com ja vam veure, aquest conté informació com l'estat de la crida. Això ho podem aprofitar per mostrar donar a l'usuari una millor experiència d'usuari:

```tsx
// ExpensesForm.tsx
//...
const ExpenseForm: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10

  // Hem d'assegurar a TS que validationErrors és un objecte amb claus string i valors string
  const validationErrors = useActionData<ValidationErrors>();

  const navigation = useNavigation();
  // si no està en estat idle, vol dir que està enviant dades
  const isSubmitting = navigation.state !== "idle";
  //...
    <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isSubmitting ? "Saving..." : "Submit"}
    </button>
  //...
}
```


# Fetching Expenses - Loader

Recordeu que fins ara estem fent servir unes dades de prova i que les carreguem directament des de `_app.expenses.tsx`.

```tsx
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
```

Això sabem que ho hauríem de fer amb el `loader` de Remix. Recorda que Remix li passarà algunes dades al loader com ara `request` (amb alguns detalls sobre la petició) o `params` (si volem paràmetres de l'url). Però no és cap dels cassos en aquest cas.

Aquí el que necessitem és simplement recuperar i carregar les dades que ens retorna l'API. Per fer-ho, el primer que necessitem és implementar la funció de `get` al nostre `expenses.server.ts`. Recorda que estem treballant amb `supaBase` i que el client ens facilita una mica la vida:

```tsx
// expenses.server.ts
//...
// GET Expenses
export async function getExpenses(): Promise<Expense[]> {
  try {
    const expenses = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    return expenses;
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw new Error("Failed to get expenses.");
  }
}
```
Ara al loader hauré d'importar aquesta funció i cridar-la des del `loader`:

```tsx
export async function loader() {
  return getExpenses();
}
```
I ara farem servir `useLoaderData` per recuperar les dades al nostre component. Recorda novament, que no necessàriament s'ha de fer ús a la ruta on es troba el `loader`, tot i que en aquest cas sí serà així. 

Dins de la funció ExpensesLayout() farem servir `useLoaderData` per recuperar les dades:

```tsx
  const expenses = useLoaderData(); 









