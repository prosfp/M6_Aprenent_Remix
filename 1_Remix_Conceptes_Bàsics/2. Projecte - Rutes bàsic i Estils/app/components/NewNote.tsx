function NewNote(): JSX.Element {
  return (
    <form
      method="post"
      id="note-form"
      className="max-w-xl my-12 mx-auto p-8 rounded-lg bg-primary-100 shadow-md text-center"
    >
      <p className="mb-4">
        <label htmlFor="title" className="block text-white font-semibold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
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
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </p>
      <div className="form-actions">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Add Note
        </button>
      </div>
    </form>
  );
}

export default NewNote;
