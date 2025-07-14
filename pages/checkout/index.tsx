import { useEffect, useState } from "react";
import OrderSummary from "../../components/OrderSummary";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key
const stripePromise = loadStripe("pk_live_51Rgpc4Dtq312KvGPUkyCKLxH4ZdPWeJlmBAnMrSlAl5BHF8Wu8qFW6hqxKlo3l7F87X3qmvVnmDrZYcP3FSSTPVN00fygC8Pfl");

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
      <div style={{ padding: 40, textAlign: "center" }}>
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
    </div>
  );
}
