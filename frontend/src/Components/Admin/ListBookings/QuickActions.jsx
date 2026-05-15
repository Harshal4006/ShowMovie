import toast from "react-hot-toast";

const QuickActions = ({ actions }) => {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
      <p className="text-sm text-gray-400 mb-4">Quick actions for common tasks.</p>
      <div className="space-y-2">
        {actions.map((a) => (
          <button
            key={a.key}
            onClick={() => toast.success(a.label + " feature coming soon!")}
            className="w-full rounded-lg bg-gray-800 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors text-left px-3"
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;