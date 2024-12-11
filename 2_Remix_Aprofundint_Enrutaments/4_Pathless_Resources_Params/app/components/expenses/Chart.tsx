import ChartBar from "./ChartBar";

interface Expense {
  date: string;
  amount: number;
}

interface ChartProps {
  expenses: Expense[];
}

const Chart: React.FC<ChartProps> = ({ expenses }) => {
  const chartDataPoints = [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 0 },
    { label: "May", value: 0 },
    { label: "Jun", value: 0 },
    { label: "Jul", value: 0 },
    { label: "Aug", value: 0 },
    { label: "Sep", value: 0 },
    { label: "Oct", value: 0 },
    { label: "Nov", value: 0 },
    { label: "Dec", value: 0 },
  ];

  // Agreguem les dades de les despeses
  for (const expense of expenses) {
    const expenseMonth = new Date(expense.date).getMonth(); // Obtenim el mes
    chartDataPoints[expenseMonth].value += expense.amount;
  }

  const dataPointValues = chartDataPoints.map((dataPoint) => dataPoint.value);
  const totalMaximum = Math.max(...dataPointValues);

  return (
    <section className="max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-center mb-4">Monthly Expenses</h2>
      <div className="flex justify-between space-x-4">
        {chartDataPoints.map((dataPoint) => (
          <ChartBar
            key={dataPoint.label}
            value={dataPoint.value}
            maxValue={totalMaximum}
            label={dataPoint.label}
          />
        ))}
      </div>
    </section>
  );
};

export default Chart;
