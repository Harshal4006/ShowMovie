import { AlertCircle, ChevronRight } from 'lucide-react';

const ImportantInfoCard = () => {
  return (
    <div className="rounded-[1.9rem] border border-red-500/20 bg-red-500/5 p-6">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Important Information</h3>
          <ul className="space-y-2 text-sm text-red-300/80">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Tickets are non-refundable</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Arrive at least 15 minutes before showtime</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Present booking confirmation at the counter</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Seats will be released 10 minutes after showtime</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantInfoCard;
