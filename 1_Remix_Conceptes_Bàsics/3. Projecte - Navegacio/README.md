  ### **5 Cèntims sobre `<NavLink>` a Remix**

  1. **Què és `<NavLink>`?**  
    És un component de **React Router**, utilitzat a Remix per crear **enllaços dinàmics** que poden canviar el seu estil en funció de si la ruta és activa o pendent.

  2. **Diferència amb `<Link>`:**  
    A diferència de `<Link>`, `<NavLink>` permet detectar si l'enllaç és **actiu** (`isActive`) o **pendent** (`isPending`) i aplicar estils o classes automàticament.

  3. **Estilització dinàmica:**  
    Pots utilitzar la prop `className` o `style` per afegir estils personalitzats segons l'estat de l'enllaç:
    ```tsx
    <NavLink
      to="/admin"
      className={({ isActive }) => (isActive ? "text-blue-500" : "text-gray-500")}
    >
      Admin
    </NavLink>
    ```

  4. **Prop `end`:**  
    Si vols que l’enllaç només sigui actiu quan coincideixi exactament amb la ruta, afegeix `end`:
    ```tsx
    <NavLink to="/" end>Inici</NavLink>
    ```
    
    Per exemple si tens també la ruta `/contacte`, si no féssim servir `end`, l'enllaç "Inici" també seria actiu quan visites `/contacte` ja que és subruta de `/`.

    Per això si volem ser estricte i que només sigui actiu quan la ruta coincideix exactament, fem servir `end`.


  5. **Ús avançat amb Tailwind:**  
    Combina'l amb **Tailwind CSS** per afegir estils segons l'estat:
    ```tsx
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive ? "font-bold text-green-500" : "text-gray-500"
      }
    >
      Dashboard
    </NavLink>
    ```

  ---


  Aquí tens l'adaptació del codi perquè s'integri perfectament a l'estructura que has compartit.

  ---

  ### **1. Fitxer `MainNavigation.tsx` (Component de navegació)**
  Mantindrem el teu component dins de la carpeta `components/`. Pots fer servir aquest codi per al Navbar:

  ```tsx
  import { NavLink } from "@remix-run/react";

  export default function MainNavigation() {
    return (
      <nav className="bg-blue-500 text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "font-bold underline" : ""
              }
            >
              Inici
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/new-note"
              className={({ isActive }) =>
                isActive ? "font-bold underline" : ""
              }
            >
              Nova Nota
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
  ```

  ---

  ### **2. Fitxer `root.tsx`**
  Modifiquem el root perquè inclogui el `MainNavigation`. Aquí tens el codi adaptat:

  ```tsx
  import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
  } from "@remix-run/react";
  import type { LinksFunction } from "@remix-run/node";
  import MainNavigation from "./components/MainNavigation";

  // Importem Tailwind CSS
  import tailwindStylesheetUrl from "./tailwind.css";

  // Funció links per afegir estils globals
  export const links: LinksFunction = () => [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
  ];

  export default function App() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="bg-gray-100">
          {/* Navbar general */}
          <MainNavigation />

          {/* Contingut de cada ruta */}
          <Outlet />

          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
  ```

  ---

  ### **3. Nova Ruta: `routes/new-note.tsx`**
  Crea un fitxer per a la pàgina **"Nova Nota"** dins de `routes/`:

  ```tsx
  export default function NewNote() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Crea una nova nota</h1>
        <p>Aquí pots afegir una nova nota al sistema.</p>
      </div>
    );
  }
  ```

  ---

  ### **4. Estructura d'estils amb Tailwind**
  Ja tens el fitxer `tailwind.css`, per tant, assegura't que inclou les instruccions bàsiques de Tailwind:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

  Si vols personalitzar colors o altres configuracions, pots modificar el fitxer `tailwind.config.js`.

  ---

  ### **5. Estructura completa del projecte**

  ```
  app/
  ├── components/
  │   ├── MainNavigation.tsx  --> Navbar compartit
  │   ├── NewNote.tsx         --> Component (si es fa servir dins NewNote)
  ├── routes/
  │   ├── notes.tsx           --> Pàgina de notes
  |   ├── index.tsx           --> Ruta arrel
  ├── root.tsx                --> Arrel de l'aplicació
  ├── tailwind.css            --> Estils globals
  ├── entry.client.tsx        --> Entrada del client
  ├── entry.server.tsx        --> Entrada del servidor
  ```

  ---

  ### **Què passa ara?**

  1. Quan visites `/`, es mostrarà el `MainNavigation` i el contingut corresponent a la ruta arrel (`routes/index.tsx`, si existeix).
  2. Quan visites `/new-note`, el `MainNavigation` es mantindrà visible i es renderitzarà el contingut de `routes/new-note.tsx`.
  3. El Navbar ja no s'ha d'incloure manualment a cap ruta. Això ho gestiona el `root.tsx`.

