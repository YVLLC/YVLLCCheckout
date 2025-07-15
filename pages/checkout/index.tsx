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
          background: "linear-gradient(118deg, #f7fafd 0%, #eaf4ff 100%)",
        }}
      >
        Please start your order from the main site.
      </div>
    );
  }

  return (
    <div className="yv-checkout-root">
      <div className="yv-checkout-hero">
        {/* Swap SVG for logo */}
        <img
          src="/logo-checkout.png"
          alt="YesViral Logo"
          className="yv-logo"
          width={54}
          height={54}
          style={{
            marginRight: 18,
            borderRadius: 14,
            boxShadow: "0 2px 18px #007BFF22, 0 1px 4px #2176ff18",
            background: "linear-gradient(120deg, #E6F0FF 30%, #fff 100%)",
          }}
        />
        <div>
          <h1 className="yv-checkout-title">Checkout</h1>
          <div className="yv-checkout-subtitle">Encrypted &amp; Secure</div>
        </div>
      </div>
      <div className="yv-checkout-card">
        <OrderSummary order={order} />
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
      </div>
      <div className="yv-checkout-footer">
        <span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="#22C55E" style={{marginRight: 6, verticalAlign: "middle"}}><circle cx="10" cy="10" r="10" /><path d="M14.5 7.5L9 13l-2.5-2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Payments protected by 256-bit SSL • Instant order confirmation
        </span>
      </div>
      <style jsx global>{`
        .yv-checkout-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(117deg, #E6F0FF 0%, #FFFFFF 100%);
          padding: 54px 0 38px;
        }
        .yv-checkout-hero {
          display: flex;
          align-items: center;
          margin-bottom: 2.2rem;
          gap: 0.8em;
        }
        .yv-logo {
          width: 54px;
          height: 54px;
          object-fit: contain;
          background: #E6F0FF;
        }
        .yv-checkout-title {
          font-size: 2.25rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #007BFF;
          margin: 0 0 0.15em 0;
          line-height: 1.07;
        }
        .yv-checkout-subtitle {
          color: #22C55E;
          font-size: 1.03rem;
          font-weight: 700;
        }
        .yv-checkout-card {
          background: #fff;
          border-radius: 25px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 12px 48px 0 #007bff16, 0 2px 12px 0 #22c55e0d;
          padding: 2.8rem 2rem 2.6rem 2rem;
          margin-bottom: 2.2rem;
          transition: box-shadow 0.22s;
          border: 1.5px solid #CFE4FF;
        }
        .yv-checkout-card:hover {
          box-shadow: 0 18px 60px 0 #007bff28, 0 4px 22px 0 #22c55e11;
        }
        .yv-checkout-footer {
          color: #22C55E;
          font-size: 15px;
          margin-top: 4px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.01em;
          display: flex;
          justify-content: center;
        }
        @media (max-width: 700px) {
          .yv-checkout-root {
            padding: 18px 0 12px;
          }
          .yv-checkout-title {
            font-size: 1.25rem;
          }
          .yv-checkout-card {
            padding: 1.1rem 0.5rem 1.3rem 0.5rem;
            max-width: 100vw;
          }
          .yv-logo {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}