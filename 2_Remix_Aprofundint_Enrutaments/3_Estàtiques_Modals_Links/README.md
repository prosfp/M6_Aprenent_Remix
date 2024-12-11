## Estàtiques i Modals

En aquest projecte tindrem bàsicament dues pàgines estàtiques: la pàgina per defecte d'`índex` i `pricing`. Aquestes pàgines no tindran res "guai" de Remix ni farem cap fetch a dades per mostrar. 

Pots afegir-les tal qual les veus al teu projecte. Veuràs que han aparegut `_index.tsx` i `pricing.tsx`. De moment no tenen estils i potser en aquest cas farem ús dels estils CSS del projecte original, però de moment deixeu-es sense format.

## Extenent Layouts - Main Header

El "Main Header" volem que formi part de tot el nostre projecte. Seria poc convenient haver-lo d'afegir a tot arreu important-lo constantment. Això ho podem millorar: Anem a afegir-lo al nostre root layout. He afegit alguns nous estils de Tailwind al component `MainHeader.tsx`. Per tal d'integrar-lo al teu root layout:

```tsx
// app/root.tsx
...
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
        <MainHeader />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
...
```
## Modals

Anem a veure com fer ús dels modals en el cas de `id` i `add`. Ves a les dues rutes que hem creat abans i fes servir aquest model:

```tsx
// app/routes/add.tsx
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/util/Modal";

export default function ExpensesAddPage() {
  return (
    <Modal>
      <ExpenseForm />
    </Modal>
  );
}
```
També he canviat els estils del component `Modal` perquè funcioni com a tal i es mostri al centre de la pantalla amb la resta de la pàgina en background i enfosquida. 

```tsx
// app/components/util/Modal.tsx
import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <dialog
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        open
        onClick={(event) => event.stopPropagation()} // Per evitar tancar quan es fa clic al modal mateix
      >
        {children}
      </dialog>
    </div>
  );
};

export default Modal;
```

Veuràs que ESLint marca alguns errors d'accessibilitat. Pots consultar què hauries de fer per evitar-ho i mirar d'entendre el codi. Per exemple, tal i com està ara, no pots sortir de modal amb la tecla `ESC`.

Visualitza ara les dues pàgines i comprova que els modals funcionen correctament.

Això és bastant top perquè estem aplicant uun layout a través de `_expenses.tsx` que és aplicable a totes les subrutes (on ho desitgem) i per tant tenim informació compartida (la llista de despeses en aquest cas). I a l'hora, amb el contingut específic de cadascuna d'aquestes, podem també mostrar accions a fer sobre aquestes sense perdre el context global d'on ens trobem.


## Afegim Links

Anem a afegir alguns enllaços que de moment no els tenim habilitats. Ho farem amb el nostre component `Link` de Remix. Pots provar a afegir tu alguns d'aquests.

- El `Cancel` de l'`ExpenseForm` per exemple. Com faries que tornes a `/expenses` o, en general, la pàgina superior ja que tant serà vàlid per `add` com per `id`?	

Però hi ha algun potser una mica menys evident:

- Mira `ExpenseListItem`. Com ho faries per l'edit? Abans de res modifica aquest component perquè `ExpenseList` li passi també l'`id`de la despesa.

Ara l'objectiu és que `Edit` apunti a `/expenses/id`. Si no posem cap `/` a la nostra ruta, allò que posem s'afegirà a la ruta actual (ruta relativa) que és exactament el que volem. Per tant, si estem a `/expenses` i posem només l'`id`, anirem a `/expenses/id`. 

```tsx
// app/components/expenses/ExpenseListItem.tsx
...
  return (
    <div className="flex w-full items-center justify-between">
      {/* Informació de la despesa */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-lg">${amount.toFixed(2)}</p>
      </div>

      {/* Botons d'acció */}
      <div className="flex items-center space-x-4">
        <button
          onClick={deleteExpenseItemHandler}
          className="transform text-xl text-red-500 transition-transform hover:scale-125 hover:text-red-700"
        >
          <FaTrash />
        </button>
        <Link
          to={id}
          className="transform text-xl text-blue-500 transition-transform hover:scale-125 hover:text-blue-700"
        >
          <FaEdit />
        </Link>
      </div>
    </div>
  );
}
...
```
Hem fet alguns progressos a nivell de funcionalitat però ens falta també per fer que el `Modal` es tanqui quan fem click fora del modal també (no només `cancel`).

Això ho podem fer a través de `onClose` que passarem com a prop a `Modal` i que cridarem quan fem click fora del modal. 

```tsx
// app/routes/add.tsx
import { useNavigate } from "@remix-run/react";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/util/Modal";

export default function ExpensesAddPage() {
  const navigate = useNavigate();

  function closeHandler() {
    // No volem navegar amb Link en aquest cas ("navigate programmatically")No fem servir Link perquè 
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}
```
El motiu pel qual no utilitzem `<Link>` per tornar a la pàgina principal quan fem servir el Modal és perquè el comportament desitjat aquí és una navegació programàtica basada en esdeveniments o accions d'interacció de l'usuari, en lloc d'una navegació enllaçada directa.

**Navegació programàtica amb `useNavigate`:**

- Quan l'usuari tanca el modal, no necessàriament està fent clic a un enllaç (com seria el cas amb `<Link>`).
- `useNavigate` ens permet gestionar programàticament la navegació des de qualsevol punt del codi, com a resposta a esdeveniments (p. ex., clic a "X" o botó de tancar).
- Això permet tornar a la pàgina anterior (amb "..") o navegar a qualsevol ruta desitjada sense requerir un component visual com `<Link>`.

```tsx
function closeHandler() {
  navigate(".."); // Torna un nivell enrere
}
```

**Quan usar `<Link>`:**

- `<Link>` és ideal quan la navegació forma part de l'estructura visual de la pàgina, com un botó o un enllaç que l'usuari veu i interactua directament.
- Exemple: en un menú de navegació o en un llistat d'elements.


## NavLink

Ens faltaria modificar el nostre component de navegació. En aquest cas farem servir `NavLink` perquè ens permetrà afegir una classe específica quan la ruta actual coincideixi amb la ruta de l'enllaç. Això ens permetrà, per exemple, canviar el color de fons de l'enllaç de la pàgina actual.

```tsx
const MainHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Logo />
      </div>

      {/* Navegació principal */}
      <nav id="main-nav" className="flex space-x-4">
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Expenses
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Call to Action Navegació */}
      <nav id="cta-nav">
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              to="/auth"
              className="rounded-lg bg-white px-4 py-2 text-blue-600 shadow-md transition-all duration-300 hover:bg-blue-100"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
```