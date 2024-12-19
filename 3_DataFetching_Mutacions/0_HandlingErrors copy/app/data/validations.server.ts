// Tipus per a les dades
import { Expense } from "../types/interfaces";

// Tipus per als errors
type ValidationErrors = Record<string, string>;

// ----------------------------
// VALIDACIONS GENERALS
// ----------------------------

function isValidTitle(value: string): boolean {
  return value.trim().length > 0 && value.trim().length <= 30;
}

function isValidAmount(value: number): boolean {
  return !isNaN(value) && value > 0;
}

function isValidDate(value: Date): boolean {
  return value.getTime() < new Date().getTime();
}

function isValidEmail(value: string): boolean {
  return value.trim().includes("@");
}

function isValidPassword(value: string): boolean {
  return value.trim().length >= 7;
}

// ----------------------------
// VALIDACIÓ DE DESPESES
// ----------------------------

export function validateExpenseInput(input: Expense): void {
  const validationErrors: ValidationErrors = {};

  const amount = parseFloat(input.amount.toString());
  const date = new Date(input.date);

  // Validacions individuals
  if (!isValidTitle(input.title)) {
    validationErrors.title =
      "Invalid expense title. Must be at most 30 characters long.";
  }

  if (!isValidAmount(amount)) {
    validationErrors.amount =
      "Invalid amount. Must be a number greater than zero.";
  }

  if (!isValidDate(date)) {
    validationErrors.date = "Invalid date. Must be a date before today.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

// ----------------------------
// VALIDACIÓ DE CREDENCIALS
// ----------------------------

interface CredentialsInput {
  email: string;
  password: string;
}

export function validateCredentials(input: CredentialsInput): void {
  const validationErrors: ValidationErrors = {};

  // Validacions individuals
  if (!isValidEmail(input.email)) {
    validationErrors.email = "Invalid email address.";
  }

  if (!isValidPassword(input.password)) {
    validationErrors.password =
      "Invalid password. Must be at least 7 characters long.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}
