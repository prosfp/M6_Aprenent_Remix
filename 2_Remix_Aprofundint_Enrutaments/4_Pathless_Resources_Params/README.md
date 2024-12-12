## Pathless Layout Routes (Rutes de Layout sense camí a la URL)

Anem a fer un exemple per veure com funcionaria una ruta de layout sense camí a la URL. Suposem que volem que les pàgines de `pricing` i `index` tinguin el mateix layout. En aquest cas, a mode d'exemple, suposem que volem fer ús de CSS per a definir els estils. Dins la carpeta `styles` ja veuràs que hi han alguns arxius CSS amb els estils que s'utilitzen en el projecte original.

1. Primer hem de crear una ruta de layout no visible a la URL. Recordeu que això ho podem fer posant guió baix davant del nom de l'arxiu. Ens fem una genèrica per les pàgines estàtiques anomenada `_marketing.tsx`.

    ```tsx
      // app/routes/_marketing.tsx
    import { Outlet } from "@remix-run/react";

    import marketingStyles from "../styles/marketing.css?url";
    import sharedStyles from "../styles/shared.css?url";

    export default function MarketingLayout() {
      return <Outlet />;
    }

    export function links() {
      return [
        { rel: "stylesheet", href: marketingStyles },
        {
          rel: "stylesheet",
          href: sharedStyles,
        },
      ];
    }
    ```

2. Hem de reanomenar els fitxers `_index.tsx` i `pricing.tsx` perquè continguin el mateix nom que la ruta de layout.
  * `_index.tsx` -> `_marketing._index.tsx`
  * `pricing.tsx` -> `_marketing.pricing.tsx`

3. Ara ja s'haurien d'estar aplicant els estils que hem afegit a través del layout `_marketing.tsx`. Ara bé, hi ha una sèrie d'estils genèrics (colors globals, tipografies...) que s'estan aplicant a través del layout `root.tsx`. Per acabar de veure correctament aquestes dues pàgines, haurem d'afegir els estils `shared.css` també al layout de `_marketing.tsx` o al `root.tsx`.

**Nota: Importació de fitxers CSS a Remix**

Quan treballes amb Remix i necessites importar fitxers CSS per incloure'ls al teu export links, és important utilitzar el sufix `?url`. Això assegura que el fitxer CSS sigui gestionat com una URL final després del procés de compilació.

**Per què necessitem `?url`?**

- **Gestió correcta dels fitxers estàtics:** Remix, juntament amb el sistema de compilació (com Vite o esbuild), podria tractar un fitxer CSS com un mòdul JavaScript/TypeScript si no utilitzes `?url`.
- **Evitar errors de rutes:** Amb `?url`, Remix sap que el fitxer ha de ser interpretat com un recurs URL i, per tant, el gestiona correctament, evitant errors del tipus "No route matches URL".
- **Sense necessitat de moure fitxers:** No cal desar els fitxers CSS a la carpeta `public/` perquè Remix els serveixi correctament.

## Expenses header

Anem a veure com més fer ús d'aquests "pathless layouts". Més endavant veurem que per accedir a la part de `expenses` necessitarem autenticació i que per tant ens interessarà tenir un navegador específic un cop l'usuari s'hagi autenticat. Per això, crearem un layout específic per a la part de `expenses`. 

Anem a crear un nou component sota **navigation** anomenat `ExpensesHeader.tsx`:

```tsx
// app/components/navigation/ExpensesHeader.tsx
import { NavLink } from "@remix-run/react";
import Logo from "../util/Logo";
import { FC } from "react";

const ExpensesHeader: FC = () => {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Logo />
      </div>

      {/* Main Navigation */}
      <nav className="flex space-x-4">
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/expenses"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Manage Expenses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/expenses/analysis"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Analyze Expenses
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Call to Action Navigation */}
      <nav id="cta-nav">
        <button className="rounded-lg bg-white px-4 py-2 text-blue-600 shadow-md transition-all duration-300 hover:bg-blue-100">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default ExpensesHeader;

```
Veus que hi ha alguns enllaços que ens permetran navegar per la part de `expenses`. Aquest serà diferent del header que farem servir per la part de `_marketing`.

