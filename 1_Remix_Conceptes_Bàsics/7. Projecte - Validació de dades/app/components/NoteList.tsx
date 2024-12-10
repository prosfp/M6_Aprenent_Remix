import React from "react";
import { Note } from "../data/notes";
// Aquest component rep una llista de notes com a prop
const NoteList: React.FC<{ notes: Note[] }> = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return <div>No notes available</div>;
  }

  return (
    <div className="max-w-xl my-12 mx-auto p-8 rounded-lg bg-primary-100 shadow-md">
      <h2 className="text-center text-white font-semibold mb-4">Note List</h2>
      <ul
        id="note-list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
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
  );
};

export default NoteList;
