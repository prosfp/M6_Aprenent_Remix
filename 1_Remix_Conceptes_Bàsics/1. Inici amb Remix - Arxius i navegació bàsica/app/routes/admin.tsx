import { NavLink, Outlet } from "@remix-run/react";

export default function AdminLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header>
        <nav className="flex space-x-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-gray-500"
            }
          >
            Inici Admin
          </NavLink>
          <NavLink
            to="/admin/gestio"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-gray-500"
            }
          >
            Gestió
          </NavLink>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
