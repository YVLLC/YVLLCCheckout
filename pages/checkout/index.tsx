import { useEffect, useState } from "react";
import OrderSummary from "../../components/OrderSummary";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Your Stripe publishable key (replace with your own!)
const stripePromise = loadStripe("pk_live_51Rgpc4Dtq312KvGPUkyCKLxH4ZdPWeJlmBAnMrSlAl5BHF8Wu8qFW6hqxKlo3l7F87X3qmvVnmDrZYcP3FSSTPVN00fygC8Pfl");

export default function CheckoutPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const orderData = window.sessionStorage.getItem("yesviral_order");
      if (orderData) {
        setOrder(JSON.parse(orderData));
      }
    }
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
