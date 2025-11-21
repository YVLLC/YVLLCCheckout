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
      if (serverError || !clientSecret) throw new Error(serverError || "Payment failed.");

      if (!stripe || !elements) throw new Error("Stripe not loaded");
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });
      if (stripeError) throw new Error(stripeError.message);

      window.location.href = "/checkout/success";
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="yv-checkout-form">
      {/* ... unchanged UI ... */}
      <PaymentButton loading={loading} />
    </form>
  );
}
