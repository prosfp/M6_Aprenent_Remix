import { useNavigate } from "@remix-run/react";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/util/Modal";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
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
  // formData retorna la promesa de retornar la informació del formulari
  const formData = await request.formData();
  // Puc recuperar individualment els valors del formulari amb get() i el nom del camp
  // const title = formData.get("title");
  // const amount = formData.get("amount");
  // ...

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

  console.log(formData, expenseData);
  await addExpense(expenseData);

  // És habitual retornar un redirect després d'una mutació.
  return redirect("/expenses");
}
