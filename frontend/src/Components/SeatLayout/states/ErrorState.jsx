const ErrorState = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="rounded-4xl border border-white/10 bg-white/4 px-6 py-10 text-center backdrop-blur-sm sm:px-10">
      <p className="text-base font-semibold text-gray-100">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-100 transition hover:border-red-500/35 hover:bg-red-500/10"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;

