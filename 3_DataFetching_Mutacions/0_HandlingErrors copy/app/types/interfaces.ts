export interface Expense {
  id?: string;
  title: string;
  amount: number;
  date: Date;
}

export type ValidationErrors = {
  title?: string;
  amount?: string;
  date?: string;
};

export type SignupInput = {
  email: string;
  password: string;
};
