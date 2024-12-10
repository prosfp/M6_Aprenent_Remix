### Introducció a la gestió d'errors en l'obtenció de dades

Quan una aplicació intenta obtenir dades, ja sigui des d'una API, un fitxer o una base de dades, poden sorgir problemes que afectin el bon funcionament de la pàgina. Alguns exemples d'aquests problemes inclouen:

1. **Fitxers o recursos no trobats:** Si el fitxer que conté les dades no existeix.
2. **Errors de format:** Si les dades estan corruptes o no són vàlides (per exemple, JSON mal formatat).
3. **Problemes de permís o connexió:** Si el servidor no pot accedir a les dades per restriccions de seguretat o fallades de xarxa.
4. **Excepcions inesperades:** Com errors de codi que impedeixen la correcta lectura de les dades.

Per assegurar-nos que l'aplicació continua funcionant de manera controlada en aquests casos, és fonamental gestionar aquests errors adequadament.

### Gestió d'errors amb loaders a Remix

Els loaders a Remix són responsables de carregar dades abans que es renderitzi una pàgina. Quan un loader no pot obtenir les dades per qualsevol motiu, podem:

1. Retornar un error personalitzat al client amb `Response` i un codi d'estat HTTP adequat (`404`, `500`, etc.).
2. Detectar aquests errors al client i mostrar missatges informatius per a l'usuari.

Aquest enfocament permet manejar situacions inesperades sense que l'aplicació falli completament i proporciona una millor experiència d'usuari.

A continuació, implementarem gestió d'errors al loader per assegurar-nos que qualsevol problema en l'obtenció de dades es reflecteixi de manera clara i útil per als usuaris.

### **Què són els Error Boundaries a Remix?**

Els **Error Boundaries** són un mecanisme per gestionar errors a nivell de ruta o global en una aplicació Remix. Permeten capturar errors tant del **servidor** (en loaders o actions) com del **client** (durant el renderitzat de components React) i mostrar un missatge personalitzat en lloc de trencar l'aplicació.

---

### **Com funcionen?**

1. **Per ruta o global**: 
   - Pots definir un Error Boundary global al fitxer `root.tsx` o específic per a una ruta.
   - Si no n'hi ha un de definit, Remix utilitza el global.

