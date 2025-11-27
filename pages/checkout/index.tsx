import { useEffect, useState } from "react";
import CheckoutForm from "../../components/CheckoutForm";
import OrderSummary from "../../components/OrderSummary";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Lock, CheckCircle } from "lucide-react";

const stripePromise = loadStripe(
  "pk_test_51Rgpc4Dtq312KvGPUkyCKLxH4ZdPWeJlmBAnMrSlAl5BHF8Wu8qFW6hqxKlo3l7F87X3qmvVnmDrZYcP3FSSTPVN00fygC8Pfl"
);

// Read encoded order from URL:
function getOrderFromURL() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("order");
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw))));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-xl p-8 rounded-2xl text-center space-y-4 border border-[#DCE8FF]">
          <Lock size={30} className="text-[#007BFF] mx-auto" />
          <h2 className="text-[#111] text-lg font-semibold">
            Start from the main YesViral website
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EEF6FF] to-[#F7FAFD] flex items-center justify-center px-3 py-10">
      <div className="max-w-2xl w-full flex flex-col gap-8 items-center">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <img
            src="/logo-checkout.png"
            alt="YesViral"
            className="w-14 h-14 rounded-2xl shadow-md"
          />
          <div>
            <div className="flex items-center text-[#007BFF] font-extrabold text-xl tracking-tight">
              <Lock size={20} className="mr-2" />
              Secure Checkout
            </div>
            <p className="text-[#22C55E] font-semibold text-sm">
              Protected by 256-bit SSL • Encrypted
            </p>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <OrderSummary order={order} />

        {/* STRIPE ELEMENTS & CHECKOUT FORM */}
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>

        {/* TRUST BAR */}
        <div className="flex items-center justify-center gap-2 text-[#0A6DD9] text-sm font-semibold mt-3">
          <CheckCircle size={16} className="text-[#22C55E]" />
          30-Day Refill Guarantee • 24/7 Priority Support
        </div>
      </div>
    </div>
  );
}
