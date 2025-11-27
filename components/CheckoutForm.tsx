import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

type CheckoutFormProps = {
  order: {
    platform: string;
    service: string;
    amount: number;
    reference: string;
    total: number;
    package?: string;
    type?: string;
  };
};

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      fontWeight: 500,
      color: "#111827",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      "::placeholder": {
        color: "#9CA3AF",
      },
      iconColor: "#007BFF",
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

export default function CheckoutForm({ order }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!order) throw new Error("Missing order details.");

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
      if (serverError || !clientSecret) {
        throw new Error(serverError || "Unable to create payment.");
      }

      const cardNumberElement = elements?.getElement(CardNumberElement);
      if (!stripe || !elements || !cardNumberElement) {
        throw new Error("Stripe is not ready yet. Try again.");
      }

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardNumberElement },
        }
      );

      if (stripeError) throw new Error(stripeError.message || "Payment failed.");

      window.location.href = "/checkout/success";
    } catch (err: any) {
      setError(err.message || "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pkg = order.package || `${order.service} Package`;
  const type = order.type || "High-Quality";

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto
        bg-white/80 backdrop-blur-xl
        rounded-3xl border border-[#CFE4FF]
        shadow-[0_24px_90px_rgba(0,123,255,0.18)]
        p-6 sm:p-8
        flex flex-col gap-8
        animate-fadeIn
      "
    >
      {/* TOP GLASS SUMMARY CARD */}
      <div
        className="
          w-full rounded-2xl
          bg-gradient-to-br from-[#007BFF] via-[#005FCC] to-[#001B4F]
          text-white
          p-5 sm:p-6
          shadow-[0_18px_55px_rgba(0,91,191,0.8)]
          flex flex-col gap-4
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            YesViral • Secure Checkout
          </span>
          <span className="text-[11px] font-semibold bg-white/15 px-2 py-1 rounded-full border border-white/25">
            256-bit SSL
          </span>
        </div>

        <div className="mt-1">
          <div className="text-[11px] text-white/60 mb-1">
            Estimated Charge
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            ${order.total.toFixed(2)}
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 text-[11px] sm:text-xs">
          <div className="space-y-0.5">
            <div className="uppercase text-white/60">Platform</div>
            <div className="font-semibold">
              {order.platform} • {order.service}
            </div>
          </div>
          <div className="space-y-0.5 text-right">
            <div className="uppercase text-white/60">Quantity</div>
            <div className="font-semibold">
              {order.amount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div
        className="
          w-full rounded-2xl
          bg-[#F5FAFF]
          border border-[#DCEBFF]
          p-4 sm:p-5
          space-y-3
        "
      >
        <SummaryRow label="Package" value={pkg} />
        <SummaryRow label="Type" value={type} />
        <SummaryRow label="Username / Link" value={order.reference} />

        <div className="flex items-center justify-between text-base pt-2 border-t border-[#E1EDFF] mt-1">
          <span className="font-semibold text-[#111]">Total</span>
          <span className="text-xl font-black text-[#007BFF]">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* PAYMENT SECTION WITH 3 STRIPE ELEMENTS */}
      <div
        className="
          w-full
          rounded-2xl
          bg-gradient-to-br from-[#F6FAFF] to-white
          border border-[#DDE8FF]
          p-5 sm:p-6
          shadow-[0_12px_38px_rgba(0,123,255,0.12)]
          space-y-5
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#005FCC] uppercase tracking-wide">
            Card Information
          </span>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="h-5 w-8 rounded-[6px] bg-[#1A1F71]" />
            <span className="h-5 w-8 rounded-[6px] bg-[#FF5F00]" />
            <span className="h-5 w-8 rounded-[6px] bg-black" />
          </div>
        </div>

        {/* Card Number */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
            Card Number
          </label>
          <div
            className="
              w-full bg-white border border-[#CFE4FF]
              rounded-xl px-4 py-3
              shadow-inner
              focus-within:border-[#007BFF]
              focus-within:ring-4 focus-within:ring-[#E5F0FF]
              transition-all
            "
          >
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        {/* Expiry + CVC Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
              Expiration
            </label>
            <div
              className="
                w-full bg-white border border-[#CFE4FF]
                rounded-xl px-4 py-3
                shadow-inner
                focus-within:border-[#007BFF]
                focus-within:ring-4 focus-within:ring-[#E5F0FF]
                transition-all
              "
            >
              <CardExpiryElement options={cardStyle} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
              CVC
            </label>
            <div
              className="
                w-full bg-white border border-[#CFE4FF]
                rounded-xl px-4 py-3
                shadow-inner
                focus-within:border-[#007BFF]
                focus-within:ring-4 focus-within:ring-[#E5F0FF]
                transition-all
              "
            >
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          <span>Secured by Stripe • Card details never touch YesViral servers.</span>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-center text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      {/* PAY BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-12
          rounded-2xl
          bg-gradient-to-r from-[#007BFF] to-[#005FCC]
          text-white text-sm sm:text-base font-bold
          shadow-[0_12px_35px_rgba(0,123,255,0.55)]
          flex items-center justify-center gap-2
          hover:from-[#005FCC] hover:to-[#0049A8]
          transition-all
          disabled:opacity-50 disabled:shadow-none
        "
      >
        {loading ? "Processing..." : "Complete Secure Payment"}
      </button>

      <p className="text-[11px] text-center text-[#6B7280]">
        By completing this purchase, you agree to YesViral&apos;s Terms & Refund Policy.
      </p>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#6B7A90] font-medium">{label}</span>
      <span className="text-[#111827] font-semibold text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
