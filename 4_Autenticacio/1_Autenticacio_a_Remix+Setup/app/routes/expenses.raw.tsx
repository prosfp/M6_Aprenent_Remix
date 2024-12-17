interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

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

export async function loader(): Promise<{ expenses: Expense[] }> {
  return { expenses: DUMMY_EXPENSES };
}
