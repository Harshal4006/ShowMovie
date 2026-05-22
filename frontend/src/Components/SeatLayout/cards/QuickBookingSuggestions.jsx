import React from 'react';
import { Zap, Users, Star, Shield } from 'lucide-react';


 // Quick Booking Suggestions Component - Suggests optimal seat combinations based on theater layout

const QuickBookingSuggestions = ({
  rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  seatsPerRow = 10,
  occupiedSeats = new Set(),
  onSelectSuggestion,
  selectedSeats = [],
}) => {
  // Generate quick booking suggestions
  const generateSuggestions = () => {
    const suggestions = [];
    
    // Suggestion 1: Best view (middle seats, rows C-E)
    const bestViewSeats = [];
    const middleRows = rows.length >= 3 ? rows.slice(2, 5) : rows;
    const middleSeats = [4, 5, 6, 7]; // Seat indices (0-based)
    
    middleRows.forEach(row => {
      middleSeats.forEach(seatNum => {
        const seatId = `${row}${seatNum + 1}`;
        if (!occupiedSeats.has(seatId) && !selectedSeats.includes(seatId)) {
          bestViewSeats.push(seatId);
        }
      });
    });
    
    if (bestViewSeats.length >= 2) {
      suggestions.push({
        id: 'best-view',
        title: 'Best View',
        description: 'Center seats for optimal viewing experience',
        seats: bestViewSeats.slice(0, 4),
        icon: Star,
        color: 'from-amber-500 to-orange-500',
        badge: 'Premium',
      });
    }
    
    // Suggestion 2: Aisle seats for easy access
    const aisleSeats = [];
    const aisleRows = rows.length >= 3 ? rows.slice(3, 6) : rows;
    const leftAisle = 0; // Seat A1
    const rightAisle = seatsPerRow - 1; // Last seat
    
    aisleRows.forEach(row => {
      const leftSeat = `${row}${leftAisle + 1}`;
      const rightSeat = `${row}${rightAisle + 1}`;
      
      if (!occupiedSeats.has(leftSeat) && !selectedSeats.includes(leftSeat)) {
        aisleSeats.push(leftSeat);
      }
      if (!occupiedSeats.has(rightSeat) && !selectedSeats.includes(rightSeat)) {
        aisleSeats.push(rightSeat);
      }
    });
    
    if (aisleSeats.length >= 2) {
      suggestions.push({
        id: 'aisle-access',
        title: 'Easy Access',
        description: 'Aisle seats for quick entry/exit',
        seats: aisleSeats.slice(0, 3),
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        badge: 'Convenient',
      });
    }
    
    // Suggestion 3: Front row for immersive experience
    const frontRowSeats = [];
    const frontRows = rows.slice(0, 2);
    const frontSeats = [2, 3, 4, 5, 6, 7];
    
    frontRows.forEach(row => {
      frontSeats.forEach(seatNum => {
        const seatId = `${row}${seatNum + 1}`;
        if (!occupiedSeats.has(seatId) && !selectedSeats.includes(seatId)) {
          frontRowSeats.push(seatId);
        }
      });
    });
    
    if (frontRowSeats.length >= 2) {
      suggestions.push({
        id: 'front-row',
        title: 'Immersive',
        description: 'Front rows for larger-than-life experience',
        seats: frontRowSeats.slice(0, 4),
        icon: Zap,
        color: 'from-purple-500 to-pink-500',
        badge: 'Immersive',
      });
    }
    
    // Suggestion 4: Safety distance (skip one seat between groups)
    const safetySeats = [];
    const safetyRows = rows.length >= 4 ? rows.slice(2, 6) : rows;
    const safetyPattern = [1, 3, 5, 7]; // Skip seats between
    
    safetyRows.forEach(row => {
      safetyPattern.forEach(seatNum => {
        const seatId = `${row}${seatNum + 1}`;
        if (!occupiedSeats.has(seatId) && !selectedSeats.includes(seatId)) {
          safetySeats.push(seatId);
        }
      });
    });
    
    if (safetySeats.length >= 2) {
      suggestions.push({
        id: 'safety-distance',
        title: 'Spaced Out',
        description: 'Seats with comfortable spacing',
        seats: safetySeats.slice(0, 3),
        icon: Shield,
        color: 'from-green-500 to-emerald-500',
        badge: 'Safe',
      });
    }
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  };

  const suggestions = generateSuggestions();

  if (suggestions.length === 0) {
    return null;
  }

  const handleSuggestionClick = (suggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion.seats);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Booking Suggestions
        </h3>
        <span className="text-sm text-gray-400">AI-powered recommendations</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              aria-label={`Select ${suggestion.seats.length} seats: ${suggestion.title} - ${suggestion.description}`}
              className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] text-left"
            >
              {/* Badge */}
              <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${suggestion.color} text-white`}>
                {suggestion.badge}
              </div>
              
              {/* Icon */}
              <div className={`mb-3 p-2 rounded-lg bg-gradient-to-r ${suggestion.color} bg-opacity-10 w-fit`}>
                <Icon className="w-6 h-6" />
              </div>
              
              {/* Title & Description */}
              <h4 className="text-white font-semibold mb-1">{suggestion.title}</h4>
              <p className="text-sm text-gray-400 mb-3">{suggestion.description}</p>
              
              {/* Seats */}
              <div className="flex flex-wrap gap-1.5">
                {suggestion.seats.map((seat, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 rounded-md bg-gray-800 border border-gray-700 group-hover:border-gray-600"
                  >
                    <span className="text-xs font-medium text-white">{seat}</span>
                  </div>
                ))}
              </div>
              
              {/* Action Text */}
              <div className="mt-3 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                Click to select {suggestion.seats.length} seats
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/10 transition-colors" />
            </button>
          );
        })}
      </div>
      
      <p className="mt-3 text-xs text-gray-500">
        Suggestions are based on optimal viewing angles, accessibility, and available seating.
      </p>
    </div>
  );
};

export default QuickBookingSuggestions;
