import Modal from "../components/util/Modal";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { redirect, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { deleteExpense, updateExpense } from "../data/expenses.server";
import { validateExpenseInput } from "../data/validations.server";
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

export async function action({ request, params }: LoaderFunctionArgs) {
  const expenseID = params.id as string;

  if (request.method === "PATCH") {
    // Vull editar la despesa
    const formData = await request.formData();

    const expenseData = {
      title: formData.get("title") as string, // hauria de ser un string sempre i ens evita error TS
      amount: parseFloat(formData.get("amount") as string), // Converteix a número
      date: new Date(formData.get("date") as string), // Converteix a Data
    };

    try {
      // Validem les dades abans de fer la mutació
      validateExpenseInput(expenseData);
    } catch (error) {
      // En aquest cas ens volem assegurar que l'usuari vegi els errors que han provocat aquest error de validació
      return error;
    }

    console.log(expenseData);

    await updateExpense(expenseID, expenseData);
    return redirect("/expenses");
  } else if (request.method === "DELETE") {
    // Aquí no vull modificar res, només eliminar
    await deleteExpense(expenseID);
    return redirect("/expenses");
  }
}
