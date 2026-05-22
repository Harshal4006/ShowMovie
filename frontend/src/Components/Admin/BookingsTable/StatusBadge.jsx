import { CheckCircle, XCircle, Clock } from "lucide-react";

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle, className: "bg-green-500/10 text-green-400 border border-green-500/20" },
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-500/10 text-red-400 border border-red-500/20" },
  refunded: { label: "Refunded", icon: XCircle, className: "bg-gray-500/10 text-gray-400 border border-gray-500/20" },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: "bg-gray-500/10 text-gray-400 border border-gray-500/20" };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {Icon && <Icon size={12} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
