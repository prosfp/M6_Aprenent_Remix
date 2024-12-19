import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import ExpenseStatistics from "../components/expenses/ExpenseStatistics";
import Chart from "../components/expenses/Chart";
import { getExpenses } from "../data/expenses.server";
import { requireUserSession } from "../data/auth.server";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  userId: string;
}

export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData<Expense[]>();

  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);

  if (!expenses || expenses.length === 0) {
    throw Response.json(
      { message: "Could not load expenses for the requested analysis." },
      {
        status: 404,
        statusText: "Expenses not found",
      },
    );
  }

  return Response.json(expenses); // Encapsulem la resposta amb json per ser explícits
}
