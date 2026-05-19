import React from "react";
import { Clock3, ShieldCheck, Ticket } from "lucide-react";
import StudioStrip from "../StudioStrip/StudioStrip.jsx";
import StatsGrid from "./StatsGrid.jsx";
import FeaturePoint from "./FeaturePoint.jsx";

const points = [
  {
    icon: Clock3,
    title: "Fast discovery",
    description: "Find what to watch without fighting clutter.",
  },
  {
    icon: Ticket,
    title: "Smooth booking",
    description: "Pick the show and move to seats with less friction.",
  },
  {
    icon: ShieldCheck,
    title: "Clean experience",
    description: "Simple, polished screens that feel easy to trust.",
  },
];

const stats = [
  { value: "10K+", label: "bookings" },
  { value: "100+", label: "movies" },
  { value: "24/7", label: "access" },
];

const AboutSection = () => {
  return (
    <section
      data-reveal
      className="relative w-full px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 xl:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            About Us
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:mt-4 sm:text-base">
            ShowMovie is built to keep movie discovery and ticket booking simple,
            smooth, and easy to enjoy.
          </p>
        </div>

        <div className="mt-8 rounded-4xl border border-white/10 bg-white/2 p-6 backdrop-blur-sm sm:p-8 lg:mt-10 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300 sm:text-sm">
                Why ShowMovie
              </p>

              <h3 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                Movie booking made simple, fast, and more enjoyable.
              </h3>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                ShowMovie is built to keep the experience clear from start to
                finish, so users can discover films, choose a show, and book
                seats without extra noise.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-100">
                  Clean browsing
                </span>
                <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm text-gray-200">
                  Easy booking
                </span>
                <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm text-gray-200">
                  Better flow
                </span>
              </div>

              <StatsGrid stats={stats} />
            </div>

            <div className="space-y-4">
              {points.map((point) => (
                <FeaturePoint key={point.title} point={point} />
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-white/8 pt-6 sm:pt-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Trusted Studio Names
            </p>
            <StudioStrip variant="card" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;