import { useEffect, useState } from "react";
import OrderSummary from "../../components/OrderSummary";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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
      <div className="yv-ultimate-bg yv-full-center">
        <div className="yv-404-card">
          <span className="yv-bounce-lock">
            <svg width="38" height="38" fill="none"><circle cx="19" cy="19" r="19" fill="#2176FF"/><path d="M25 20V16.5C25 13.462 22.538 11 19.5 11C16.462 11 14 13.462 14 16.5V20" stroke="#fff" strokeWidth="2.1" strokeLinecap="round"/><rect x="14.8" y="19.5" width="9.5" height="7.2" rx="2.1" fill="#fff" stroke="#fff" strokeWidth="1.2"/></svg>
          </span>
          <h2>Oops, no order found</h2>
          <p>Start your secure checkout from the main site.</p>
        </div>
        <style jsx>{`
          .yv-404-card {
            background: rgba(255,255,255,0.95);
            border-radius: 18px;
            padding: 3.3em 2em 2.5em 2em;
            box-shadow: 0 12px 40px #2176ff17;
            min-width: 330px;
            max-width: 96vw;
            text-align: center;
          }
          .yv-404-card h2 {
            font-size: 1.5em;
            font-weight: 900;
            color: #22324d;
            margin: 18px 0 7px;
          }
          .yv-404-card p {
            color: #2264a6;
            font-weight: 600;
          }
          .yv-bounce-lock { animation: lockpop 0.9s cubic-bezier(.37,1.31,.5,1) both;}
          @keyframes lockpop {0%{transform:scale(0.78);}70%{transform:scale(1.15);}100%{transform:scale(1);}}
        `}</style>
      </div>
    );
  }

  return (
    <div className="yv-ultimate-bg yv-full-center">
      <div className="yv-checkout-glass yv-fadein">
        <div className="yv-checkout-hero">
          <img
            src="/logo-checkout.png"
            alt="YesViral"
            className="yv-checkout-logo"
            width={54}
            height={54}
          />
          <div>
            <div className="yv-checkout-title">
              <span className="yv-lock">
                <svg width="23" height="23" fill="none"><circle cx="11.5" cy="11.5" r="11.5" fill="#1DC978"/><path d="M15.7 14v-2.5a3.2 3.2 0 10-6.4 0V14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><rect x="7.8" y="13.5" width="7.5" height="4.2" rx="1.1" fill="#fff" stroke="#fff" strokeWidth="1.1"/></svg>
              </span>
              Secure Checkout
            </div>
            <div className="yv-checkout-subtitle">
              Payment protected & encrypted
            </div>
          </div>
        </div>
        <div className="yv-checkout-card">
          <OrderSummary order={order} />
          <Elements stripe={stripePromise}>
            <CheckoutForm order={order} />
          </Elements>
        </div>
        <div className="yv-checkout-trustrow">
          <span>
            <svg width="19" height="19" viewBox="0 0 20 20" fill="#22C55E" style={{marginRight: 7, verticalAlign: "middle"}}><circle cx="10" cy="10" r="10" /><path d="M14.5 7.5L9 13l-2.5-2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            SSL Encryption & Instant Confirmation
          </span>
          <span className="yv-divider" />
          <span>
            <svg width="19" height="19" viewBox="0 0 20 20" fill="#2176FF" style={{marginRight: 7, verticalAlign: "middle"}}><circle cx="10" cy="10" r="10" /><path d="M7.5 10.5l2 2 3-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            24/7 Priority Support
          </span>
          <span className="yv-divider" />
          <span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#FFB703" style={{marginRight: 7, verticalAlign: "middle"}}><circle cx="10" cy="10" r="10" /><path d="M10 5v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            30-Day Refill Guarantee
          </span>
        </div>
      </div>
      {/* ULTIMATE CHECKOUT STYLES */}
      <style jsx global>{`
        body {
          background: transparent !important;
        }
        .yv-ultimate-bg {
          min-height: 100vh;
          min-width: 100vw;
          width: 100vw;
          background: linear-gradient(115deg, #f7fafd 0%, #eaf4ff 45%, #f5faff 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .yv-full-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .yv-checkout-glass {
          background: rgba(255,255,255,0.87);
          border-radius: 28px;
          box-shadow: 0 12px 56px 0 #2176ff14, 0 4px 18px 0 #22c55e11;
          border: 1.6px solid #d5eaff;
          max-width: 510px;
          width: 100%;
          padding: 2.2em 2em 1.3em 2em;
          margin: 2vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: glassfade 1s cubic-bezier(.29,1.4,.32,1) both;
        }
        @keyframes glassfade {
          0% { opacity: 0; transform: scale(0.97) translateY(36px);}
          90% { opacity: 1; }
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        .yv-fadein { animation: glassfade 0.88s both;}
        .yv-checkout-hero {
          display: flex;
          align-items: center;
          gap: 1.15em;
          margin-bottom: 2.1em;
        }
        .yv-checkout-logo {
          width: 54px;
          height: 54px;
          object-fit: contain;
          border-radius: 16px;
          background: linear-gradient(120deg, #E6F0FF 30%, #fff 100%);
          box-shadow: 0 2px 18px #007BFF22, 0 1px 4px #2176ff18;
        }
        .yv-checkout-title {
          font-size: 2.18em;
          font-weight: 900;
          color: #2176FF;
          letter-spacing: -0.03em;
          display: flex;
          align-items: center;
          gap: 0.4em;
        }
        .yv-lock {
          display: flex;
          align-items: center;
          margin-right: 5px;
        }
        .yv-checkout-subtitle {
          color: #22C55E;
          font-size: 1.12em;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .yv-checkout-card {
          background: #fff;
          border-radius: 24px;
          max-width: 100%;
          width: 100%;
          box-shadow: 0 8px 32px 0 #007bff13, 0 2px 12px 0 #22c55e0d;
          padding: 2.4rem 1.4rem 2.1rem 1.4rem;
          margin-bottom: 2.1rem;
          margin-top: 0.3rem;
          transition: box-shadow 0.22s;
          border: 1.4px solid #CFE4FF;
        }
        .yv-checkout-card:hover {
          box-shadow: 0 18px 60px 0 #2176ff2e, 0 4px 18px 0 #22c55e1a;
        }
        .yv-checkout-trustrow {
          width: 100%;
          margin-top: 10px;
          color: #1a3266;
          font-size: 15.7px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6em;
          flex-wrap: wrap;
          text-align: center;
          opacity: 0.92;
        }
        .yv-divider {
          width: 0.12em;
          height: 1.5em;
          background: linear-gradient(180deg, #CFE4FF 0%, #E0F4FF 100%);
          display: inline-block;
          border-radius: 2px;
          margin: 0 0.5em;
        }
        @media (max-width: 700px) {
          .yv-checkout-glass {
            max-width: 99vw;
            border-radius: 16px;
            padding: 1em 0.5em 1.1em 0.5em;
          }
          .yv-checkout-title {
            font-size: 1.25rem;
          }
          .yv-checkout-card {
            padding: 1rem 0.2rem 1rem 0.2rem;
          }
          .yv-checkout-logo {
            width: 40px;
            height: 40px;
          }
          .yv-checkout-hero {
            gap: 0.7em;
            margin-bottom: 1.1em;
          }
        }
      `}</style>
    </div>
  );
}
