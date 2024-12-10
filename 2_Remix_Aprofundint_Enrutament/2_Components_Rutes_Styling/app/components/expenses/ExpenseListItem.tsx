import { FaTrash, FaEdit } from "react-icons/fa";

interface ExpenseListItemProps {
  title: string;
  amount: number;
}

function ExpenseListItem({ title, amount }: ExpenseListItemProps) {
  function deleteExpenseItemHandler() {
    // tbd
  }

  return (
    <div className="mx-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-lg text-gray-600">${amount.toFixed(2)}</p>
      </div>
      <menu className="flex space-x-4">
        <button
          onClick={deleteExpenseItemHandler}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
        <a href="tbd" className="text-blue-500 hover:text-blue-700">
          <FaEdit />
        </a>
      </menu>
    </div>
  );
}

export default ExpenseListItem;
