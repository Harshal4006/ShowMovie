import React from 'react';
import { Shield, IndianRupee } from 'lucide-react';

const PaymentSummaryCard = ({
  totalSeats = 0,
  showPrice = 59,
  subtotal = 0,
  convenienceFee = 2.99,
  tax = 0,
  total = 0,
  rupeeSize = 14,
  totalRupeeSize = 14,
}) => {
  return (
    <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-red-400" />
        Payment Summary
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Tickets ({totalSeats} × <IndianRupee size={rupeeSize} className="inline self-center" />{showPrice})</span>
          <span className="text-white font-semibold"><IndianRupee size={rupeeSize} className="inline self-center" />{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Convenience Fee</span>
          <span className="text-white font-semibold"><IndianRupee size={rupeeSize} className="inline self-center" />{convenienceFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Tax (8%)</span>
          <span className="text-white font-semibold"><IndianRupee size={rupeeSize} className="inline self-center" />{tax.toFixed(2)}</span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-lg font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-red-400">
            <IndianRupee size={totalRupeeSize} className="inline self-center" />{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
