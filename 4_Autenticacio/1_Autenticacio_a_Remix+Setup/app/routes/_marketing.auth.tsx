import AuthForm from "../components/auth/AuthForm";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { validateCredentials } from "../data/validations.server";
import { signup } from "../data/auth.server";

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

  if (authMode === "login") {
    // Autenticació (login)
  } else {
    // Creació d'usuari (signup)
    signup({ email, password });
    return redirect("/expenses");
  }

  return {};
}
