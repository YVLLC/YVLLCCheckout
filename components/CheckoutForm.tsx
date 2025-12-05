// components/CheckoutForm.tsx
import { useRef, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { supabase } from "@/lib/supabase";

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

  const brandRef = useRef("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, forceRerender] = useState({});

  const handleCardBrand = (event: any) => {
    brandRef.current = event.brand || "unknown";
    forceRerender({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not ready yet. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const encodedMeta = btoa(
        JSON.stringify({
          platform: order.platform,
          service: order.service,
          quantity: order.quantity,
          reference: order.reference,
          total: order.total,
          email: order.email || "",
        })
      );

      const { data: userData } = await supabase.auth.getUser();
      let userId: string | null = userData?.user?.id ?? null;

      if (!userId && typeof window !== "undefined") {
        const stored = localStorage.getItem("yv_uid");
        if (stored) userId = stored;
      }

      userId = userId || "";

      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(order.total * 100),
          metadata: {
            yesviral_order: encodedMeta,
            user_id: userId,
          },
          email: order.email || null,
          user_id: userId,
        }),
      });

      const { clientSecret, error: serverErr } = await res.json();

      if (!res.ok || !clientSecret) {
        throw new Error(serverErr || "Could not start payment. Try again.");
      }

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card input not found.");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email: order.email || undefined },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      if (result.paymentIntent?.status === "succeeded") {
        const successURL = `https://checkout.yesviral.com/checkout/success?platform=${encodeURIComponent(
          order.platform
        )}&service=${encodeURIComponent(
          order.service
        )}&quantity=${encodeURIComponent(
          order.quantity
        )}&total=${encodeURIComponent(order.total)}&ref=${encodeURIComponent(
          order.reference
        )}`;

        window.location.href = successURL;
        return;
      }

      throw new Error("Payment status unknown. Contact support if charged.");
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong with payment.");
    } finally {
      setLoading(false);
    }
  };

  const brandIcon = `/card-brands/${brandRef.current}.svg`;

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
      {/* SUMMARY */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-[#007BFF]">Order Summary</h3>

        <SummaryRow label="Package" value={order.package || order.service} />
        <SummaryRow label="Platform" value={order.platform} />
        <SummaryRow label="Amount" value={order.quantity.toLocaleString()} />
        <SummaryRow label="Username / Link" value={order.reference} />

        <div className="flex justify-between text-lg font-black border-t pt-3 border-[#E4EEFF]">
          <span>Total</span>
          <span className="text-[#007BFF]">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* CARD BOX */}
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
              className="w-7 h-7 object-contain opacity-90 drop-shadow-sm"
              alt={brandRef.current}
            />
          </div>

          <span className="text-sm text-[#6B7280] font-semibold tracking-wide">
            {brandRef.current === "unknown"
              ? "Enter card number"
              : brandRef.current.toUpperCase()}
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

        <div className="flex items-center justify-center gap-2 text-xs text-[#6B7280] pt-1">
          <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full shadow-[0_0_5px_#22C55E]" />
          Verified Safe Checkout • SSL Encrypted
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center font-semibold">
          {error}
        </div>
      )}

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

      {/* ⭐⭐⭐ ADDED BACK: YESVIRAL BENEFITS SECTION (PREMIUM AF) ⭐⭐⭐ */}
      <div className="mt-2 grid grid-cols-3 gap-3 text-center text-[11px] font-semibold text-[#555]">
        <div className="p-2 rounded-lg bg-[#F9FBFF] border border-[#CFE4FF]">
          ⚡ Instant Start
        </div>
        <div className="p-2 rounded-lg bg-[#F9FBFF] border border-[#CFE4FF]">
          🔒 30-Day Refill Included
        </div>
        <div className="p-2 rounded-lg bg-[#F9FBFF] border border-[#CFE4FF]">
          ⭐ Premium Quality
        </div>
      </div>

      {/* ⭐⭐⭐ ADDED BACK: LEGAL TEXT ⭐⭐⭐ */}
      <p className="text-[11px] text-center text-[#7A8BA3] leading-relaxed mt-1">
        By completing your purchase, you agree to YesViral’s{" "}
        <a
          href="https://yesviral.com/terms"
          className="text-[#007BFF] underline hover:text-[#005FCC]"
        >
          Terms & Conditions
        </a>
        ,{" "}
        <a
          href="https://yesviral.com/refund-policy"
          className="text-[#007BFF] underline hover:text-[#005FCC]"
        >
          Refund Policy
        </a>{" "}
        and{" "}
        <a
          href="https://yesviral.com/privacy-policy"
          className="text-[#007BFF] underline hover:text-[#005FCC]"
        >
          Privacy Policy
        </a>
        .
      </p>

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
