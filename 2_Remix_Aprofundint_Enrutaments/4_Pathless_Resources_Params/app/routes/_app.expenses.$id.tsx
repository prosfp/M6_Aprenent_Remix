import Modal from "../components/util/Modal";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { useNavigate } from "@remix-run/react";

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
