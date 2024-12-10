import { LoaderFunctionArgs } from "@remix-run/node";

import { getStoredNotes, Note } from "../data/notes";
import {
  isRouteErrorResponse,
  Link,
  MetaFunction,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";

// Remix permet carregar les dades de la URL a través del loader amb el paràmetre `params`
// https://remix.run/docs/en/main/route/loader#params
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<{ selectedNote: Note }> {
  const notes = await getStoredNotes();
  const noteId = params.noteId;

  const selectedNote = notes.find((note: Note) => note.id === noteId);

  if (!selectedNote) {
    // Generem un 404 amb un missatge que serà utilitzat al Catch Boundary (si no definim aqui cap boundary, serà aquell que hi hagi al root)
    throw Response.json(
      { message: "Could not find note for id " + noteId },
      { status: 404 }
    );
  }

  return { selectedNote };
}

export default function NoteDetailsPage() {
  //Hem afegit useState i useEffect simplement per afegir una animació a la pàgina
  const [isVisible, setIsVisible] = useState(false);
  const { selectedNote } = useLoaderData<{ selectedNote: Note }>();

  useEffect(() => {
    setIsVisible(true); // Dispara la transició un cop la pàgina s'ha carregat
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <nav>
        <a href="/notes" className="text-green-500 hover:underline">
          Back to Notes
        </a>
      </nav>
      <h1 className="text-4xl font-bold mb-4 ">Note Details</h1>
      <div
        className={`bg-green-100 border border-green-500 p-4 rounded text-black transition-all duration-1000 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <p className="text-lg">Note ID: {selectedNote.id}</p>
        <p className="text-lg">Title: {selectedNote.title}</p>
        <p className="text-lg">Content: {selectedNote.content}</p>
      </div>
    </div>
  );
}

// Meta: Informació de la pàgina
// Podem accedir a la informació dinàmica, per exemple el títol de la nota seleccionada. Ho fem amb l'objecte data que ens arriba com a paràmetre.
// 'data' és el resultat de la funció loader, és a dir `selectedNote`, que aquí passa a ser `data`.
export const meta: MetaFunction = ({
  data,
}: {
  data: { selectedNote: Note };
}) => {
  if (!data || !data.selectedNote) {
    return [
      { title: "Note not found" },
      { name: "description", content: "No details available for this note." },
    ];
  }

  const { selectedNote } = data;

  return [
    { title: selectedNote.title },
    { name: "description", content: `Details for note: ${selectedNote.title}` },
  ];
};

// Error Boundaries

export function ErrorBoundary() {
  const error = useRouteError();

  // Cas 1: Error de resposta 404 (no trobat)
  // Aquest cas gestiona únicament els errors on l'element buscat no existeix (per exemple, una nota amb un id no trobat).
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-yellow-900">
        <h1 className="text-4xl font-bold mb-4">Note not found</h1>
        <p className="text-lg mb-4">
          The note you are looking for does not exist.
        </p>
        <Link
          to="/notes"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Back to the Notes
        </Link>
      </div>
    );
  }

  // Cas 2: Altres errors de resposta (500, 403, etc.)
  // Aquest cas cobreix errors del tipus `Response`, però no `404`. Mostra l'estat i un missatge personalitzat si està disponible.
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-900">
        <h1 className="text-4xl font-bold mb-4">Error!</h1>
        <p className="text-lg mb-4">
          {`There was an error with status: ${error.status}.`}
        </p>
        <p>{error.data?.message || "Something went wrong."}</p>
        <Link
          to="/notes"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Back to the Notes
        </Link>
      </div>
    );
  }

  // Cas 3: Errors inesperats (no són del tipus `Response`)
  // Aquí es gestiona qualsevol error que no sigui del tipus `Response`, com errors de JavaScript.
  let errorMessage = "An unknown error occurred.";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-900">
      <h1 className="text-4xl font-bold mb-4">Uh oh ...</h1>
      <p className="text-lg mb-4">Something went wrong.</p>
      <pre className="bg-gray-800 text-white p-4 rounded">{errorMessage}</pre>
      <Link to="/notes" className="text-blue-500 underline hover:text-blue-700">
        Back to the Notes
      </Link>
    </div>
  );
}
