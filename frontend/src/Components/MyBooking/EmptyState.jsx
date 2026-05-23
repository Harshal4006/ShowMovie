
const EmptyState = ({ filter }) => {
  const messages = {
    all: "You haven't made any bookings yet. Start by exploring movies and booking seats!",
    paid: "You don't have any paid bookings.",
    pending: "You don't have any pending bookings.",
  };

  return (
    <div className="mt-10 rounded-4xl border border-white/10 bg-white/4 px-6 py-12 text-center backdrop-blur-sm">
      <h2 className="text-2xl font-semibold text-white">No bookings found</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
        {messages[filter] || messages.all}
      </p>
      <div className="mt-6">
        <a
          href="/movies"
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,68,68,0.24)] transition duration-300 hover:bg-red-400"
        >
          Browse Movies
        </a>
      </div>
    </div>
  );
};

export default EmptyState;