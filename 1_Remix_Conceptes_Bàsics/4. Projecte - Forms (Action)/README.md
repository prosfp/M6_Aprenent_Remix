### **Introducció a Forms a Remix**

Els **formularis (forms)** són una peça fonamental a Remix, ja que integren els **principis bàsics del web** amb **tecnologia moderna** per gestionar la mutació de dades. Remix aprofita la simplicitat dels formularis HTML tradicionals i els combina amb funcionalitats modernes com el `fetch` i la revalidació automàtica, oferint una experiència més àgil i accessible.

---

#### **1. HTML Tradicional: Un Model Basat en Pàgines Completes**
En el web tradicional, l'enviament d'un formulari desencadenava una petició HTTP directa al servidor, seguida d'una **recarrega completa de la pàgina**. Això comportava:

- **Interrupcions** per a l'usuari (temps de càrrega).
- Dificultats per gestionar errors i estat del formulari.
- Necessitat de dissenyar fluxos més lents i menys interactius.

##### **Exemple de Formulari HTML Tradicional**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Traditional HTML Form</title>
</head>
<body>
  <h1>Submit a Note</h1>
  <form action="/submit-note" method="post">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" required>
    <br>
    <label for="content">Content:</label>
    <textarea id="content" name="content" required></textarea>
    <br>
    <button type="submit">Save</button>
  </form>
</body>
</html>
```

##### **Flux d'Execució (Sense JavaScript)**
1. **Enviament del Formulari:**
   - El navegador envia una petició HTTP (`POST`) a l'URL especificat a l'atribut `action`.
   - Les dades del formulari es serialitzen automàticament (`application/x-www-form-urlencoded` o `multipart/form-data`).

2. **Resposta del Servidor:**
   - El servidor processa les dades i retorna una resposta.
   - La pàgina es recarrega completament, mostrant el contingut resultant.

##### **Limitacions del Model Tradicional**
- **Pèrdua d'estat:** Si hi ha errors, les dades introduïdes es perden.
- **Lentitud:** Cada acció implica una recàrrega completa.
- **Manca de feedback:** L'usuari no rep indicacions immediates (com ara "càrrega en curs").

---

#### **2. Remix: L'Enfocament Modern**
Remix conserva la senzillesa dels formularis HTML tradicionals però elimina les seves limitacions:

1. **Intercepta el comportament predeterminat:**
   - Quan un formulari s'envia, Remix utilitza **client-side fetch** per evitar la recàrrega de la pàgina.
   - Això fa que l'experiència sigui més ràpida i fluida.

2. **Revalidació automàtica:**
   - Després d'una acció, Remix torna a executar els `loaders` per assegurar que la informació de la pàgina estigui actualitzada.

3. **Accessibilitat nativa:**
   - Sense JavaScript, els formularis funcionen com en el web tradicional, assegurant compatibilitat i degradació progressiva.

##### **Exemple amb Remix**
```tsx
<Form method="post">
  <label htmlFor="title">Title:</label>
  <input type="text" id="title" name="title" required />
  <br />
  <label htmlFor="content">Content:</label>
  <textarea id="content" name="content" required></textarea>
  <br />
  <button type="submit">Save</button>
</Form>
```

##### **Funció `action` Associada**
```tsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const note = {
    title: formData.get("title"),
    content: formData.get("content"),
  };

  // Processa les dades (per exemple, desa-les en una base de dades)
  return redirect("/notes");
};
```

##### **Avantatges del Model Remix**
- **Evita recàrregues:** Tot es gestiona amb fetch i actualització parcial.
- **Errors més clars:** Pots retornar errors al formulari sense perdre l'estat.
- **Millor experiència d'usuari:** Feedback instantani amb spinners o indicadors visuals.

---

### **Principals Característiques dels Forms a Remix**

1. **Propietat `method`:**
   - Indica el tipus de petició HTTP (`GET`, `POST`, `PUT`, `DELETE`).
   - Exemples:
     ```tsx
     <Form method="post">
       <input type="text" name="note" placeholder="Write a note" />
       <button type="submit">Save</button>
     </Form>
     ```

2. **Actions i Loaders:**
   - **`action`**: Processa les dades enviades des del formulari.
   - **`loader`**: Carrega les dades necessàries abans de renderitzar la pàgina.

3. **Degradació Progressiva:**
   - Els formularis funcionen tant amb **JavaScript habilitat** com deshabilitat.

4. **Revalidació Automàtica:**
   - Després d'una `action`, Remix executa els `loaders` per garantir que les dades estiguin actualitzades.

---

### **Comparativa**

| Funcionalitat           | HTML Tradicional                          | Remix                                      |
|-------------------------|-------------------------------------------|--------------------------------------------|
| Enviament del Formulari | Petició completa HTTP + recàrrega         | Fetch amb actualització parcial            |
| Maneig d'Errors         | Recarrega completa amb errors visuals     | Retorn JSON + gestió elegant d'errors      |
| Estat del Formulari     | Es perd amb errors                        | Conservat al client                        |
| Experiència d'Usuari    | Sense indicadors de càrrega               | Fluida i moderna                           |

---

# Sobre el codi d'aquesta lliçó

D'entrada sense haver modificat res si intentes afegir un nou Note a través del formulari, veuràs que, encara que ens retorna un 405 Method Not Allowed. Això és degut a que no tenim cap `action` definida a la nostra ruta `routes/notes.tsx`.
Tot i aixi Remix per defecte envia una petició POST a la mateixa ruta on està el formulari, en aquest cas `routes/notes.tsx`. Per tant, si volem que el formulari funcioni correctament, hem de definir una funció `action` a la mateixa ruta. Pots veure-ho a través del developer tools del navegador. Veuràs una petició POST a la mateixa ruta on està el formulari.

```tsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const note = formData.get("note");
  console.log("Nova nota:", note);
  return redirect("/notes");
};
```

Ens generem "utility Functions" per a la gestió de les notes, així que aquesta funció `action` simplement recull la nova nota i ens redirigim a la pàgina de /notes.

```tsx
import fs from "fs/promises";

