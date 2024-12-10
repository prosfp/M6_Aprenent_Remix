import fs from "fs/promises";

export interface Note {
  id: string;
  title: string;
  content: string;
}

export async function getStoredNotes(): Promise<Note[]> {
  try {
    const rawFileContent = await fs.readFile("notes.json", {
      encoding: "utf-8",
    });
    const data = JSON.parse(rawFileContent);
    const storedNotes: Note[] = data.notes ?? [];
    return storedNotes;
  } catch {
    return [];
  }
}

export function storeNotes(notes: Note[]): Promise<void> {
  return fs.writeFile("notes.json", JSON.stringify({ notes: notes || [] }));
}
