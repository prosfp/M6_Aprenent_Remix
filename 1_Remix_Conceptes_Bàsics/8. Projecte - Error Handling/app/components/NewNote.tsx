import { Form, useActionData, useNavigation } from "@remix-run/react";

function NewNote(): JSX.Element {
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();

  // useNavigation em permet, entre d'altres, saber si estem a la fase de submitting del formulari.
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form
      method="post"
      id="note-form"
      className="max-w-xl my-12 mx-auto p-8 rounded-lg bg-primary-100 shadow-md text-center"
    >
      {/* Mostra l'error retornat pel servidor */}
      {actionData?.error && (
        <p className="text-red-500 font-semibold mb-4">{actionData.error}</p>
      )}

      <p className="mb-4">
        <label htmlFor="title" className="block text-white font-semibold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full p-2 border border-green-300 rounded-md"
        />
      </p>
      <p className="mb-4">
        <label
          htmlFor="content"
          className="block text-white-700 font-semibold mb-2"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          required
          className="w-full p-2 border border-green-300 rounded-md"
        />
      </p>
      <div className="form-actions">
        <button
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-900"
        >
          {isSubmitting ? "Adding Note..." : "Add Note"}
        </button>
      </div>
    </Form>
  );
}

export default NewNote;