Anem a resituar ara els headers que farem servir en cada cas. 

En el cas de `_marketing` afegirem el component `MainHeader`. Modifica-ho:

```tsx
...
export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}
...
```
I anem a crear una nova lògica general per la resta de l'app de cara a organitzar millor la part privada en cas que l'aplicació hagués de crèixer.

Ens generarem un layout `_app.tsx` on situarem les nostres `expenses` de moment. 

```tsx
// app/routes/_app.tsx
import { Outlet } from "@remix-run/react";
import ExpensesHeader from "../components/navigation/ExpensesHeader";

export default function ExpensesAppLayout(): JSX.Element {
  return (
    <>
      <ExpensesHeader />
      <Outlet />
    </>
  );
}
```

I ara modifiquem les nostres rutes d'`expenses` perquè facin servir aquest layout:

  - `_app.expenses.tsx`
  - `_app.expenses._index.tsx`
  - `_app.expenses.analysis.tsx`
  - `_app.expenses.add.tsx`
  - `_app.expenses.$id.tsx`

Alguns detalls prou importants que ens quedaran:

- Eliminar el `<MainHeader>` del nostre `root` layout, ja que ara no serà un de genèric per tota la nostra web/aplicació. 
- Eliminar l'accés a `Expenses` des del `Main Header`. 
- Afegir potser també la ruta `Auth` com a part del layout de `_marketing` ja que ens pot anar bé continuar veient el navbar.

## Ruta de Recursos (Resource routes)

Fins ara hem treballat amb rutes que carreguen vistes, informació que és visible. Ara bé, podem també fer servir les rutes per carregar certs recursos, dades, algun arxiu... Això és el que anomenem rutes de recursos. 

Anem a veure com funcionen. Generem un arxiu `expenses.raw.tsx` a la carpeta `app/routes`. Enlloc d'exportar una funció que acaba retornant codi visible a través de codi JSX, en aquest cas el que tenim és una una funció `loader()`. Recordem que els loaders s'exectuen quan la ruta és cridada i per tant es fa un `GET` a la URL corresponent. Així doncs, si tenim una ruta `expenses.raw.tsx`, cada cop que visitem `/expenses.raw` es cridarà aquesta funció `loader()` definida.

Agafa les **DUMMY_EXPENSES** que tenim a l'arxiu `expenses.tsx` i trasllada-les a aquest nou arxiu:

```tsx
// app/routes/expenses.raw.tsx
interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

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

export async function loader(): Promise<{ expenses: Expense[] }> {
  return { expenses: DUMMY_EXPENSES };
}
```

Visita ara la URL `/expenses.raw` i veuràs que es carreguen les despeses que hem definit a l'arxiu `expenses.raw.tsx` en format JSON.


## Splat Routes - Rutes amb paràmetres variables, però sense un id o valor concret al darrera. 

Ja quasi ho tenim amb tots els tipus de rutes que pot gestionar Remix. Anem a veure aquesta opció. 

Les Splat Routes són una funcionalitat de Remix que permet capturar qualsevol segment addicional d'una URL després d'una ruta base. S'utilitzen per manejar rutes dinàmiques que poden tenir múltiples subrutes de longitud variable o quan necessites capturar una part arbitrària d'una URL.

### Sintaxi

A Remix, pots definir una splat route utilitzant un `$` al final del nom de la ruta. Per exemple:

Un arxiu de ruta anomenat `files.$.tsx` capturarà qualsevol segment de la ruta que segueixi la paraula "files".

### Exemple d'ús

Suposem que tens un lloc web per mostrar fitxers en diferents carpetes, com:

```
/files/documents/reports/2024
/files/images/vacations
/files/videos/tutorials/remix-basics
```

Pots utilitzar una splat route per capturar tot el segment després de `/files`:

