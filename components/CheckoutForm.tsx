import { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm({ order }: { order: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const encodedMeta = btoa(
        JSON.stringify({
          platform: order.platform,
          service: order.service,
          quantity: order.amount,
          reference: order.reference,
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

      const { clientSecret, error: serverError } = await res.json();
      if (serverError || !clientSecret) throw new Error(serverError || "Payment failed.");

      const cardElement = elements?.getElement(CardElement);
      if (!stripe || !elements || !cardElement)
        throw new Error("Stripe failed to load.");

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) throw new Error(stripeError.message);

      window.location.href = "/checkout/success";
    } catch (e: any) {
      setError(e.message || "Payment error.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-lg mx-auto flex flex-col gap-8
        bg-white/80 backdrop-blur-xl rounded-3xl
        p-7 border border-[#DCE8FF]
        shadow-[0_20px_80px_rgba(0,123,255,0.12)]
      "
    >

      {/* ORDER SUMMARY */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-[#007BFF]">
          Order Summary
        </h3>

        <SummaryRow label="Package" value={order.package || order.service} />
        <SummaryRow label="Platform" value={order.platform} />
        <SummaryRow label="Amount" value={order.amount.toLocaleString()} />
        <SummaryRow label="Username / Link" value={order.reference} />

        <div className="flex justify-between text-lg font-black border-t pt-3 border-[#E4EEFF]">
          <span>Total</span>
          <span className="text-[#007BFF]">${order.total.toFixed(2)}</span>
        </div>
      </div>


      {/* CARD ELEMENT */}
      <div
        className="
          bg-[#F9FBFF] border border-[#CFE4FF]
          rounded-2xl p-5 space-y-3
          shadow-[0_3px_12px_rgba(0,123,255,0.07)]
        "
      >
        <label className="text-sm font-bold text-[#005FCC] uppercase">
          Card Information
        </label>

        <div
          className="
            bg-white border border-[#CFE4FF] rounded-xl
            px-4 py-4 shadow-inner
            focus-within:border-[#007BFF]
            focus-within:ring-4 focus-within:ring-[#E6F0FF]
            transition-all
          "
        >
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111",
                  "::placeholder": { color: "#A6B9D9" },
                },
                invalid: { color: "#EF4444" },
              },
            }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full shadow-[0_0_6px_#22C55E]" />
          256-bit encrypted • Secured by Stripe
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      {/* PAY BUTTON */}
      <button
        disabled={loading}
        className="
          w-full py-4 rounded-xl text-white font-bold text-lg
          bg-[#007BFF] hover:bg-[#005FCC] transition-all
          shadow-[0_6px_20px_rgba(0,123,255,0.25)]
          disabled:opacity-40
        "
      >
        {loading ? "Processing..." : "Complete Payment"}
      </button>
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