// Defineix el tipus per a una nota individual
export interface Note {
  id: string;
  title: string;
  content: string;
}

const DATA_FILE = "notes.json";

// Llegeix les notes guardades d'un fitxer JSON
export async function getStoredNotes(): Promise<Note[]> {
  try {
    const rawFileContent = await fs.readFile(DATA_FILE, { encoding: "utf-8" });
    const data = JSON.parse(rawFileContent);
    // Retorna les notes o un array buit si no hi ha notes
    return data.notes ?? [];
  } catch (error) {
    // Si el fitxer no existeix, retorna un array buit
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error; // Si és un altre error, llença'l
  }
}

// Desa notes en un fitxer JSON
export async function storeNotes(notes: Note[]): Promise<void> {
  const jsonData = JSON.stringify({ notes: notes || [] }, null, 2);
  await fs.writeFile(DATA_FILE, jsonData, { encoding: "utf-8" });
}
```
A l'arrel del nostre projecte, generem l'arxiu `notes.json` amb una nota per defecte.

```json
{
  "notes": [
    {
      "id": 1,
      "title": "First Note",
      "content": "This is the content of the first note."
    },
    {
      "id": 2,
      "title": "Second Note",
      "content": "This is the content of the second note."
    },
    {
      "id": 3,
      "title": "Third Note",
      "content": "This is the content of the third note."
    }
  ]
}

```

Anem ara a implementar la lògica a la nostra funció `action` per a que aquesta nova nota es guardi a la nostra base de dades.

```tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import NewNote from "../components/NewNote";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { storeNotes, getStoredNotes, Note } from "../data/notes";

// Pel que fa al tipatge, en casos senzill com aquest que no passem cap paràmetre a la funció, podem utilitzar la següent sintaxi:
// JSX.Element simplement indica que la funció retornarà un element JSX.

const NotesPage = (): JSX.Element => {
  return (
    <main>
      <NewNote />
    </main>
  );
};

// Tot el que posem aquí serà executat al "server" (o backend) de Remix, i no al
// client. Això vol dir que no tindrem accés a l'objecte window, per exemple.

// Action s'executarà sempre que es faci una petició a aquesta ruta del tipus POST, PUT o DELETE (no GET).
export const action = async ({ request }: ActionFunctionArgs) => {
  // Amb una sola linia de codi, obtenim les dades del formulari
  const formData = await request.formData();

  // const noteData = {
  //   title: formData.get("title"),
  //   note: formData.get("content"),
  // };

  // Encara més òptim amb Object.fromEntries que ens permet crear un objecte a partir d'un array de parells clau-valor
  const noteData: Note = {
    id: "",
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  // Afegir VALIDACIÓ

  // Recuperem les notes existents
  const existingNotes = await getStoredNotes();

  // Afegim la nova nota a la llista, abans però afegim un id únic (en aquest cas la data actual)
  noteData.id = new Date().toISOString();
  const updatedNotes: Note[] = [...existingNotes, noteData];

  // Guardem les notes
  await storeNotes(updatedNotes);

  // Podem redirigir a l'usuari on volguem
  return redirect("/notes");
};

export default NotesPage;
```

Ja tenim la nostra funció `action` implementada. Ara, quan afegim una nova nota, aquesta es guardarà a la nostra base de dades i ens redirigirà a la pàgina de notes (on encara s'han de mostrar les notes!).
