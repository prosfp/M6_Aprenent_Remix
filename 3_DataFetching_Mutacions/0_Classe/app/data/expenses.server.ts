import { Expense } from "../../types/interfaces";
import supabase from "../utils/supabaseClient";

export async function addExpense(expenseData: Expense) {
  try {
    // els valors ens arriben
    return await supabase.from("expenses").insert([
      {
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date,
      },
    ]);
  } catch (error) {
    throw new Error("Failed to get expenses.");
  }
}
