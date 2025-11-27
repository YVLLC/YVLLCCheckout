import { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

type CheckoutFormProps = {
  order: {
    platform: string;
    service: string;
    amount: number;
    reference: string;
    total: number;
    package?: string;
    type?: string;
  };
};

const cardStyle = {
  style: {
    base: {
      fontSize: "17px",
      fontWeight: 500,
      color: "#111",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      "::placeholder": {
        color: "#9DA9BC",
      },
      iconColor: "#007BFF",
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

export default function CheckoutForm({ order }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apple Pay / Google Pay
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "YesViral Order",
        amount: Math.round(order.total * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });
  }, [stripe, order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!order) throw new Error("Missing order info.");

      const encodedMeta = btoa(
        JSON.stringify({
          platform: order.platform,
          service: order.service,
          quantity: order.amount,
          reference: order.reference,
        })
      );

      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(order.total * 100),
          metadata: { order: encodedMeta },
        }),
      });

      const { clientSecret, error: serverError } = await res.json();
      if (serverError || !clientSecret)
        throw new Error(serverError || "Unable to create payment.");

      const cardElement = elements?.getElement(CardNumberElement);
      if (!stripe || !elements || !cardElement)
        throw new Error("Stripe failed to load.");

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (stripeError) throw stripeError;

      window.location.href = "/checkout/success";
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const pkg = order.package || `${order.service} Package`;
  const type = order.type || "High-Quality";

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto
        bg-white/80 backdrop-blur-xl
        rounded-3xl border border-[#CFE4FF]
        shadow-[0_20px_80px_rgba(0,123,255,0.15)]
        p-6 sm:p-8
        flex flex-col gap-9
        animate-fadeIn
      "
    >
      {/* HEADER CARD */}
      <div
        className="
          w-full rounded-2xl
          bg-gradient-to-br from-[#007BFF] via-[#005FCC] to-[#00215E]
          text-white p-6
          shadow-[0_25px_80px_rgba(0,70,160,0.5)]
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-wide text-white/70">
            YesViral • Secure Checkout
          </span>
          <span className="text-[11px] bg-white/15 px-2 py-1 rounded-full border border-white/20">
            SSL Secured
          </span>
        </div>
        <div className="mt-3">
          <div className="text-white/70 text-xs">Total</div>
          <div className="text-3xl font-black">
            ${order.total.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-[#F5FAFF] border border-[#D5E6FF] rounded-2xl p-5 space-y-3 shadow-sm">
        <SummaryRow label="Package" value={pkg} />
        <SummaryRow label="Quality" value={type} />
        <SummaryRow label="Platform" value={order.platform} />
        <SummaryRow label="Service" value={order.service} />
        <SummaryRow label="Amount" value={order.amount.toLocaleString()} />
        <SummaryRow label="Username / Link" value={order.reference} />
      </div>

      {/* APPLE PAY / GOOGLE PAY */}
      {paymentRequest && (
        <div className="w-full">
          <PaymentRequestButtonElement
            options={{ paymentRequest, style: { type: "default", theme: "dark" } }}
          />
          <div className="text-center text-xs text-[#6B7280] mt-2">
            Pay instantly with Apple Pay / Google Pay
          </div>
        </div>
      )}

      {/* CARD NUMBER */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          Card Number
        </label>
        <div className="w-full bg-white border border-[#CFE4FF] rounded-xl px-4 py-3 shadow-inner focus-within:border-[#007BFF] focus-within:ring-4 focus-within:ring-[#E5F0FF] transition-all">
          <CardNumberElement options={cardStyle} />
        </div>
      </div>

      {/* EXPIRE / CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
            Expiration
          </label>
          <div className="w-full bg-white border border-[#CFE4FF] rounded-xl px-4 py-3 shadow-inner focus-within:border-[#007BFF] focus-within:ring-4 focus-within:ring-[#E5F0FF] transition-all">
            <CardExpiryElement options={cardStyle} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
            CVC
          </label>
          <div className="w-full bg-white border border-[#CFE4FF] rounded-xl px-4 py-3 shadow-inner focus-within:border-[#007BFF] focus-within:ring-4 focus-within:ring-[#E5F0FF] transition-all">
            <CardCvcElement options={cardStyle} />
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      {/* PAY BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-12
          rounded-2xl
          bg-gradient-to-r from-[#007BFF] to-[#005FCC]
          text-white font-bold shadow-[0_10px_25px_rgba(0,123,255,0.4)]
          hover:brightness-110 transition disabled:opacity-50
        "
      >
        {loading ? "Processing..." : "Complete Secure Payment"}
      </button>

      <p className="text-[11px] text-center text-[#6B7280]">
        By continuing, you agree to YesViral’s Terms & Refund Policy.
      </p>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#6B7280] font-medium">{label}</span>
      <span className="text-[#111827] font-semibold text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
