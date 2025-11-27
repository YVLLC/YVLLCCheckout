import { CheckCircle } from "lucide-react";

export default function OrderSummary({ order }: { order: any }) {
  if (!order) return null;

  const {
    package: pkg = "Premium Package",
    type = "Standard",
    amount = order.amount || order.quantity || "--",
    reference = order.reference || "—",
    total = order.total,
  } = order;

  return (
    <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-[#DCE8FF] rounded-2xl shadow-[0_6px_30px_rgba(0,123,255,0.08)] p-6 space-y-5">
      
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <CheckCircle size={24} className="text-[#22C55E]" />
        <span className="text-xl font-bold text-[#007BFF] tracking-tight">
          Order Summary
        </span>
      </div>

      {/* SUMMARY CONTENT */}
      <div className="space-y-3">
        <SummaryRow label="Package" value={pkg} />
        <SummaryRow label="Type" value={type} />
        <SummaryRow label="Amount" value={amount} />
        <SummaryRow label="Username / Link" value={reference} />
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center border-t border-[#E4EEFF] pt-4">
        <span className="text-lg font-semibold text-[#333]">Total</span>
        <span className="text-2xl font-black text-[#007BFF]">
          ${typeof total === "number" ? total.toFixed(2) : "--"}
        </span>
      </div>

    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#6B7A90] font-medium">{label}</span>
      <span className="text-[#111] font-semibold">{value}</span>
    </div>
  );
}
