import { useFetcher, Link } from "@remix-run/react";
import { FaTrash, FaEdit } from "react-icons/fa";

interface ExpenseListItemProps {
  id: string;
  title: string;
  amount: number;
}

function ExpenseListItem({ id, title, amount }: ExpenseListItemProps) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state === "submitting";

  // Handler per confirmar i enviar la petició DELETE
  function confirmDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault(); // Evitem l'enviament immediat del formulari
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );
    if (isConfirmed) {
      fetcher.submit(null, { method: "delete", action: `/expenses/${id}` });
    }
  }

  return (
    <div className="flex w-full items-center justify-between p-4">
      {/* Si s'està eliminant, mostrem només el text "Deleting..." */}
      {isDeleting ? (
        <div className="flex w-full items-center justify-center">
          <p className="animate-pulse text-xl font-semibold text-gray-500">
            Deleting...
          </p>
        </div>
      ) : (
        <>
          {/* Informació de la despesa */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-lg">${amount.toFixed(2)}</p>
          </div>

          {/* Botons d'acció */}
          <div className="flex items-center space-x-4">
            <fetcher.Form method="delete" action={`/expenses/${id}`}>
              <button
                type="submit"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="transform text-xl text-red-500 transition-transform hover:scale-125 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </fetcher.Form>

            <Link
              to={id}
              className="transform text-xl text-blue-500 transition-transform hover:scale-125 hover:text-blue-700"
            >
              <FaEdit />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseListItem;