```tsx
// app/routes/files.$*.tsx
import { useParams } from "@remix-run/react";

export default function FileViewer() {
  const params = useParams();
  const splat = params["*"]; // Captura tot el que hi ha després de "/files/"

  return (
    <div>
      <h1>File Viewer</h1>
      <p>Path: {splat}</p>
    </div>
  );
}
```

Si visites `/files/documents/reports/2024`, el valor de `splat` serà:

```
documents/reports/2024
```

### Casos pràctics

- **Gestió de rutes jeràrquiques:** Les splat routes són útils quan treballes amb estructures jeràrquiques, com sistemes de fitxers, jerarquies de categories, o rutes d'API.
- **Captura de rutes desconegudes:** Si tens un patró de rutes on algunes parts són dinàmiques o no conegudes en temps de desenvolupament.
- **Redireccions dinàmiques:** Quan necessites redirigir o manipular qualsevol ruta dins d'un conjunt predefinit.

### Anem a fer una prova

Crea una nova ruta `$.tsx` a la carpeta `app/routes`. Aquesta ruta capturarà qualsevol segment de la URL que no hagi estat capturat per cap altra ruta. 

```tsx
// app/routes/$.tsx
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ params }: LoaderFunctionArgs) {
  console.log(params);
  if (params["*"] === "exp") {
    return redirect("/expenses");
  }

  throw Response.json("Not found", { status: 404 });
}
```
En aquest cas si visites qualssevol URL veuràs tant el `console.log` que és genera al "servidor" (consola de Vite) com que es retorna un error 404 (tot i que nosaltres encara no estem gestionant els ErrorBoundaries)


## Resum dels tipus de ruta 
| **Tipus de Ruta**         | **Arxiu**                            | **Ruta Generada**                     | **Descripció**                                                                                                                                       |
|----------------------------|---------------------------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Basic Routes**           | `news.jsx`                           | `/news`                                | Ruta bàsica que apunta directament a l'arxiu.                                                                                                        |
| **Nested Routes with Folders** | `news/create.jsx` (dins `news/`)    | `/news/create`                         | Ruta que reflecteix l'estructura de carpetes per a rutes niades.                                                                                     |
| **Nested Routes with Dot Delimiters** | `news.create.jsx`                   | `/news/create`                         | Ruta niada utilitzant punts (.) per evitar crear carpetes.                                                                                           |
| **Dynamic Routes**         | `news/$id.jsx` o `news.$id.jsx`      | `/news/abc`                            | Ruta dinàmica on `abc` és un paràmetre que es pot accedir com a `params.id`.                                                                         |
| **Splat Routes**           | `news/$`                             | `/news/match/any/path`                 | Ruta que coincideix amb qualsevol subruta a partir de `/news`.                                                                                       |
| **Layout Routes**          | `news.jsx` (layout) i `news/create.jsx` | `/news/create`                         | Ruta amb elements compartits d'un layout que s'aplica a les subrutes.                                                                                |
| **Pathless Routes**        | `__news/create.jsx` i `__news.jsx`   | `/create`                              | Layout sense camí associat. El layout no afegeix cap part de ruta visible però encara pot contenir components compartits per les subrutes.           |


# Una darrera coseta: Query Params

Anem a posar el cas de la pàgina de login. Volem que aquesta em permeti bé fer login o signup i no té massa sentit que haguem de fer dues rutes diferents per a això.

* Signup: Crear un nou usuari
* Login: Autenticar un usuari existent

Una opció seria fer servir un estàndar de React com `useState` per controlar quin mode estem. 

Ara bé, anem a veure com fer això amb Query Params.

Suposem que podem tenir paràmetres diferents en el cas de la ruta `auth`:

- `/auth?mode=login`
- `/auth?mode=signup`

En funció dels params, haurem de canviar el que es mostra en el nostre component original. Com ho fem? 

