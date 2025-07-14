// components/CheckoutForm.tsx

import { useState } from "react";
import PaymentButton from "./PaymentButton";

export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // TODO: Replace this with your real payment logic/Stripe integration
    try {
      if (!order || order.length < 3) {
        setError("Please enter valid order details.");
        setLoading(false);
        return;
      }
      // Simulate async call
      await new Promise((res) => setTimeout(res, 1400));
      // On success, redirect to success page
      window.location.href = "/checkout/success";
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <label
          htmlFor="order"
          style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
        >
          Order Details
        </label>
        <input
          id="order"
          name="order"
          type="text"
          required
          value={order}
          onChange={e => setOrder(e.target.value)}
          placeholder="Enter your order information"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #CFE4FF",
            background: "#fff",
            fontSize: 16,
            outline: "none",
          }}
        />
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
