
## Abans de la lògica d'autentitació

Recordaràs que havíem implementat una lògica visual diferent en el cas de l'`AuthForm.tsx`. Podíem triar entre l'opció de `login`o `signup`. 

És hora de canviar aquest formulari (fins ara `<form>`) a la lògica de Remix amb `<Form>`. Comença modificant això únicament i anem a gestionar l'`Action`.  

Recorda que aquest component el vam injectar a `_marketing.auth.tsx`. Així que allà implementem la nostra lògica. 

```tsx
//_marketing.auth.tsx
//...
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validacions

  // Gestió amb les dades

  if (authMode === "login") {
    // Autenticació (login)
  } else {
    // Creació d'usuari (signup)
  }

  return {};
}
```
L'ús de **`new URL(request.url)`** en aquest cas serveix per **accedir als paràmetres de la query string** (els que venen després del `?` a l'URL) de manera fàcil i segura.

---

### **Explicació de `new URL(request.url)`**

1. **`request.url`**:
   - Remix proporciona l'objecte `request` dins l'`action` o `loader`.
   - La propietat `request.url` conté l'URL complet de la petició, incloent la part de la query string (`?mode=signup`).

   **Exemple**:
   Si la petició és a:
   ```
   http://localhost:3000/auth?mode=signup
   ```
   L'objecte `request.url` conté:
   ```text
   "http://localhost:3000/auth?mode=signup"
   ```

2. **`new URL(request.url)`**:
   - **`new URL`** és una API integrada a JavaScript que parseja l'URL i el descompon en les seves parts: `hostname`, `pathname`, `searchParams`, etc.
   - Això ens permet treballar amb l'URL d'una manera més senzilla i estructurada.

3. **`searchParams`**:
   - La propietat `searchParams` de l'objecte URL és una instància de `URLSearchParams` que permet accedir als paràmetres de la query string.
   - **Mètode `get`**: Recupera el valor d'un paràmetre específic (per exemple, `mode`).

---

### Retornant feedback a l'usuari

Anem a afegir el feedback a l'usuari que no tenim encara durant l'autenticació. 

Com ja vam fer en el cas d'una nova `Expense`, implementem un `isSubmitting` per controlar l'estat de la petició. 

Fes-ho tu mateix, incorpora l'ús de `useNavigation` per tal de canviar el teu botó de `submit` a un missatge de `Submitting` mentre es processa la petició.

Pots revisar-ho al codi si no te'n surts. 

Pensa que encara no hi haurà res funcional ja que no hem implementat cap `Action` que ho gestioni!!!

# Gestió d'Errors

Abans de posar-nos amb la validació estrictament, anem a veure com realitzem la gestió d'errors. 

Recorda que amb la V2 de Remix, ja no és fa la distinció entre `CatchBoundary` (pensada per la gestió d'errors controlats i/o específics com les peticions a una API, és a dir HTTP) i `ErrorBoundary` (errors no controlats com excepcions als components de React-Remix).

Amb Remix v2, per simplicitat `ErrorBoundary` és l'encarregat de gestionar qualssevol tipus d'error. 

Més endavant veurem amb més detall algun aspecte sobre la gestió d'errors. Però de moment anem a modificar el nostre `root` perquè gestioni els erros. 


### Què hauríem d'afegir al nostre root?

```tsx
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { Link } from "react-router-dom";
import Document from "./Document"; // Component Document
import Error from "./Error"; // Component Error

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "An error occurred";
  let message = "Something went wrong. Please try again later.";

  // Si l'error és una resposta HTTP controlada
  if (isRouteErrorResponse(error)) {
    title = error.statusText;
    message = error.data?.message || message;
  } 
  // Si és un error inesperat
  else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Document title={title}>
      <main>
        <Error title={title}>
          <p>{message}</p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </Error>
      </main>
    </Document>
  );
}
```

---

### **Explicació del codi**

1. **`useRouteError`**:
   - Captura qualsevol tipus d'error que es produeixi al `loader`, `action` o als components React.

2. **`isRouteErrorResponse(error)`**:
   - Verifica si l'error és una **resposta controlada** (com `throw new Response()`).
   - En aquest cas, recupera `statusText` i el missatge de l'error (`error.data`).

3. **Errors inesperats**:
   - Si l'error és una excepció normal (`Error`), accedim a `error.message`.

4. **Missatges per defecte**:
   - Si no hi ha informació addicional, mostrem missatges genèrics.

5. **Un sol retorn**:
   - Ja no necessitem `CatchBoundary`. Amb aquesta sola `ErrorBoundary`, gestionem tots els casos.

---

### **En resum**

- **Errors controlats (com 404, 500):**  
   Mostra el `statusText` i el missatge proporcionat pel servidor.

- **Errors inesperats:**  
   Mostra un missatge d'error genèric o la descripció de l'excepció.

---

> **NOTA:** Hi ha algun error amb l'aplicació d'estils que ara mateix no permet que es vegi correctament la pàgina d'errors i que no he estat capaç de solucionar. S'aplica molt breument l'estil però després es queda sense estils i Tailwind.css s'està carregant corretament... a investigar!