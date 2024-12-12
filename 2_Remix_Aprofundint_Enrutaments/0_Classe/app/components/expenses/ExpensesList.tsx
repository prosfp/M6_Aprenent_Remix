import React from "react";
import ExpenseListItem from "./ExpenseListItem";

interface Expense {
  id: string;
  title: string;
  amount: number;
}

interface ExpensesListProps {
  expenses: Expense[];
}
function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <ol id="expenses-list" className="mx-auto my-8 max-w-lg">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className="mx-4 my-6 flex items-baseline justify-between rounded-lg bg-indigo-300 p-4 text-gray-100"
        >
          <ExpenseListItem
            id={expense.id}
            title={expense.title}
            amount={expense.amount}
          />
        </li>
      ))}
    </ol>
  );
}

export default ExpensesList;
