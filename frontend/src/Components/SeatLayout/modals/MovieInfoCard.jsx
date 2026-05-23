import { memo } from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

const MovieInfoCard = ({
  movieTitle = 'Spider-Man: Brand New Day',
  showDate = 'Sat, Aug 1, 2026',
  showTime = '10:30 PM',
  theater = 'Standard Theater',
  showTicketIcon = false,
}) => {
  return (
    <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">{movieTitle}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Calendar className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-white font-medium">{showDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Time</p>
                <p className="text-white font-medium">{showTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 rounded-lg bg-red-500/20">
                <MapPin className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Theater</p>
                <p className="text-white font-medium">{theater}</p>
              </div>
            </div>
          </div>
        </div>
        {showTicketIcon && (
          <div className="hidden md:block">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600">
              <Ticket className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MemoMovieInfoCard = memo(MovieInfoCard);
MemoMovieInfoCard.displayName = "MovieInfoCard";
export default MemoMovieInfoCard;
