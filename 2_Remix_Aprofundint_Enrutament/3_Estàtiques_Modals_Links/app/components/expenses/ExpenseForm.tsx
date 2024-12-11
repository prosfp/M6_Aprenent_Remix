import { Link } from "@remix-run/react";
import React from "react";

const ExpenseForm: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10

  return (
    <form
      method="post"
      className="flex flex-col rounded-lg bg-gray-100 p-6 shadow-md"
      id="expense-form"
    >
      <p className="mb-4">
        <label
          htmlFor="title"
          className="mb-2 block font-semibold text-gray-700"
        >
          Expense Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </p>

      <div className="form-row mb-4 flex flex-col md:flex-row md:space-x-4">
        <p className="mb-4 md:mb-0">
          <label
            htmlFor="amount"
            className="mb-2 block font-semibold text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </p>
        <p>
          <label
            htmlFor="date"
            className="mb-2 block font-semibold text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </p>
      </div>
      <div className="form-actions flex items-center justify-between">
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Save Expense
        </button>
        <Link
          className="text-indigo-500 hover:underline"
          prefetch="none"
          //to="/expenses" // També podem posar ".." ja que això fa que vagi a la ruta superior, com quan fem cd ..
          to=".."
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default ExpenseForm;
