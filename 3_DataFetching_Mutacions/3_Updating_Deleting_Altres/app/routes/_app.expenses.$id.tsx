import Modal from "../components/util/Modal";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
//import { getExpense } from "../data/expenses.server";

export default function ExpensesAddPage() {
  const navigate = useNavigate();

  function closeHandler() {
    // No volem navegar amb Link en aquest cas ("navigate programmatically")No fem servir Link perquè
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

// En aquest cas sí necessito la infromació dels paràmetres de la URL perquè em dona l'ID de l'element que vull editar
// export async function loader({ params }: LoaderFunctionArgs) {
//   const expenseId = params.id;
//   if (!expenseId) {
//     throw new Error("Expense ID is required");
//   }
//   const expense = await getExpense(expenseId);
//   return expense;
// }
