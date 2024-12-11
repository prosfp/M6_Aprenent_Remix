import { FaLock } from "react-icons/fa";

function AuthForm() {
  return (
    <form
      method="post"
      className="bg-indigo-100 p-5 rounded-lg shadow-md max-w-md mx-auto"
      id="auth-form"
    >
      <div className="text-center mb-5 text-2xl text-indigo-600">
        <FaLock />
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
        <button className="bg-indigo-600 text-white py-2 px-4 rounded">
          Login
        </button>
        <a href="/auth" className="block mt-3 text-indigo-600">
          Log in with existing user
        </a>
      </div>
    </form>
  );
}

export default AuthForm;
