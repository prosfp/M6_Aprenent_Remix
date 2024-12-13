import { Link } from "@remix-run/react";
import { FaTrash, FaEdit } from "react-icons/fa";

interface ExpenseListItemProps {
  id: string;
  title: string;
  amount: number;
}

function ExpenseListItem({ id, title, amount }: ExpenseListItemProps) {
  function deleteExpenseItemHandler() {
    // tbd
  }
  return (
    <div className="flex w-full items-center justify-between">
      {/* Informació de la despesa */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-lg">${amount.toFixed(2)}</p>
      </div>

      {/* Botons d'acció */}
      <div className="flex items-center space-x-4">
        <button
          onClick={deleteExpenseItemHandler}
          className="transform text-xl text-red-500 transition-transform hover:scale-125 hover:text-red-700"
        >
          <FaTrash />
        </button>
        <Link
          to={id}
          className="transform text-xl text-blue-500 transition-transform hover:scale-125 hover:text-blue-700"
        >
          <FaEdit />
        </Link>
      </div>
    </div>
  );
}

export default ExpenseListItem;
