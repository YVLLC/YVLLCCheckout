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
      // Call your payment intent API
      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(order.total * 100) }),
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

      // Redirect or handle post-payment success
      window.location.href = "/checkout/success";
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="yv-checkout-form">
      <div className="yv-section">
        <label className="yv-label" htmlFor="card-element">
          Pay with credit/debit card
        </label>
        <div className="yv-card-element-wrap" id="card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "17px",
                  color: "#111111",
                  fontFamily: "Inter, Segoe UI, Arial, sans-serif",
                  "::placeholder": { color: "#888888" },
                  backgroundColor: "#fff"
                },
                invalid: {
                  color: "#EF4444"
                }
              }
            }}
          />
        </div>
      </div>
      {error && (
        <div className="yv-error">
          {error}
        </div>
      )}
      <PaymentButton loading={loading} />
      <div className="yv-legal">
        By completing your order, you agree to the{" "}
        <a
          href="https://yesviral.com/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://yesviral.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </div>
      <style jsx>{`
        .yv-checkout-form {
          margin-top: 24px;
          width: 100%;
          max-width: 390px;
        }
        .yv-section {
          margin-bottom: 22px;
        }
        .yv-label {
          font-weight: 700;
          margin-bottom: 9px;
          display: block;
          color: #007BFF;
          letter-spacing: -0.01em;
          font-size: 1.08em;
        }
        .yv-card-element-wrap {
          border: 1.7px solid #CFE4FF;
          border-radius: 10px;
          background: #fff;
          padding: 16px 13px 15px 13px;
          transition: border 0.18s;
          box-shadow: 0 2px 8px #e6f0ff44;
        }
        .yv-card-element-wrap:focus-within {
          border: 1.7px solid #0056B3;
          box-shadow: 0 0 0 2px #E6F0FF;
        }
        .yv-error {
          color: #EF4444;
          background: #fff6f6;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          margin-bottom: 13px;
          padding: 9px 13px 8px 13px;
          border: 1px solid #FDE2E1;
        }
        .yv-legal {
          margin-top: 18px;
          font-size: 13.5px;
          color: #888888;
          text-align: center;
          line-height: 1.6;
        }
        .yv-legal a {
          color: #007BFF;
          text-decoration: underline;
          transition: color 0.15s;
        }
        .yv-legal a:hover {
          color: #005FCC;
        }
        @media (max-width: 600px) {
          .yv-checkout-form {
            max-width: 100vw;
            padding: 0 2vw;
          }
        }
      `}</style>
    </form>
  );
}