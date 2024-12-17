import AuthForm from "../components/auth/AuthForm";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { validateCredentials } from "../data/validations.server";
import { login, signup } from "../data/auth.server";

export default function AuthPage() {
  return (
    <div className="container mx-auto p-4">
      <AuthForm />
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log("formData", formData);

  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validacions
  try {
    validateCredentials({ email, password });
  } catch (error) {
    return error;
  }

  // Gestió amb les dades
  try {
    if (authMode === "login") {
      // Autenticació (login)
      return await login({ email, password });
    } else {
      // Creació d'usuari (signup)
      return await signup({ email, password });
    }
  } catch (error) {
    if (error.status === 422) {
      // retornem 'Data' a l'Action per tal que ho pugui mostrar també com abans amb la Validació.
      return { credentials: error.message };
    }
  }

  return {};
}
