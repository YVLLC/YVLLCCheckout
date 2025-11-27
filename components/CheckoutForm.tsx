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
      if (!order) throw new Error("Missing order details.");

      const encodedMeta = btoa(
        JSON.stringify({
          platform: order.platform,
          service: order.service,
          quantity: order.amount,
          reference: order.reference,
        })
      );

      // ⭐ CALL THE LOCAL CHECKOUT API (NO CORS) ⭐
      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(order.total * 100), // stripe expects cents
          metadata: { order: encodedMeta },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Internal server error:", txt);
        throw new Error("Server error creating payment.");
      }

      const { clientSecret, error: serverError } = await res.json();
      if (serverError || !clientSecret) {
        throw new Error(serverError || "Payment failed.");
      }

      if (!stripe || !elements) {
        throw new Error("Stripe not loaded.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card input field not found.");
      }

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
      setError(e.message || "An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="yv-checkout-form space-y-4">

      {/* CARD INPUT */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Card Details
        </label>

        <div className="p-3 border rounded-lg bg-white">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#111",
                  "::placeholder": { color: "#888" },
                },
                invalid: {
                  color: "#EF4444",
                },
              },
            }}
          />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-red-500 text-sm font-medium text-center">
          {error}
        </p>
      )}

      {/* PAY BUTTON */}
      <PaymentButton loading={loading} />
    </form>
  );
}
