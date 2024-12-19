// auth.server.ts
import { SignupInput } from "../types/interfaces";
import supabase from "../utils/supabaseClient";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// SIGNUP
export async function signup({ email, password }: SignupInput) {
  // 1. Comprovar si l'usuari ja existeix a la taula 'users'
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    const error = new Error(
      "A user with the provided email address exists already.",
    );
    (error as any).status = 422; // Afegim status per gestionar-ho després
    throw error;
  }

  // 2. Hash de la contrasenya
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Inserir el nou usuari a la taula 'users'
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword }])
    .select("id, email")
    .single();

  if (insertError) {
    throw new Error(`Failed to create user: ${insertError.message}`);
  }

  // 4. Retornar la informació del nou usuari
  return newUser;
}

// LOGIN
export async function login({ email, password }: SignupInput) {
  // 1. Comprovem si l'usuari existeix
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // Si no existeix, tenim un "problema"
  if (!existingUser) {
    const error = new Error("Could not log in with the provided credentials.");
    (error as any).status = 401; // En el fons és un problema d'autenticació
    throw error;
  }

  // 2. Comprovar la contrasenya
  // Hem de gestionar el hash-password i no podem comparlar-lo directament.
  // Fem servir la funció compare de bcrypt per comparar-los.
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    const error = new Error("Could not log in with the provided credentials.");
    (error as any).status = 401; // Afegim status per gestionar-ho després
    throw error;
  }
}