2. **Captura errors del servidor**:
   - Errors en loaders o actions (p. ex., fallades d'API) són capturats i mostrats.

3. **React Error Boundaries**:
   - També captura errors durant el renderitzat o la lògica dels components React.

---

### **Exemple bàsic**

#### **Error Boundary per ruta**
```tsx
export function ErrorBoundary({ error }: { error: unknown }) {
  return (
    <div>
      <h1>Error!</h1>
      <p>{error instanceof Error ? error.message : "Unknown error occurred."}</p>
      <a href="/">Back to safety</a>
    </div>
  );
}
```

#### **Error en un Loader**
```tsx
export const loader: LoaderFunction = async () => {
  throw new Response("Failed to load data", { status: 500 });
};
```

Aquest error serà capturat pel **Error Boundary** de la ruta o global, assegurant que l'aplicació no es trenqui.

---

### **Punts clau**
- **Personalització per ruta**: Cada pàgina pot tenir la seva gestió d'errors.
- **Errors del client i servidor**: Captura problemes d'ambdós costats.
- **UX millorada**: Mostra missatges elegants sense interrompre tota l'experiència.

### **Canvis en la Gestió d'Errors a Remix v2**

[Enallç a la documentació oficial on s'explica](https://remix.run/docs/en/main/start/v2#catchboundary-and-errorboundary)

En versions anteriors de Remix, es diferenciava entre **CatchBoundary** per a errors previstos (com respostes amb estatus HTTP específics) i **ErrorBoundary** per a errors inesperats. A partir de Remix v2, aquesta distinció s'ha simplificat:

- **Eliminació de CatchBoundary**: La funció `CatchBoundary` ha estat eliminada. Ara, tots els errors, tant previstos com inesperats, són gestionats per `ErrorBoundary`.

- **Unificació de la Gestió d'Errors**: Amb aquesta unificació, `ErrorBoundary` s'encarrega de tots els tipus d'errors, proporcionant una interfície més senzilla per al desenvolupador.

### **Implementació de l'ErrorBoundary a Remix v2**

Per gestionar errors en una ruta específica, es pot definir una funció `ErrorBoundary` dins del mòdul de la ruta:

```tsx
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>S'ha produït un error!</h1>
      <p>{error.message}</p>
      <a href="/">Torna a la pàgina principal</a>
    </div>
  );
}
```

Aquesta funció captura qualsevol error que es produeixi en la ruta corresponent, ja sigui durant la càrrega de dades (`loader`), accions (`action`) o en el renderitzat del component.

### **Avantatges d'aquests Canvis**

- **Simplificació**: Redueix la complexitat en la gestió d'errors, ja que no cal diferenciar entre errors previstos i inesperats.

- **Consistència**: Proporciona una experiència de desenvolupament més coherent, amb un sol mecanisme per a la captura d'errors.

- **Flexibilitat**: Permet personalitzar la resposta a qualsevol tipus d'error en una ubicació centralitzada.


Si nosaltres volem tenir el control sobre certs errors, podem llançar-los des del Loader o Action. Per exemple, si no trobem cap nota guardada, podem llançar un error 404 per indicar que no s'han trobat dades.

```tsx
// Loader: Carrega les notes abans de renderitzar la pàgina
export const loader: LoaderFunction = async () => {
  try {
    const notes: Note[] = (await getStoredNotes()) || [];

    if (!notes || notes.length === 0) {
      throw Response.json({ error: "Could not find any notes." }, { status: 404, statusText: "Not Found" });
    }
    return { notes }; // Wrap notes in an object
    
  } catch (error) {
    console.error("Error loading notes:", error);
    throw new Response("Failed to load notes", { status: 500 });
  }
};
```

## Al nostre projecte 

Aquí tens una explicació detallada del que hem implementat amb l'error boundary, adaptada perquè els teus estudiants entenguin com funciona i quins beneficis aporta:

---

### Com hem implementat l'Error Boundary?**

**A. Loader amb errors específics**

Al nostre loader, hem afegit diferents nivells de gestió d'errors:
1. **Errors esperats:** Utilitzem `throw json` per llançar errors amb informació específica. Per exemple:
   ```typescript
   if (!notes || notes.length === 0) {
     throw Response.json({ message: "No notes found" }, { status: 404 });
   }
   ```
   Això permet mostrar un missatge personalitzat com "No notes found" i assignar-li un codi d'estat (404).

2. **Errors inesperats:** Si passa un error inesperat, com ara un problema en llegir el fitxer de dades, el capturem i llançem un error genèric:
   ```typescript
   catch (error) {
     throw Response.json({ message: "Failed to load notes" }, { status: 500 });
   }
   ```
   Això assegura que cap error deixa l'aplicació en un estat no controlat.

**B. L'ErrorBoundary**

L'Error Boundary és la peça clau que gestiona aquests errors i decideix com mostrar-los a l'usuari. En el nostre cas:
1. Utilitzem `useRouteError` per accedir a l'error capturat.
   ```typescript
   const error = useRouteError();
   ```

2. **Errors esperats (llançats amb `throw json`)**
   Amb `isRouteErrorResponse`, comprovem si l'error és un `Response` creat amb `throw json`:
   ```typescript
   if (isRouteErrorResponse(error)) {
     return (
       <div>
         <h1>Oops! Something went wrong.</h1>
         <p>Status: {error.status}</p>
         <p>{error.data?.message || "No additional details provided."}</p>
       </div>
     );
   }
   ```
   Això ens permet mostrar missatges com "No notes found" o "Failed to load notes", amb els codis d'estat corresponents.

3. **Errors inesperats**
   Per errors no esperats (com un objecte que no és de tipus `Response`), assegurem que també es gestioni adequadament:
   ```typescript
   let errorMessage = "An unknown error occurred.";
   if (error instanceof Error) {
     errorMessage = error.message;
   }
   ```

---

### Beneficis d'aquesta implementació

1. **Millor experiència d'usuari:** Els usuaris veuran missatges clars quan passi un error, en lloc d'una pantalla genèrica o un error desconegut.

2. **Flexibilitat per a desenvolupadors:** 
   - Amb `throw Response.json`, podem personalitzar els errors i incloure informació addicional. (abans es feia amb "json" i havíem d'importar un hook)
   - Amb `isRouteErrorResponse`, gestionem fàcilment errors esperats (com un 404).

3. **Unificació de Catch i Error Boundary:** Ara no cal gestionar errors en dues parts diferents; tot es fa des del mateix Error Boundary.

---

### Resum
**Exemple: Loader amb errors**

```typescript
export const loader: LoaderFunction = async () => {
  const notes = 0; // Simulem que no hi ha notes
  if (!notes || notes.length === 0) {
    throw Response.json({ message: "No notes found" }, { status: 404 });
  }
  return Response.json({ notes });
};
```

- Si no trobem notes, llancem un error amb `throw json`.
- L'Error Boundary detectarà aquest error i mostrarà el missatge "No notes found".

**Exemple: ErrorBoundary**

```typescript
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops!</h1>
        <p>Status: {error.status}</p>
        <p>{error.data?.message || "No additional details provided."}</p>
      </div>
    );
  }

  let errorMessage = "An unknown error occurred.";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  );
}
```

- Amb `useRouteError`, accedim a l'error generat al loader.
- Mostrem un missatge personalitzat segons el tipus d'error.

---

Codi final notes.tsx:

```tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import NewNote from "../components/NewNote";
import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { storeNotes, getStoredNotes, Note } from "../data/notes";
import NoteList from "../components/NoteList";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

// Component principal
const NotesPage = (): JSX.Element => {
  const { notes } = useLoaderData<{ notes: Note[] }>();
  console.log("Client notes:", notes);

  return (
    <main>
      <NewNote />
      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p className="text-gray-500 text-center">No hi ha notes disponibles</p>
      )}
    </main>
  );
};

// Loader: Carrega les notes abans de renderitzar la pàgina

export const loader: LoaderFunction = async () => {
  try {
    //const notes: Note[] = (await getStoredNotes()) || [];

    // Simulate getting notes
    //const notes = 0;

    if (!notes || notes.length === 0) {
      // Explicitly throw a 404 error with `json`
      throw Response.json({ message: "No notes found" }, { status: 404 });
    }

    // Return notes if they exist
    return Response.json({ notes });
  } catch (error) {
    // If error is already a Response, re-throw it
    if (error instanceof Response) {
      throw error;
    }

    // For unexpected errors, throw a 500 status with a generic message
    console.error("Unexpected error:", error);
    throw Response.json({ message: "Failed to load notes" }, { status: 500 });
  }
};

// Action: Gestiona l'enviament de noves notes
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const noteData: Note = {
    id: new Date().toISOString(),
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  if (!noteData.title || noteData.title.trim().length < 5) {
    // Aquí no podem fer servir funcions del browser com alert() ja que això està corrent al servidor.
    // En aquest cas, retornem un missatge d'error amb un codi d'estat 400.
    return Response.json(
      { error: "Invalid title - must be at least 5 characters long" },
      { status: 400 } // Indiquem que és un error del client
    );
  }

  // Validació bàsica
  if (!noteData.title || !noteData.content) {
    return new Response("Title and content are required", { status: 400 });
  }

  const existingNotes = await getStoredNotes();
  const updatedNotes: Note[] = [...existingNotes, noteData];

  await storeNotes(updatedNotes);

  // Simulem una petita espera per veure l'estat de "submitting"
  //await new Promise((resolve) => setTimeout(resolve, 1000));

  return redirect("/notes");
};

//Error Boundaries
export function ErrorBoundary() {
  const error = useRouteError();

  // Handle Route Error Responses (e.g., from `json`)
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-900">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-lg">Status: {error.status}</p>
        <p className="text-lg">
          {error.data?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  // Handle Unexpected Errors (non-Response errors)
  let errorMessage = "An unknown error occurred.";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-900">
      <h1 className="text-4xl font-bold mb-4">Uh oh ...</h1>
      <p className="text-lg">Something went wrong.</p>
      <pre className="bg-gray-800 text-white p-4 rounded">{errorMessage}</pre>
    </div>
  );
}

export default NotesPage;
```
