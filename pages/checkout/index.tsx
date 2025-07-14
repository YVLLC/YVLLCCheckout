import { useEffect, useState } from "react";
import OrderSummary from "../../components/OrderSummary";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Replace with your live Stripe publishable key!
const stripePromise = loadStripe("pk_test_51Rgpc4Dtq312KvGPUkyCKLxH4ZdPWeJlmBAnMrSlAl5BHF8Wu8qFW6hqxKlo3l7F87X3qmvVnmDrZYcP3FSSTPVN00fygC8Pfl");

function getOrderFromURL() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const orderString = params.get("order");
  if (!orderString) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(orderString))));
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setOrder(getOrderFromURL());
  }, []);

  if (!order) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontWeight: 700,
          fontSize: 20,
          color: "#333"
        }}
      >
        Please start your order from the main site.
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Secure Checkout</h1>
      <div className="checkout-card">
        <OrderSummary order={order} />
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
      </div>
      <style jsx global>{`
        .checkout-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background: #f6f9fd;
          padding: 40px 0;
        }
        .checkout-title {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #111;
          margin-bottom: 2rem;
        }
        .checkout-card {
          background: #fff;
          border-radius: 22px;
          max-width: 460px;
          width: 100%;
          box-shadow: 0 6px 32px rgba(0,123,255,0.11);
          padding: 2.4rem 2rem 2.4rem 2rem;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}
