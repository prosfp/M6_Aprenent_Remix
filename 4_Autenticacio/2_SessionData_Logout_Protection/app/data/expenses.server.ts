// AMB ATLAS DE MONGODB + PRISMA
// import { prisma } from "./database.server";

// export async function addExpense(expenseData: Expense) {
//   console.log("Adding expense:", expenseData);
//   try {
//     await prisma.expense.create({
//       data: {
//         title: expenseData.title,
//         // L'operador + permet de convertir une string en number que és el que espera la BD
//         amount: +expenseData.amount,
//         // new Date(expenseData.date) permet de convertir la string en date que és el que espera la BD
//         date: new Date(expenseData.date),
//       },
//     });
//   } catch (error) {
//     console.error("Error adding expense:", error);
//     throw error;
//   }
// }

// AMB SUPABASE I EL SEU CLIENT

import supabase from "../utils/supabaseClient";
import { Expense } from "../types/interfaces"; // Defineix la interfície Expense correctament

// ADD Expense
export async function addExpense(
  expenseData: Expense,
  userId: string,
): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        title: expenseData.title,
        amount: expenseData.amount,
        date: new Date(expenseData.date).toISOString(),
        user_id: userId,
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
export async function getExpenses(userId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
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