1. A `AuthForm`importem el hook-comonent `Link` de Remix.
2. A la part del butó de login, afegim un `Link` de la següent manera:
  
  ```tsx
  <Link to="?mode=login" className="mt-3 block text-indigo-600">
          Log in with existing user
  </Link>
  ```
3. Clar, però necessitem que això canviï de manera dinàmica en funció de si ens trobem en mode `login` o `signup`. Per això, a `AuthForm` afegim un `useSearchParams` per capturar els paràmetres de la URL:

  ```tsx
  // app/components/auth/AuthForm.tsx
import { Link, useSearchParams } from "@remix-run/react";
import { FaLock } from "react-icons/fa";

function AuthForm() {
  // useSearchParams em retorna un array amb el primer element com a objecte amb
  // els paràmetres de cerca. El segon no el necessito ja que seria per a
  // manipular els paràmetres de cerca.
  const [searchParams] = useSearchParams();
  // Si no hi ha paràmetre "mode" al query, per defecte serà login.
  const authMode = searchParams.get("mode") || "login";

  // Ens fem un ternari per a canviar el text del botó i el link
  const submitBtnCaption = authMode === "login" ? "Login" : "Create User";
  // Ens fem un ternari per a canviar el text del link
  const toggleBtnCaption =
    authMode === "login" ? "Create a New User" : "Log in with existing user";

  return (
    <form
      method="post"
      className="mx-auto max-w-md rounded-lg bg-indigo-100 p-5 shadow-md"
      id="auth-form"
    >
      ...
      // resta de codi
      ...
      <div className="text-center">
        <button className="rounded bg-indigo-600 px-4 py-2 text-white">
          {submitBtnCaption}
        </button>
        <Link
        // També hem hagut de fer ús del ternari per canviar el link com a tal! 
          to={authMode === "login" ? "?mode=signup" : "?mode=login"}
          className="mt-3 block text-indigo-600"
        >
          {toggleBtnCaption}
        </Link>
      </div>
    </form>
  );
}
  ```

  4. Canviem finalmet únicamen la icona del nostre formulari per a que sigui més visual el canvi de mode. Afegim `FaUserPlus`de React Icons. També he aprofitat per donar alguns estils extra.

  ```tsx
  // app/components/auth/AuthForm.tsx
  import { FaLock, FaUserPlus } from "react-icons/fa";
  ...
  <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-200 text-2xl text-indigo-600">
          {authMode === "login" ? <FaLock /> : <FaUserPlus />}
        </div>
  </div>
  ...
  ```

5. Ja pots provar que efectivament podem fer "switch" entre cada mode de manera dinàmica.

## Extra abans de continuar

Modifica el layout d'expenses per afegir botons per afegir una nova despesa i per poder carregar les dades json:

```tsx
// app/routes/_app.expenses.tsx
...

import { Link, Outlet } from "@remix-run/react";
import ExpensesList from "../components/expenses/ExpensesList";
import { FaPlus } from "react-icons/fa";

import { Link, Outlet } from "@remix-run/react";
import ExpensesList from "../components/expenses/ExpensesList";
import { FaPlus, FaDownload } from "react-icons/fa";

export default function ExpensesLayout() {
  return (
    <>
      <Outlet />
      <main>
        <section className="my-4 flex justify-center">
          <Link
            to="add"
            className="flex items-center rounded bg-gray-100 p-2 text-blue-500 shadow-md hover:text-blue-700"
          >
            <FaPlus />
            <span className="ml-2">Add Expense</span>
          </Link>
          <a
            href="/expenses/raw"
            className="ml-4 flex items-center rounded bg-gray-100 p-2 text-blue-500 shadow-md hover:text-blue-700"
          >
            <FaDownload />
            <span className="ml-2">Load Raw Data</span>
          </a>
        </section>
        <ExpensesList expenses={DUMMY_EXPENSES} />
      </main>
    </>
  );
}
```
En el cas del **Load Raw Data** hem fet servir un `a` enlloc d'un `Link` ja que no volem que es renderitzi cap pàgina, sinó simplement que es retorni el JSON amb les despeses.