import React from 'react';
import { Ticket } from 'lucide-react';

const SeatsCard = ({ seats = [] }) => {
  const totalSeats = seats.length;

  return (
    <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-red-400" />
          Selected Seats
        </h3>
        <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300">
          {totalSeats} seats
        </span>
      </div>

      {totalSeats > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {seats.map((seat, index) => (
            <div
              key={index}
              className="relative p-4 rounded-xl bg-[#0f1117] border border-white/10 flex items-center justify-center group hover:border-red-500/50 transition-all duration-300"
            >
              <span className="text-xl font-bold text-white">{seat}</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center py-4">No seats selected</p>
      )}

      <div className="pt-4 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Your seats are reserved for the next 15 minutes
        </p>
      </div>
    </div>
  );
};

export default SeatsCard;
