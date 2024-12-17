import { useMemo } from "react";

interface Expense {
  amount: number;
}

interface ExpenseStatisticsProps {
  expenses: Expense[];
}

function calculateSummaryStatistics(expenses: Expense[]) {
  const amounts = expenses.map((expense) => +expense.amount);
  const maxAmount = Math.max(...amounts);
  const minAmount = Math.min(...amounts);
  const sum = expenses.reduce((prevVal, curVal) => curVal.amount + prevVal, 0);
  const mean = sum / expenses.length;

  return { minAmount, maxAmount, sum, mean };
}

function ExpenseStatistics({ expenses }: ExpenseStatisticsProps) {
  const { minAmount, maxAmount, sum, mean } = useMemo(
    () => calculateSummaryStatistics(expenses),
    [expenses],
  );

  return (
    <section className="mx-auto flex w-3/4 flex-col items-center rounded-lg bg-gray-100 p-4 text-blue-600 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Summary Statistics</h2>
      <dl
        id="expense-statistics"
        className="grid w-full max-w-md grid-cols-2 gap-4"
      >
        <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow">
          <dt className="text-lg font-semibold">Total</dt>
          <dd className="text-xl font-bold">${sum.toFixed(2)}</dd>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow">
          <dt className="text-lg font-semibold">Average</dt>
          <dd className="text-xl font-bold">${mean.toFixed(2)}</dd>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow">
          <dt className="text-lg font-semibold">Min. Amount</dt>
          <dd className="text-xl font-bold">${minAmount.toFixed(2)}</dd>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow">
          <dt className="text-lg font-semibold">Max. Amount</dt>
          <dd className="text-xl font-bold">${maxAmount.toFixed(2)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default ExpenseStatistics;
