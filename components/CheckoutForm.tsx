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
      if (!order) throw new Error("Order data missing.");

      const encodedMeta = btoa(
        JSON.stringify({
          platform: order.platform,
          service: order.service,
          quantity: order.amount,
          reference: order.reference,
        })
      );

      // ⭐ USE LOCAL API TO AVOID CORS
      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(order.total * 100),
          metadata: { order: encodedMeta },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Server error:", txt);
        throw new Error("Failed to create payment. Try again.");
      }

      const { clientSecret, error: serverError } = await res.json();

      if (serverError || !clientSecret) {
        throw new Error(serverError || "Unable to process payment.");
      }

      if (!stripe || !elements)
        throw new Error("Stripe not initialized.");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card input not found.");

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) throw new Error(stripeError.message);

      window.location.href = "/checkout/success";
    } catch (e: any) {
      console.error("Checkout error:", e);
      setError(e.message || "Unexpected error.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full 
        max-w-xl 
        mx-auto 
        flex 
        flex-col 
        gap-6 
        px-4 
        sm:px-6 
        md:px-0
      "
    >

      {/* CARD ELEMENT BLOCK */}
      <div
        className="
          w-full 
          bg-white 
          rounded-2xl 
          border 
          border-[#DCE8FF] 
          shadow-[0_4px_18px_rgba(0,0,0,0.05)] 
          p-5 
          space-y-3
        "
      >
        <label
          className="
            block 
            text-sm 
            font-semibold 
            text-[#0B63E6] 
            tracking-tight
          "
        >
          Card Information
        </label>

        <div
          className="
            border 
            border-[#CFE4FF] 
            rounded-xl 
            bg-[#F9FBFF] 
            px-4 
            py-3
            shadow-inner 
            transition 
            focus-within:border-[#007BFF]
            focus-within:ring-2
            focus-within:ring-[#E6F0FF]
          "
        >
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#111",
                  "::placeholder": { color: "#9BB3DA" },
                },
                invalid: {
                  color: "#EF4444",
                },
              },
            }}
          />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-[#22C55E] rounded-full"></span>
          <span className="text-[11px] text-[#6B7280]">
            256-bit encrypted • Secured by Stripe
          </span>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="text-red-500 text-sm text-center font-medium px-2">
          {error}
        </div>
      )}

      {/* PAYMENT BUTTON */}
      <PaymentButton loading={loading} />
    </form>
  );
}
