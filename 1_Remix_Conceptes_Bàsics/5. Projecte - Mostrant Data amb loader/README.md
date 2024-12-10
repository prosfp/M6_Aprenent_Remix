### **Fetching Data amb `loader` a Remix**

Una de les funcions principals de **Remix** és com gestiona la càrrega de dades al servidor i les proporciona al client. Això es fa mitjançant els **loaders**, que són funcions que actuen com a **data fetchers**.

Els `loaders` permeten carregar dades al servidor abans de renderitzar la pàgina al client, cosa que optimitza el rendiment i assegura que el contingut estigui disponible des del primer moment.

---

### **Principals Característiques del `loader`**

1. **Execució al servidor:**
   - El `loader` sempre s'executa al servidor abans que el component es renderitzi al client.
   - Això significa que no tens accés a objectes com `window`, però pots fer servir funcionalitats del servidor com crides a APIs, lectura de fitxers, o accés a bases de dades.

2. **Retorn de dades al client:**
   - Les dades carregades amb el `loader` són accessibles al client mitjançant el hook `useLoaderData`.

3. **Gestió d'errors integrada:**
   - Si el `loader` falla (per exemple, una crida a l'API retorna un error), Remix pot gestionar l'error automàticament i mostrar un estat d'error personalitzat.

---

### **Com funciona un `loader`?**

1. **Defineix el `loader`:**
   - És una funció exportada des de la mateixa ruta que retorna les dades que necessitaràs al component.

2. **Utilitza `json`:**
   - Remix proporciona la funció `json` per estructurar la resposta del `loader` i enviar dades al client.

3. **Accedeix a les dades amb `useLoaderData`:**
   - El client pot accedir a les dades del `loader` utilitzant el hook `useLoaderData` al component.

---

### **Exemple Pràctic:**

#### **Definint el `loader`:**
```tsx
// routes/notes.tsx
import { json } from "@remix-run/node";
import { getStoredNotes } from "../data/notes";

export const loader = async () => {
  const notes = await getStoredNotes(); // Carrega les notes d'un fitxer JSON
  return json({ notes }); // Retorna les dades al client
};
```

#### **Consumint el `loader` al component:**
```tsx
import { useLoaderData } from "@remix-run/react";

const NotesPage = (): JSX.Element => {
  const { notes } = useLoaderData<{ notes: Note[] }>(); // Accedeix a les dades carregades pel loader

  return (
    <main>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};
```

---

### **Flux de Treball d'un `loader`:**

1. **Petició al servidor:**
   - Quan un usuari accedeix a `/notes`, el servidor executa el `loader` per obtenir les dades necessàries.

2. **Resposta estructurada:**
   - El `loader` retorna les dades al client amb `json`.

3. **Renderització al client:**
   - El client accedeix a aquestes dades amb `useLoaderData`, que les fa accessibles per al component React.

---

### **Beneficis d'Utilitzar `loader` a Remix**

- **Càrrega de dades optimitzada:**
  - Les dades es carreguen abans de renderitzar la pàgina, millorant el SEO i el temps de càrrega inicial.
- **Simplificació del codi client:**
  - Evites utilitzar hooks com `useEffect` per fer fetch de dades, ja que tot es gestiona al servidor.
- **Sincronització amb el backend:**
  - Els `loaders` asseguren que el client sempre tingui la informació més actualitzada després d'una acció (`action`).

---

## Anem a veure al nostre codi com ho fem:

Ens generem un component `NoteList` que ens mostrarà una llista de notes. Aquest component rebrà un array de notes i les mostrarà en un format específic.

Aquí tens el codi adaptat que combina els estils i funcionalitats del teu exemple original amb l'estil de la llista d'informació que has proporcionat:

### **Note List**
```tsx
import React from "react";
import { Note } from "../data/notes";
import { useLoaderData } from "@remix-run/react";

interface NoteListProps {
  notes: Note[];
}

// Aquest component rep una llista de notes i les mostra en una llista
const NoteList: React.FC<NoteListProps> = () => {
  const { notes } = useLoaderData<NoteListProps>();
  console.log(notes);
  if (!notes) {
    return <div>No notes available</div>;
  }

  return (
    console.log(notes),
    (
      <div className="max-w-xl my-12 mx-auto p-8 rounded-lg bg-primary-100 shadow-md">
        <h2 className="text-center text-white font-semibold mb-4">Note List</h2>
        <ul id="note-list" className="space-y-6">
          {notes.map((note, index) => (
            <li
              key={note.id}
              className="note bg-white border border-green-300 rounded-md p-4 shadow"
            >
              <article>
                <header className="mb-4">
                  <ul className="note-meta flex justify-between text-sm text-gray-500">
                    <li>#{index + 1}</li>
                    <li>
                      <time dateTime={note.id}>
                        {new Date(note.id).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </li>
                  </ul>
                  <h2 className="text-lg font-semibold text-gray-700">
                    {note.title}
                  </h2>
                </header>
                <p className="text-gray-600">{note.content}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default NoteList;

```

---

### **Explicació dels Canvis**

1. **`note-meta`:**
   - Afegeix un llistat dins del `header` amb metadades:
     - Número d'índex (ex. `#1`, `#2`).
     - Data de creació formatada amb `toLocaleDateString`.

2. **Estils de Tailwind:**
   - **`space-y-6`:** Espai vertical entre les notes.
   - **`flex justify-between`:** Per alinear l'índex i la data a la mateixa línia dins de les metadades.
   - **Tipografia:** Millores amb `text-sm` i colors (`text-gray-500`, `text-gray-700`, `text-gray-600`) per millorar la jerarquia visual.

3. **Millora del títol (`<h2>`):**
   - Afegit dins del `header` amb un estil més destacat.

4. **Data formatada:**
   - Utilitza el mètode `toLocaleDateString` per convertir el `note.id` (ISO string) a un format llegible.

5. **Aspecte més net amb espais i colors:**
   - **Contenidor principal (`div`):**
     - Fons suau amb `bg-primary-100`.
     - Ombra (`shadow-md`) per donar profunditat.
   - **Notes individuals (`li`):**
     - Marques distintives amb fons blanc i un petit contorn verd.

---

### **Resultat Visual Esperat**

Cada nota es mostrarà amb aquest format:

- Una capçalera amb:
  - Número d'índex (`#1`, `#2`...).
  - Data i hora de creació (ex. `Nov 21, 2024, 10:00 AM`).
  - Títol destacat.
- Contingut del text amb un estil clar i espaiat.

Aquest disseny és compacte, elegant i funcional. Si vols afegir més funcionalitats (com botons d'acció o icones), podem personalitzar-lo més! 😊


---

Afegim de moment el component a la nostra pàgina de notes:

```tsx
... // Altres imports
const NotesPage = (): JSX.Element => {
  return (
    <main>
      <NewNote />
      <NoteList notes={[]} />
    </main>
  );
};
... // Altres exports
```

I ens falta implementar el `loader` per carregar les dades reals de les notes. 

Hem d'afegir tant el `loader` a la pàgina de notes (`notes.tsx`) per carregar les dades de les notes així com
passar aquestes dades al component `NoteList` com a propietat `notes`.

Compte amb el tipus de dades que passis com a propietat `notes` al component `NoteList` perquè aquestes dades han de ser les mateixes que retorna el `loader`.

```tsx
// routes/notes.tsx
// Component principal: NotesPage

// ... Altres imports

// Loader s'executarà sempre que es faci una petició a aquesta ruta del tipus GET. Sempre que aquest
// component estigui a punt de ser renderitzat, primer s'executarà aquesta funció.

export const loader = async () => {
  const notes = await getStoredNotes(); // Obté les notes del fitxer JSON
  return Response.json({ notes }); // Retorna les notes al client
};

// ... Altres exports

const NotesPage = (): JSX.Element => {
  // Accedeix a les dades carregades pel loader
  const { notes } = useLoaderData<{ notes: Note[] }>();

  return (
    <main>
      <NewNote />
      {/* Passa les notes carregades com a prop a NoteList */}
      <NoteList notes={notes} />
    </main>
  );
};

// Tot el que posem aquí serà executat al "server" (o backend) de Remix, i no al
// client. Això vol dir que no tindrem accés a l'objecte window, per exemple.


```
