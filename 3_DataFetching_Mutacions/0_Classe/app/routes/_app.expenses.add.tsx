import { redirect, useNavigate } from "@remix-run/react";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/util/Modal";
import { ActionFunctionArgs } from "@remix-run/node";
import { addExpense } from "../data/expenses.server";
import { validateExpenseInput } from "../data/validations.server";

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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const expenseData = {
    title: formData.get("title") as string,
    amount: parseFloat(formData.get("amount") as string),
    date: new Date(formData.get("date") as string),
  };

  //console.log(formData, expenseData);

  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }

  await addExpense(expenseData);

  return redirect("/expenses");
}
