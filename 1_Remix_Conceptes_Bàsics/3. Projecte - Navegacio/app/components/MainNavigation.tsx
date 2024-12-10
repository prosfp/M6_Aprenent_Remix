import { NavLink } from "@remix-run/react";

function MainNavigation(): JSX.Element {
  return (
    <nav id="main-navigation" className="text-white py-4 px-6 shadow-lg">
      <ul className="flex space-x-8">
        <li className="nav-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-green-500 font-bold" : "hover:text-green-500"
            }
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              isActive ? "text-green-500 font-bold" : "hover:text-green-500"
            }
          >
            My Notes
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default MainNavigation;
