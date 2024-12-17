import AuthForm from "../components/auth/AuthForm";
import type { ActionFunctionArgs } from "@remix-run/node";

export default function AuthPage() {
  return (
    <div className="container mx-auto p-4">
      <AuthForm />
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validacions

  // Gestió amb les dades

  if (authMode === "login") {
    // Autenticació (login)
  } else {
    // Creació d'usuari (signup)
  }

  return {};
}
