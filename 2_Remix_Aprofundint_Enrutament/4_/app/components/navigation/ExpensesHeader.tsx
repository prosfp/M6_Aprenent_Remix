import { NavLink } from "@remix-run/react";
import Logo from "../util/Logo";
import { FC } from "react";

const ExpensesHeader: FC = () => {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Logo />
      </div>

      {/* Expenses Header */}
      <nav className="flex space-x-4">
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/expenses"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Manage Expenses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/expenses/analysis"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-300"
                  : "transition-colors duration-300 hover:text-blue-300"
              }
            >
              Analyze Expenses
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Call to Action Navigation */}
      <nav id="cta-nav">
        <button className="rounded-lg bg-white px-4 py-2 text-blue-600 shadow-md transition-all duration-300 hover:bg-blue-100">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default ExpensesHeader;
