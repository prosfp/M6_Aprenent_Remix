// /expenses -> Shared Layout

import { Outlet } from "@remix-run/react";

export default function ExpensesLayout() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-900 min-h-screen">
      <header className="bg-indigo-700 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold">Expenses Dashboard</h1>
      </header>
      <main className="container mx-auto mt-4">
        <Outlet />
      </main>
    </div>
  );
}
