import { Link } from "react-router-dom";
import { X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/theaters", label: "Theaters" },
  { to: "/releases", label: "Releases" },
  { to: "/favorite", label: "Favorite" },
];

const MobileMenu = ({ isOpen, onClose }) => (
  <div
    className={`fixed top-0 left-0 flex h-screen w-full flex-col items-center justify-center gap-6 bg-black/90 px-6 text-base font-medium text-white backdrop-blur transition-transform duration-300 sm:gap-8 sm:text-lg ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
  >
    <X
      onClick={onClose}
      className="absolute top-5 right-5 h-6 w-6 cursor-pointer sm:top-6 sm:right-6 sm:h-7 sm:w-7"
      aria-label="Close menu"
    />

    {links.map(({ to, label }) => (
      <Link
        key={to}
        to={to}
        className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
        onClick={onClose}
      >
        {label}
      </Link>
    ))}
  </div>
);

export default MobileMenu;
