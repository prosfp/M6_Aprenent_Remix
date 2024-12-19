import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../util/Logo";

const MainHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Logo />
      </div>

      {/* Navegació principal */}
      <nav className="flex space-x-4">
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Pricing
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Call to Action Navegació */}
      <nav id="cta-nav">
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              to="/auth"
              className="rounded-lg bg-white px-4 py-2 text-blue-600 shadow-md transition-all duration-300 hover:bg-blue-100"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
