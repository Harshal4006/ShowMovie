const PaymentMethods = () => {
  const methods = [
    { method: "Credit Card", percentage: 45, color: "bg-blue-500" },
    { method: "Debit Card", percentage: 25, color: "bg-green-500" },
    { method: "UPI", percentage: 15, color: "bg-purple-500" },
    { method: "PayPal", percentage: 10, color: "bg-yellow-500" },
    { method: "Net Banking", percentage: 5, color: "bg-gray-500" },
  ];

  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
      <div className="space-y-3">
        {methods.map((item) => (
          <div key={item.method} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{item.method}</span>
              <span className="font-medium">{item.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg bg-gray-800/50">
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-300">Insight:</span> Credit card is the most popular payment method.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;