import { Expense } from "../types/interfaces";

type ValidationErrors = {
  title?: string;
  amount?: string;
  date?: string;
};

function isValidTitle(value: string): boolean {
  return value.trim().length > 0 && value.trim().length <= 30;
}

function isValidAmount(value: string): boolean {
  const amount = parseFloat(value);
  return !isNaN(amount) && amount > 0;
}

function isValidDate(value: string): boolean {
  return new Date(value).getTime() < new Date().getTime();
}

export function validateExpenseInput(input: Expense): void {
  // Ens generem un objecte on acabarem posant totes les validacions que fallin
  const validationErrors: ValidationErrors = {};

  if (!isValidTitle(input.title)) {
    validationErrors.title =
      "Invalid expense title. Must be at most 30 characters long.";
  }

  if (!isValidAmount(input.amount.toString())) {
    validationErrors.amount =
      "Invalid amount. Must be a number greater than zero.";
  }

  if (!isValidDate(input.date.toISOString())) {
    validationErrors.date = "Invalid date. Must be a date before today.";
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}
