import { Link, useSearchParams } from "@remix-run/react";
import { FaLock, FaUserPlus } from "react-icons/fa";

function AuthForm() {
  // useSearchParams em retorna un array amb el primer element com a objecte amb
  // els paràmetres de cerca. El segon no el necessito ja que seria per a
  // manipular els paràmetres de cerca.
  const [searchParams] = useSearchParams();
  // Si no hi ha paràmetre "mode" al query, per defecte serà login.
  const authMode = searchParams.get("mode") || "login";

  // Ens fem un ternari per a canviar el text del botó i el link
  const submitBtnCaption = authMode === "login" ? "Login" : "Create User";
  // Ens fem un ternari per a canviar el text del link
  const toggleBtnCaption =
    authMode === "login" ? "Create a New User" : "Log in with existing user";

  return (
    <form
      method="post"
      className="bg-indigo-100 p-5 rounded-lg shadow-md max-w-md mx-auto"
      id="auth-form"
    >
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-200 text-2xl text-indigo-600">
          {authMode === "login" ? <FaLock /> : <FaUserPlus />}
        </div>
      </div>
      <p>
        <label htmlFor="email" className="block mb-2 text-indigo-600 font-bold">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full p-2 rounded border border-gray-300 mb-5"
        />
      </p>
      <p>
        <label
          htmlFor="password"
          className="block mb-2 text-indigo-600 font-bold"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          minLength={7}
          className="w-full p-2 rounded border border-gray-300 mb-5"
        />
      </p>
      <div className="text-center">
        <button className="rounded bg-indigo-600 px-4 py-2 text-white">
          {submitBtnCaption}
        </button>
        <Link
          // També hem hagut de fer ús del ternari per canviar el link com a tal!
          to={authMode === "login" ? "?mode=signup" : "?mode=login"}
          className="mt-3 block text-indigo-600"
        >
          {toggleBtnCaption}
        </Link>
      </div>
    </form>
  );
}

export default AuthForm;
