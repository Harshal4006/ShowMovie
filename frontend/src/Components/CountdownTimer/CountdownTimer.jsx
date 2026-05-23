import { useCallback, useEffect, useState } from "react";
import { Clock } from "lucide-react";

const CountdownTimer = ({ targetDate, title = "Next show starts in" }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate) - new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Show expired state if countdown finished
  if (timeLeft.expired) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-500/20 p-2">
            <Clock className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-200">Show has started</p>
            <p className="text-xs text-green-400">Booking available for next show</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm" role="timer" aria-label={title}>
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-red-400" />
        <p className="text-sm font-medium text-gray-200">{title}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="rounded-xl bg-white/10 py-2">
            <p className="text-2xl font-bold text-white">{timeLeft.days.toString().padStart(2, '0')}</p>
          </div>
          <p className="mt-1 text-xs text-gray-400">Days</p>
        </div>

        <div className="text-center">
          <div className="rounded-xl bg-white/10 py-2">
            <p className="text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</p>
          </div>
          <p className="mt-1 text-xs text-gray-400">Hours</p>
        </div>

        <div className="text-center">
          <div className="rounded-xl bg-white/10 py-2">
            <p className="text-2xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</p>
          </div>
          <p className="mt-1 text-xs text-gray-400">Minutes</p>
        </div>

        <div className="text-center">
          <div className="rounded-xl bg-white/10 py-2">
            <p className="text-2xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</p>
          </div>
          <p className="mt-1 text-xs text-gray-400">Seconds</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <p>Target: {new Date(targetDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p className="text-red-400">Live countdown</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
