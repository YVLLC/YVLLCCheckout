import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const cardStyle = {
  style: {
    base: {
      fontSize: "18px",
      fontWeight: 600,
      fontFamily: "Inter, system-ui",
      color: "#111",
      "::placeholder": { color: "#9BB3DA" },
    },
    invalid: { color: "#EF4444" },
  },
};

export default function CheckoutForm({ order }: { order: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [brand, setBrand] = useState("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🔥 Detect Card Brand in Real-Time */
  const handleCardBrand = (event: any) => {
    setBrand(event.brand || "unknown");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      const { clientSecret, error: serverErr } = await res.json();
      if (!clientSecret) throw new Error(serverErr || "Payment failed.");

      const num = elements?.getElement(CardNumberElement);
      if (!stripe || !num) throw new Error("Stripe failed to load.");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: num },
      });

      if (result.error) throw new Error(result.error.message);
      window.location.href = "/checkout/success";
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  /** 🔥 Card brand → SVG path */
  const brandIcon = `/card-brands/${brand}.svg`;

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
          rounded-2xl p-5 space-y-4
          shadow-[0_3px_12px_rgba(0,123,255,0.07)]
        "
      >
        <label className="text-sm font-bold text-[#005FCC] uppercase">
          Card Information
        </label>

        {/* Brand Icon Row */}
        <div className="flex items-center gap-3 mb-1">
          <img src={brandIcon} className="h-7 w-auto" />
          <span className="text-xs text-[#6B7280] font-medium">
            {brand === "unknown" ? "Enter card number" : brand.toUpperCase()}
          </span>
        </div>

        {/* Card Number */}
        <div className="ys-card-box">
          <CardNumberElement options={cardStyle} onChange={handleCardBrand} />
        </div>

        {/* Exp + CVC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="ys-card-box">
            <CardExpiryElement options={cardStyle} />
          </div>
          <div className="ys-card-box">
            <CardCvcElement options={cardStyle} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full shadow-[0_0_5px_#22C55E]" />
          256-bit encrypted • Secured by Stripe
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      {/* BUTTON */}
      <button
        disabled={loading}
        className="
          w-full py-4 rounded-xl text-white font-bold text-lg
          bg-gradient-to-r from-[#007BFF] to-[#005FCC]
          hover:shadow-[0_8px_28px_rgba(0,123,255,0.45)]
          transition-all disabled:opacity-40
        "
      >
        {loading ? "Processing..." : "Complete Payment"}
      </button>

      <style jsx>{`
        .ys-card-box {
          background: white;
          border: 1px solid #cfe4ff;
          padding: 14px 18px;
          border-radius: 14px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
        }
        .ys-card-box:focus-within {
          border-color: #007bff;
          box-shadow: 0 0 0 4px #e6f0ff;
        }
      `}</style>
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
