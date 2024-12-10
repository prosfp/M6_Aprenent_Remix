import { FC } from "react";
import { Link } from "@remix-run/react";

const Index: FC = () => {
  return (
    <main
      id="content"
      className="bg-green-700 text-white p-8 rounded-lg shadow-md text-center max-w-2xl mx-auto mt-20"
    >
      <h1 className="text-4xl font-extrabold mb-4">
        A Better Way of Keeping Track of Your Notes
      </h1>
      <p className="text-lg mb-6">
        Try our early beta and never lose track of your notes again!
      </p>
      <p id="cta">
        <Link
          to="/notes"
          className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300 shadow-lg"
        >
          Try Now!
        </Link>
      </p>
    </main>
  );
};

export default Index;
