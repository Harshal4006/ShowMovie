const FormButtons = ({ isEditing, onClear }) => {
  return (
    <div className="flex gap-4 pt-4">
      <button
        type="submit"
        className="flex-1 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        {isEditing ? "Update Show" : "Add Show"}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-gray-300 hover:bg-gray-800"
      >
        Clear Form
      </button>
    </div>
  );
};

export default FormButtons;