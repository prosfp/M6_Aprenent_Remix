import bcrypt from "bcrypt";
import supabase from "../utils/supabaseClient";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { SignupInput } from "../types/interfaces";

// Obtenim el secret de la sessió de les variables d'entorn (.env)
const SESSION_SECRET = process.env.SESSION_SECRET;

// Per generar el hash de la contrasenya
const SALT_ROUNDS = 12;

// Creem una nova instància de CookieSessionStorage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production", // Només HTTPS en desenvolupament
    secrets: [SESSION_SECRET], // Array de secrets per a signar les cookies
    name: "supabaseSession", // Nom de la cookie
    sameSite: "lax", // Protecció contra CSRF
    maxAge: 30 * 24 * 60 * 60, // 30 dies
    httpOnly: true, // No accessible via JavaScript
  },
});

// No cal exportar-la ja que la farem servir aquí únicament.
async function createUserSession(userId: string, redirectPath: string) {
  // Obtenir la sessió actual o crear-ne una nova
  const session = await sessionStorage.getSession();

  // Estableix l'identificador d'usuari dins de la sessió
  session.set("userId", userId);

  // Retorna una redirecció a la ruta especificada amb la sessió a les capçaleres
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session), // Guarda i retorna la cookie
    },
  });
}

// Funció per obtenir la sessió de l'usuari
export async function getUserFromSession(request: Request) {
  // En aquest cas li passem la cookie de la petició
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  // Obtenim l'identificador de l'usuari de la sessió
  const userId = session.get("userId") as string;

  if (!userId) {
    // Si no hi ha cap identificador d'usuari, retornem null
    return null;
  }

  return userId;
}

// Funció per tancar la sessió de l'usuari
export async function destroyUserSession(request: Request) {
  // Obtenim la cookie de sessió a través de les capçaleres de la petició
  // i amb la Cookie obtenim l'objecte de sessió --> sessionStorage
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  // Generem una cookie buida per remplaçar la cookie actual al navegador
  // Redirigim l'usuari a la pàgina principal
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// Funció per comprovar si l'usuari està autenticat
export async function requireUserSession(request: Request) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    // Si no hi ha cap identificador d'usuari, redirigim a la pàgina d'autenticació
    throw redirect("/auth?mode=login");
  }

  return userId;
}

// Funció per registrar un nou usuari
export async function signup({ email, password }: SignupInput) {
  // 1. Comprovar si l'usuari ja existeix a la base de dades
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  console.log("existingUser", existingUser);

  if (existingUser) {
    const error = new Error(
      "A user with the provided email address exists already.",
    );
    (error as any).status = 422; // Afegim status per gestionar-ho després
    throw error;
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
  //return newUser;
  return createUserSession(newUser.id, "/expenses");
}

// Funció per autenticar un usuari
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

  // 3. Crear la sessió de l'usuari
  return createUserSession(existingUser.id, "/expenses"); // Redirecció a la pàgina d'Expenses
}
