// /expenses -> Shared Layout

const DUMMY_EXPENSES = [
  {
    id: "e1",
    title: "First Expense",
    amount: 12.99,
    date: new Date().toISOString(),
  },
  {
    id: "e2",
    title: "Second Expense",
    amount: 16.99,
    date: new Date().toISOString(),
  },
];

import { Link, Outlet } from "@remix-run/react";
import ExpensesList from "../components/expenses/ExpensesList";
import { FaPlus, FaDownload } from "react-icons/fa";

export default function ExpensesLayout() {
  return (
    <>
      <Outlet />
      <main>
        <section className="my-4 flex justify-center">
          <Link
            to="add"
            className="flex items-center rounded bg-gray-100 p-2 text-blue-500 shadow-md hover:text-blue-700"
          >
            <FaPlus />
            <span className="ml-2">Add Expense</span>
          </Link>
          <a
            href="/expenses/raw"
            className="ml-4 flex items-center rounded bg-gray-100 p-2 text-blue-500 shadow-md hover:text-blue-700"
          >
            <FaDownload />
            <span className="ml-2">Load Raw Data</span>
          </a>
        </section>
        <ExpensesList expenses={DUMMY_EXPENSES} />
      </main>
    </>
  );
}
