import React from 'react';
import { MapPin, Clock, Phone, Mail, Monitor } from 'lucide-react';

const TheaterDetailsInfo = ({ theater }) => {
  const items = [
    { icon: MapPin, label: "Address", value: `${theater.location}, ${theater.city}` },
    { icon: Clock, label: "Opening Hours", value: theater.openingHours || "10:00 AM - 11:45 PM" },
    { icon: Phone, label: "Phone", value: theater.contactNumber || "+91 22 1234 5678" },
    { icon: Mail, label: "Email", value: theater.email || `info@${theater.name?.toLowerCase().replace(/\s+/g, "")}.com` },
    { icon: Monitor, label: "Total Screens", value: `${theater.screens} Screens` },
  ];

  return (
    <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 sm:p-6" style={{ animationDelay: "200ms" }}>
      <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-white">Theater Information</h2>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-sm text-gray-400 break-words">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterDetailsInfo;
