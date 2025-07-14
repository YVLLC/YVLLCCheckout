import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PaymentButton from "./PaymentButton";

type CheckoutFormProps = {
  order: {
    product: string;
    option: string;
    amount: number;
    reference: string;
    price: number;
    total: number;
  };
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
      // 1. Create payment intent on your backend (pass only the amount!)
      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(order.total * 100) }), // Stripe expects cents
      });
      const { clientSecret, error: serverError } = await res.json();
      if (serverError || !clientSecret) throw new Error(serverError || "Payment failed.");

      // 2. Confirm payment with Stripe Elements
      if (!stripe || !elements) throw new Error("Stripe not loaded");
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });
      if (stripeError) throw new Error(stripeError.message);

      // 3. (Optional) Create JAP order on your server after payment (never from browser)
      // await fetch("/api/jap_order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...order, paymentId: paymentIntent.id }),
      // });

      // 4. Redirect to success page
      window.location.href = "/checkout/success";
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Pay with card</div>
        <div style={{
          border: "1px solid #CFE4FF",
          borderRadius: 8,
          background: "#fff",
          padding: 14
        }}>
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      </div>
      {error && (
        <div style={{ color: "#EF4444", marginBottom: 10, fontWeight: 500 }}>
          {error}
        </div>
      )}
      <PaymentButton loading={loading} />
    </form>
  );
}
