import { useEffect, useState } from "react";
import OrderSummary from "../../components/OrderSummary";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Lock, CheckCircle } from "lucide-react";

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
      <div className="ys-bg ys-full-center">
        <div className="ys-fallback-card">
          <Lock size={30} color="#2176FF" />
          <h2>Start from the main site</h2>
        </div>
        <style jsx>{`
          .ys-fallback-card {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 2.8em 2.1em 2.2em 2.1em;
            min-width: 280px;
            box-shadow: 0 12px 40px #2176ff17;
            text-align: center;
            color: #22324d;
          }
          .ys-fallback-card h2 { font-size: 1.18em; margin-top: 0.9em; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ys-bg ys-full-center">
      <div className="ys-checkout-wrapper ys-fadein">
        <div className="ys-hero-row">
          <img src="/logo-checkout.png" alt="YesViral" className="ys-logo" />
          <div>
            <div className="ys-title-row">
              <Lock size={20} className="ys-lock" />
              <span>Secure Checkout</span>
            </div>
            <div className="ys-hero-sub">Protected by 256-bit SSL • Encrypted</div>
          </div>
        </div>
        <OrderSummary order={order} />
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
        <div className="ys-trustbar">
          <CheckCircle size={18} color="#22C55E" />
          30-Day Refill Guarantee &nbsp;•&nbsp; 24/7 Priority Support
        </div>
      </div>
      <style jsx global>{`
        body { background: transparent !important; }
        .ys-bg {
          min-height: 100vh; width: 100vw;
          background: linear-gradient(110deg, #eef6ff 0%, #f7fafd 70%, #f5faff 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .ys-full-center { display: flex; align-items: center; justify-content: center; }
        .ys-checkout-wrapper {
          background: rgba(255,255,255,0.87);
          border-radius: 28px;
          box-shadow: 0 12px 56px #2176ff0d;
          border: 1.6px solid #d5eaff;
          max-width: 470px; width: 100%;
          padding: 2.2em 1.4em 1.3em 1.4em; margin: 2vw;
          display: flex; flex-direction: column; align-items: center;
        }
        .ys-fadein { animation: ys-fade 1s cubic-bezier(.29,1.4,.32,1) both;}
        @keyframes ys-fade { 0% { opacity: 0; transform: scale(0.97) translateY(36px);}
                              100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        .ys-hero-row { display: flex; align-items: center; gap: 1.1em; margin-bottom: 1.4em;}
        .ys-logo { width: 46px; height: 46px; border-radius: 13px; }
        .ys-title-row { display: flex; align-items: center; font-weight: 900; color: #2176FF; font-size: 1.36em;}
        .ys-lock { margin-right: 7px; }
        .ys-hero-sub { font-size: 1.01em; color: #1DC978; margin-top: 1px; font-weight: 700;}
        .ys-trustbar {
          width: 100%;
          margin-top: 18px;
          color: #237288;
          font-size: 15.3px;
          font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          gap: 0.6em;
          opacity: 0.95;
        }
        @media (max-width: 700px) {
          .ys-checkout-wrapper { max-width: 99vw; border-radius: 16px; padding: 1.1em 0.3em 1.1em;}
          .ys-logo { width: 36px; height: 36px; }
        }
      `}</style>
    </div>
  );
}
