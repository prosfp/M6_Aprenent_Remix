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

// // Recordatori
// Resum ràpid
// Operador	Funció	Quan usar-lo?
// ??	Usa la dreta si l'esquerra és null o undefined	Per assignar valors per defecte
// &&	Retorna la dreta si l'esquerra és truthy	Per executar accions o assignar valors condicionalment
