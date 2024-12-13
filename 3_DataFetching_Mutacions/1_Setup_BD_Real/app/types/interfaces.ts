export interface Expense {
  title: string;
  amount: number;
  date: Date;
}

export type ValidationErrors = {
  title?: string;
  amount?: string;
  date?: string;
};
