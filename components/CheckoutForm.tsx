import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CheckCircle } from "lucide-react";

export default function CheckoutForm({ order }: { order: any }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not ready yet.");
      return;
    }

    setLoading(true);

    try {
      // 1. CREATE PaymentIntent on the server
      const encodedMeta = btoa(
        JSON.stringify({
          platform: order.platform,
          service: order.service,
          quantity: order.amount,
          reference: order.reference,
          total: order.total,
          email: order.email,
        })
      );

      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(order.total * 100),
          metadata: { order: encodedMeta },
        }),
      });

      const { clientSecret, error: serverErr } = await res.json();
      if (!clientSecret) throw new Error(serverErr || "Payment failed.");

      // 2. CONFIRM payment using Stripe.js (not REST API!)
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: "https://checkout.yesviral.com/checkout/success",
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed.");
      }
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-lg mx-auto flex flex-col gap-8
        bg-white/80 backdrop-blur-xl rounded-3xl
        p-7 border border-[#CFE4FF]
        shadow-[0_20px_80px_rgba(0,123,255,0.15)]
      "
    >
      {/* ORDER SUMMARY */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-[#007BFF]">Order Summary</h3>

        <SummaryRow label="Package" value={order.package || order.service} />
        <SummaryRow label="Platform" value={order.platform} />
        <SummaryRow label="Amount" value={order.amount.toLocaleString()} />
        <SummaryRow label="Username / Link" value={order.reference} />

        <div className="flex justify-between text-lg font-black border-t pt-3 border-[#E4EEFF]">
          <span>Total</span>
          <span className="text-[#007BFF]">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* CARD INPUTS */}
      <div
        className="
          bg-[#F9FBFF] border border-[#CFE4FF]
          rounded-2xl p-5 space-y-5
          shadow-[0_3px_12px_rgba(0,123,255,0.07)]
        "
      >
        <label className="text-sm font-bold text-[#005FCC] uppercase">
          Payment Details
        </label>

        <PaymentElement />
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      {/* PAY BUTTON */}
      <button
        disabled={loading || !stripe || !elements}
        className="
          w-full py-4 rounded-xl text-white font-bold text-lg
          bg-gradient-to-r from-[#007BFF] to-[#005FCC]
          hover:shadow-[0_8px_28px_rgba(0,123,255,0.45)]
          transition-all disabled:opacity-40
        "
      >
        {loading ? "Processing..." : "Complete Payment"}
      </button>

      {/* LEGAL + GUARANTEE */}
      <div className="space-y-3 mt-1">
        <div className="text-[11px] leading-relaxed text-center text-[#6B7280] px-2">
          By completing your purchase, you agree to our{" "}
          <a
            href="https://yesviral.com/terms"
            className="text-[#007BFF] underline hover:text-[#005FCC] transition"
          >
            Terms of Service
          </a>
          ,{" "}
          <a
            href="https://yesviral.com/privacy"
            className="text-[#007BFF] underline hover:text-[#005FCC] transition"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://yesviral.com/refunds"
            className="text-[#007BFF] underline hover:text-[#005FCC] transition"
          >
            Refund Policy
          </a>
          .
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#4B5563] mt-1">
          <CheckCircle size={13} className="text-[#22C55E]" />
          <span>30-Day Refill Guarantee • 24/7 Priority Support</span>
        </div>
      </div>
    </form>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm text-[#333]">
      <span className="font-medium text-[#6B7A90]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
