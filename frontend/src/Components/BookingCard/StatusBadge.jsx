import { CheckCircle, XCircle } from "lucide-react";

const StatusBadge = ({ isPaid }) => {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${
        isPaid
          ? "border-green-400/60 bg-green-500/25 text-green-200"
          : "border-yellow-400/60 bg-yellow-500/25 text-yellow-200"
      }`}
    >
      {isPaid ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      <span>{isPaid ? "Paid" : "Pending"}</span>
    </div>
  );
};

export default StatusBadge;