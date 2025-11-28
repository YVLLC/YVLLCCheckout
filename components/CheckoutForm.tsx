import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CheckCircle } from "lucide-react";

const cardStyle = {
  style: {
    base: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#111",
      fontFamily: "Inter, system-ui, -apple-system",
      "::placeholder": { color: "#9BB3DA" },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

export default function CheckoutForm({ order }: { order: any }) {
  const stripe = useStripe();
  const elements = useElements();

  const [brand, setBrand] = useState("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const numberEl = elements?.getElement(CardNumberElement);
      if (!stripe || !numberEl) throw new Error("Stripe not ready.");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: numberEl },
      });

      if (result.error) throw new Error(result.error.message);

      window.location.href = "/checkout/success";
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

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
          rounded-2xl p-5 space-y-5
          shadow-[0_3px_12px_rgba(0,123,255,0.07)]
        "
      >
        <label className="text-sm font-bold text-[#005FCC] uppercase">
          Card Information
        </label>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#DCE8FF] flex items-center justify-center shadow-sm">
            <img
              src={brandIcon}
              className="w-7 h-7 object-contain drop-shadow-sm opacity-90"
              alt={brand}
            />
          </div>

          <span className="text-sm text-[#6B7280] font-semibold tracking-wide">
            {brand === "unknown" ? "Enter card number" : brand.toUpperCase()}
          </span>
        </div>

        <div className="ys-card-box">
          <CardNumberElement options={cardStyle} onChange={handleCardBrand} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="ys-card-box">
            <CardExpiryElement options={cardStyle} />
          </div>
          <div className="ys-card-box">
            <CardCvcElement options={cardStyle} />
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#6B7280] pt-1">
          <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full shadow-[0_0_5px_#22C55E]" />
          Verified Safe Checkout • SSL Encrypted Transaction
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
          </a>
          {" "}and{" "}
          <a
            href="https://yesviral.com/terms"
            className="text-[#007BFF] underline hover:text-[#005FCC] transition"
          >
            Refund Policy
          </a>
          .
          <br />
          Orders begin processing instantly. Delivery varies by platform.
        </div>

        {/* CHECKMARK + GUARANTEE */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#4B5563] mt-1">
          <CheckCircle size={13} className="text-[#22C55E]" />
          <span>30-Day Refill Guarantee • 24/7 Priority Support</span>
        </div>
      </div>

      <style jsx>{`
        .ys-card-box {
          background: white;
          border: 1px solid #cfe4ff;
          padding: 14px 18px;
          border-radius: 14px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
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
