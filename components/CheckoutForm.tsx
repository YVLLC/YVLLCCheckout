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

      // ⭐ IMPORTANT ⭐
      // Use the LOCAL checkout API, not yesviral.com
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
        console.error("PaymentIntent server error:", txt);
        throw new Error("Server error creating payment.");
      }

      const { clientSecret, error: serverError } = await res.json();
      if (serverError || !clientSecret) {
        console.error("Bad JSON:", { clientSecret, serverError });
        throw new Error(serverError || "Payment failed.");
      }

      if (!stripe || !elements) {
        throw new Error("Stripe not loaded.");
      }

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (stripeError) throw new Error(stripeError.message);

      window.location.href = "/checkout/success";
    } catch (e: any) {
      console.error("Checkout error:", e);
      setError(e.message || "An error occurred.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="yv-checkout-form">
      {/* Your CardElement + UI goes here */}
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
      <PaymentButton loading={loading} />
    </form>
  );
}
