import { Link, useNavigate } from "react-router-dom";
import { Bell, X, Menu, TicketPlus } from "lucide-react";
import { useState } from "react";
import "./Navbar.css";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const NavItem = ({ text, to }) => (
  <Link
    to={to}
    className="relative h-6 overflow-hidden group cursor-pointer"
  >
    <span className="block text-white transition-transform duration-300 group-hover:-translate-y-full">
      {text}
    </span>
    <span className="absolute left-0 top-full block text-red-600 transition-transform duration-300 group-hover:-translate-y-full">
      {text}
    </span>
  </Link>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // mobile menu controls
  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleMobileClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between gap-3 px-4 py-3 backdrop-blur sm:px-6 sm:py-4 md:px-10 lg:px-14 xl:px-24 2xl:px-36">
      <Link to="/" className="inline-block shrink-0">
        <span className="animate-gradient bg-linear-to-r from-black via-red-600 to-black bg-size-[200%_200%] bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-2xl md:text-3xl">
          ShowMovie
        </span>
      </Link>

      <div className="hidden xl:flex items-center gap-6 px-5 py-3 text-sm font-medium text-white 2xl:gap-8 2xl:px-6 md:text-base">
        <NavItem text="Home" to="/" />
        <NavItem text="Movies" to="/movies" />
        <NavItem text="Theaters" to="/" />
        <NavItem text="Releases" to="/" />
        <NavItem text="Favorite" to="/favorite" />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
        <Bell
          className="hidden h-5 w-5 cursor-pointer text-red-800 transition hover:scale-110 xl:block 2xl:h-6 2xl:w-6"
          aria-label="Notifications"
        />

        <SignedOut>
          <SignInButton mode="modal">
            <button className="whitespace-nowrap rounded-full  bg-red-600 px-4 py-2 text-xs font-medium text-white transition duration-300 hover:bg-red-400 hover:text-white sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:text-base">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 sm:w-9 sm:h-9",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus size={16} />}
                onClick={() => navigate("/my-booking")}
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>

        <Menu
          onClick={openMenu}
          className="h-6 w-6 cursor-pointer text-red-800 sm:h-7 sm:w-7 xl:hidden"
          aria-label="Open menu"
        />
      </div>

      <div
        className={`fixed top-0 left-0 flex h-screen w-full flex-col items-center justify-center gap-6 bg-black/90 px-6 text-base font-medium text-white backdrop-blur transition-transform duration-300 sm:gap-8 sm:text-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <X
          onClick={closeMenu}
          className="absolute top-5 right-5 h-6 w-6 cursor-pointer sm:top-6 sm:right-6 sm:h-7 sm:w-7"
          aria-label="Close menu"
        />

        <Link
          to="/"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Home
        </Link>
        <Link
          to="/movies"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Movies
        </Link>
        <Link
          to="/"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Theaters
        </Link>
        <Link
          to="/"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Releases
        </Link>
        <Link
          to="/favorite"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Favorite
        </Link>
      </div>
    </div>
  );
};

export default Navbar;