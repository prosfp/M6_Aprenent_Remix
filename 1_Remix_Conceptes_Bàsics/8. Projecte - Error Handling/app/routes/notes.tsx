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
