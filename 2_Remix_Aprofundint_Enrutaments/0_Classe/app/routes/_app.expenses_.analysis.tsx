const DUMMY_EXPENSES = [
  {
    id: "e1",
    title: "First Expense",
    amount: 12.99,
    date: new Date().toISOString(),
  },
  {
    id: "e2",
    title: "Second Expense",
    amount: 16.99,
    date: new Date().toISOString(),
  },
];

import Chart from "../components/expenses/Chart";
import ExpenseStatistics from "../components/expenses/ExpenseStatistics";

export default function ExpensesAnalysisPage() {
  return (
    <>
      <Chart expenses={DUMMY_EXPENSES} />
      <ExpenseStatistics expenses={DUMMY_EXPENSES} />
    </>
  );
}
