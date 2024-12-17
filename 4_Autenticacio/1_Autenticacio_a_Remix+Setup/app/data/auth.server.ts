import bcrypt from "bcrypt";
import supabase from "../utils/supabaseClient";

const SALT_ROUNDS = 12;

interface SignupInput {
  email: string;
  password: string;
}

export async function signup({ email, password }: SignupInput) {
  // 1. Comprovar si l'usuari ja existeix a la base de dades
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (findError && findError.code !== "PGRST116") {
    // Error inesperat en la cerca (excloem "no rows found")
    throw new Error("Error checking for existing user.");
  }

  if (existingUser) {
    const error = new Error(
      "A user with the provided email address exists already.",
    );
    (error as any).status = 422; // Afegim status per gestionar-ho després
    throw Response.json(error);
  }

  // 2. Hash de la contrasenya
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Crear l'usuari a la base de dades
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ email, password: passwordHash }])
    .select("id, email")
    .single();

  if (insertError) {
    throw new Error(`Failed to create user: ${insertError.message}`);
  }

  // 4. Retornar la informació del nou usuari
  return newUser;
}
