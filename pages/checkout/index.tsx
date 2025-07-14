import { useEffect, useState } from "react";
import OrderSummary from "../../components/OrderSummary";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Use your live Stripe publishable key for production!
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
          padding: 44,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 22,
          color: "#22324d",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(118deg, #f7fafd 0%, #eaf4ff 100%)"
        }}
      >
        Please start your order from the main site.
      </div>
    );
  }

  return (
    <div className="checkout-root">
      <div className="checkout-hero">
        <svg width={36} height={36} viewBox="0 0 38 38" fill="none" style={{marginRight: 10}}>
          <circle cx="19" cy="19" r="19" fill="#2176FF"/>
          <path d="M25.5 14.5L17 23L12.5 18.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="checkout-title">Secure Checkout</h1>
      </div>
      <div className="checkout-card">
        <OrderSummary order={order} />
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
      </div>
      <div className="checkout-footer">
        <span>All transactions are encrypted and processed securely.</span>
      </div>
      <style jsx global>{`
        .checkout-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(118deg, #f7fafd 0%, #eaf4ff 100%);
          padding: 48px 0 36px;
        }
        .checkout-hero {
          display: flex;
          align-items: center;
          margin-bottom: 2.6rem;
        }
        .checkout-title {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #2176FF;
          margin: 0;
        }
        .checkout-card {
          background: #fff;
          border-radius: 24px;
          max-width: 470px;
          width: 100%;
          box-shadow: 0 8px 34px 0 #2176ff18;
          padding: 2.7rem 2.1rem 2.5rem 2.1rem;
          margin-bottom: 2.1rem;
          transition: box-shadow 0.18s;
        }
        .checkout-card:hover {
          box-shadow: 0 14px 44px 0 #2176ff23;
        }
        .checkout-footer {
          color: #96a8be;
          font-size: 14px;
          margin-top: 8px;
          font-weight: 500;
          text-align: center;
        }
        @media (max-width: 600px) {
          .checkout-root {
            padding: 20px 0 16px;
          }
          .checkout-title {
            font-size: 1.35rem;
          }
          .checkout-card {
            padding: 1.1rem 0.5rem 1.4rem 0.5rem;
            max-width: 99vw;
          }
        }
      `}</style>
    </div>
  );
}