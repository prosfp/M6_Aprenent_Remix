/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import NewNote from "../components/NewNote";

// Pel que fa al tipatge, en casos senzill com aquest que no passem cap paràmetre a la funció, podem utilitzar la següent sintaxi:
// JSX.Element simplement indica que la funció retornarà un element JSX.

const NotesPage = (): JSX.Element => {
  return (
    <main>
      <NewNote />
    </main>
  );
};

export default NotesPage;
