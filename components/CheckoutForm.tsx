import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
      if (serverError || !clientSecret)
        throw new Error(serverError || "Payment failed.");

      if (!stripe || !elements)
        throw new Error("Stripe not loaded");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card input not found.");

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

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
        w-full max-w-xl mx-auto
        bg-white rounded-3xl
        p-8 md:p-10
        border border-[#CFE4FF]
        shadow-[0_25px_120px_rgba(0,123,255,0.15)]
        backdrop-blur-xl
        animate-fadeIn
        flex flex-col gap-10
      "
    >

      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-[#007BFF] tracking-tight drop-shadow-sm">
          Secure Checkout
        </h2>
        <p className="text-sm text-[#4B5563]">
          Protected by 256-bit SSL • Encrypted
        </p>
      </div>

      {/* CARD INFORMATION */}
      <div
        className="
          bg-gradient-to-br from-[#F6FAFF] to-white
          border border-[#DCE8FF]
          rounded-2xl p-6
          shadow-[0_10px_40px_rgba(0,123,255,0.12)]
          hover:shadow-[0_12px_50px_rgba(0,123,255,0.15)]
          transition-all duration-300
          space-y-5
        "
      >
        <label className="text-sm font-bold text-[#005FCC] tracking-wide uppercase">
          Card Information
        </label>

        <div
          className="
            w-full px-4 py-4 rounded-xl
            bg-white shadow-inner
            border border-[#CFE4FF]
            focus-within:border-[#007BFF]
            focus-within:ring-4 focus-within:ring-[#E6F0FF]
            transition-all duration-300
          "
        >
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#111",
                  letterSpacing: "0.35px",
                  fontSmoothing: "antialiased",
                  "::placeholder": { color: "#9BB3DA" },
                  iconColor: "#007BFF",
                },
                invalid: {
                  color: "#EF4444",
                  iconColor: "#EF4444",
                },
              },
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#22C55E] rounded-full shadow-[0_0_6px_#22C55E]" />
          <p className="text-xs text-[#6B7280]">
            256-bit encrypted • Secured by Stripe
          </p>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div
        className="
          bg-[#F5FAFF] rounded-2xl
          shadow-sm border border-[#DCEBFF]
          p-6 space-y-3
        "
      >
        <h3 className="text-sm font-bold text-[#005FCC] tracking-wide uppercase">
          Order Summary
        </h3>

        <div className="flex justify-between text-sm text-[#111]">
          <span>
            {order.amount.toLocaleString()} {order.service}
          </span>
          <span className="font-bold text-[#007BFF]">
            ${order.total.toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-[#6B7280]">
          Platform: <span className="font-semibold text-[#111]">{order.platform}</span>
        </p>
        <p className="text-xs text-[#6B7280]">
          Target: <span className="font-semibold text-[#111]">{order.reference}</span>
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-center text-sm font-semibold animate-pulse">
          {error}
        </div>
      )}

      {/* PAY BUTTON */}
      <PaymentButton loading={loading} />

      {/* BELOW-BUTTON BADGES */}
      <div className="flex justify-center gap-6 pt-2 text-[#1076FF] text-xs font-semibold">
        <div className="flex items-center gap-1">
          <span className="text-[#22C55E]">✔</span> 30-Day Refill Guarantee
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#22C55E]">✔</span> 24/7 Priority Support
        </div>
      </div>
    </form>
  );
}
