
const HelpSection = () => {
  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white">Need help?</h3>
      <p className="mt-2 text-sm text-gray-400">
        If you have any issues with your bookings, please contact our support team at{" "}
        <a href="mailto:support@showmovie.com" className="text-red-400 hover:underline">
          support@showmovie.com
        </a>
        . You can also cancel or modify bookings up to 24 hours before the show.
      </p>
    </div>
  );
};

export default HelpSection;