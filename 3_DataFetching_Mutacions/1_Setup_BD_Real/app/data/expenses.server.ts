import { Expense } from "../types/interfaces";

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

export async function addExpense(expenseData: Expense) {
  const { data, error } = await supabase.from("expenses").insert([
    {
      title: expenseData.title,
      amount: +expenseData.amount,
      date: new Date(expenseData.date).toISOString(),
    },
  ]);

  if (error) {
    console.error("Error adding expense:", error);
    throw new Error(error.message);
  }

  return data;
}
