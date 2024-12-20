import { Link } from "@remix-run/react";
import { FC } from "react";

const Index: FC = () => {
  return (
    <main id="content">
      <h1>A better way of keeping track of your notes</h1>
      <p>Try our early beta and never lose track of your notes again!</p>
      <p id="cta">
        <Link to="/notes">Try Now!</Link>
      </p>
    </main>
  );
};

export default Index;
