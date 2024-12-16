import Modal from "../components/util/Modal";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { redirect, useNavigate } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { validateExpenseInput } from "../data/validations.server";
import { deleteExpense, updateExpense } from "../data/expenses.server";
//import { LoaderFunctionArgs } from "@remix-run/node";
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

export async function action({ request, params }: ActionFunctionArgs) {
  const expenseID = params.id as string;

  if (request.method === "PATCH") {
    const formData = await request.formData();
    const expenseData = {
      title: formData.get("title") as string, // hauria de ser un string sempre i ens evita error TS
      amount: parseFloat(formData.get("amount") as string), // Converteix a número
      date: new Date(formData.get("date") as string), // Converteix a Data
    };

    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    await updateExpense(expenseID, expenseData);
  } else if (request.method === "DELETE") {
    //Haurem de fer la crida a la funció delete
    await deleteExpense(expenseID);
  }
  return redirect("/expenses");
}

// export async function loader({ params }: LoaderFunctionArgs) {
//   const expenseId = params.id;
//   const expense = await getExpense(expenseId);
//   return expense;
// }
