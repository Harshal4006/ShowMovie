import React from "react";
import { Link } from "react-router-dom";
import { Clock3, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const socialClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-200 transition duration-200 hover:-translate-y-1 hover:border-red-500/60 hover:bg-red-500/20 hover:text-white";
  const linkClass =
    "block text-sm text-gray-300 transition duration-200 hover:translate-x-1 hover:text-white";

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_25%),linear-gradient(135deg,#050505_0%,#111111_45%,#1f1f1f_100%)] text-white">
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-4 text-center md:text-left">
              <Link to="/" className="inline-block">
                <span className="bg-linear-to-r from-white via-red-500 to-white bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                  ShowMovie
                </span>
              </Link>
              <p className="mx-auto max-w-sm text-sm leading-6 text-gray-300 md:mx-0">
                Book tickets faster, find your favorite shows, and plan movie nights
                without the usual rush.
              </p>
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <a
                  href="https://www.linkedin.com/in/harshal-mhaske-076741332"
                  aria-label="LinkedIn"
                  className={socialClass}
                >
                  <Linkedin size={18} />
                </a>
                <a href="https://www.instagram.com/_harsh_4006?igsh=MXQyNWxyYzBhMm9qYw==" aria-label="Instagram" className={socialClass}>
                  <Instagram size={18} />
                </a>
                <a
                  href="mailto:support@showmovie.com"
                  aria-label="Email"
                  className={socialClass}
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-[1.05rem] font-semibold text-white">Quick Links</h3>
              <div className="mt-4 flex flex-col items-center gap-3 text-sm text-gray-300 md:items-start">
                <Link to="/" className={linkClass}>Home</Link>
                <Link to="/movies" className={linkClass}>Movies</Link>
                <Link to="/favorite" className={linkClass}>Favorites</Link>
                <Link to="/my-booking" className={linkClass}>My Booking</Link>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-[1.05rem] font-semibold text-white">Support</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <p className="flex items-center justify-center gap-3 md:justify-start"><MapPin size={16} /> Chhatrapati Sambhajinagar, India</p>
                <p className="flex items-center justify-center gap-3 md:justify-start"><Phone size={16} /> +91 90000 00000</p>
                <p className="flex items-center justify-center gap-3 break-all md:justify-start md:break-normal"><Mail size={16} /> support@showmovie.com</p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-[1.05rem] font-semibold text-white">Show Times</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <p className="flex items-center justify-center gap-3 md:justify-start"><Clock3 size={16} /> Daily: 10:00 AM to 11:30 PM</p>
                <p className="leading-6">
                  Explore movies, pick your seats, and enjoy a smooth booking experience anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-gray-400 md:flex-row md:text-left">
            <p>Copyright 2026 ShowMovie. All rights reserved.</p>
            <p>Designed for movie lovers who never miss opening night.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
