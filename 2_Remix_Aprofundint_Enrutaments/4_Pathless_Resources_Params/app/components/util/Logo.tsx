import { Link } from "@remix-run/react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <h1 id="logo" className="text-3xl font-bold">
      <Link to="/" className="text-purple-900 hover:text-indigo-700">
        RemixExpenses
      </Link>
    </h1>
  );
};

export default Logo;
