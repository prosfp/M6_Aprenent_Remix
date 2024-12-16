import { Expense } from "../../types/interfaces";
import supabase from "../utils/supabaseClient";

// CREATE/ADD Expense
// ADD Expense
export async function addExpense(expenseData: Expense): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        title: expenseData.title,
        amount: expenseData.amount,
        date: new Date(expenseData.date).toISOString(),
      },
    ])
    .single(); // Retorna només el primer element com a objecte sense cap array.

  console.log(data);

  if (error) {
    console.error("Error adding expense:", error);
    throw new Error("Failed to add expense.");
  }

  return data as Expense; // Garantim que `data` és del tipus `Expense`
}

// GET Expenses
export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error getting expenses:", error);
    throw new Error("Failed to get expenses.");
  }

  return data as Expense[]; // Garantim que `data` és una llista d'`Expense`
}

// GET By ID
export async function getExpense(id: string): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting expenses:", error);
    throw new Error("Failed to get expenses.");
  }

  return data as Expense; // Garantim que `data` és una llista d'`Expense`
}

// UPDATE Expense
export async function updateExpense(
  id: string,
  expenseData: Expense,
): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .update({
      title: expenseData.title,
      amount: expenseData.amount,
      date: new Date(expenseData.date).toISOString(),
    })
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense.");
  }

  return data as Expense; // Garantim que `data` és del tipus `Expense`
}

// DELETE Expense
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense.");
  }
}
