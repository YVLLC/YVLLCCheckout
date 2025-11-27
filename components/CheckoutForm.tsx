import { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PaymentButton from "./PaymentButton";

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

      if (!stripe || !elements) throw new Error("Stripe not loaded");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card input not found.");

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) throw new Error(stripeError.message);

      window.location.href = "/checkout/success";
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-lg mx-auto
        p-6 sm:p-10
        flex flex-col gap-8
        bg-white/70 backdrop-blur-xl
        rounded-3xl shadow-[0_20px_80px_rgba(0,123,255,0.15)]
        border border-[#CFE4FF]
        animate-fadeIn
      "
    >

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-[#007BFF] tracking-tight drop-shadow-sm">
          Secure Checkout
        </h2>
        <p className="text-sm text-[#555]">
          Pay safely with encrypted Stripe payments.
        </p>
      </div>

      {/* CARD FIELD WRAPPER */}
      <div
        className="
          bg-gradient-to-br from-[#F6FAFF] to-white
          border border-[#DCE8FF]
          rounded-2xl p-6
          shadow-[0_6px_25px_rgba(0,123,255,0.09)]
          transition duration-300
          hover:shadow-[0_8px_32px_rgba(0,123,255,0.13)]
          space-y-4
        "
      >
        <label className="block text-sm font-bold text-[#005FCC] uppercase tracking-wide">
          Card Information
        </label>

        {/* CARD ELEMENT */}
        <div
          className="
            w-full
            px-4 py-4 rounded-xl
            bg-white shadow-inner
            border border-[#CFE4FF]
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
                  letterSpacing: "0.4px",
                  fontSmoothing: "antialiased",
                  "::placeholder": { color: "#A6B9D9" },
                },
                invalid: { color: "#EF4444" },
              },
            }}
          />
        </div>

        {/* SECURE BADGE */}
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2.5 h-2.5 bg-[#22C55E] rounded-full shadow-[0_0_6px_#22C55E]"></span>
          <span className="text-xs text-[#6B7280]">
            256-bit encrypted • Secured by Stripe
          </span>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="
        bg-[#F5FAFF]
        rounded-xl border border-[#DCEBFF]
        p-5 space-y-2 shadow-sm
      ">
        <h3 className="text-sm font-bold text-[#007BFF] tracking-tight">
          Order Summary
        </h3>
        <p className="text-sm text-[#333] flex justify-between">
          <span>{order.amount.toLocaleString()} {order.service}</span>
          <span className="font-bold text-[#007BFF]">
            ${order.total.toFixed(2)}
          </span>
        </p>
        <p className="text-xs text-[#666]">
          Platform: <b>{order.platform}</b>
        </p>
        <p className="text-xs text-[#666]">
          Target: <b>{order.reference}</b>
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-center text-sm font-semibold">
          {error}
        </div>
      )}

      {/* BUTTON */}
      <PaymentButton loading={loading} />

    </form>
  );
}
