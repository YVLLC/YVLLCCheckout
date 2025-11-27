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

export default function CheckoutForm({ order }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  // 🟦 Detect card brand in real time
  const [cardBrand, setCardBrand] = useState<string>("");

  // Stripe ELEMENT styles
  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        fontWeight: 500,
        color: "#111827",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        "::placeholder": { color: "#9CA3AF" },
        iconColor: "#007BFF",
      },
      invalid: {
        color: "#EF4444",
        iconColor: "#EF4444",
      },
    },
  };

  // 🟦 Initialize Apple Pay / Google Pay
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
  }, [stripe]);

  // 🟩 Handle card brand detection
  useEffect(() => {
    if (!elements) return;
    const numberElement = elements.getElement(CardNumberElement);
    if (!numberElement) return;

    numberElement.on("change", (event) => {
      if (event.brand) {
        setCardBrand(event.brand);
      }
    });
  }, [elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!order) throw new Error("Missing order details.");

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

      const cardNum = elements?.getElement(CardNumberElement);
      if (!stripe || !elements || !cardNum)
        throw new Error("Stripe is not ready yet.");

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardNum } }
      );

      if (stripeError) throw new Error(stripeError.message);

      window.location.href = "/checkout/success";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Card brand icons
  const brandLogos: any = {
    visa: "/cards/visa.svg",
    mastercard: "/cards/mastercard.svg",
    amex: "/cards/amex.svg",
    discover: "/cards/discover.svg",
  };

  const brandIcon = brandLogos[cardBrand] || "/cards/blank-card.svg";

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto
        bg-white/80 backdrop-blur-xl
        rounded-3xl border border-[#CFE4FF]
        shadow-[0_24px_90px_rgba(0,123,255,0.18)]
        p-6 sm:p-8 flex flex-col gap-8
      "
    >
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-[#007BFF] tracking-tight">
          Secure Checkout
        </h2>
        <p className="text-sm text-[#555]">
          Pay safely with Stripe • 256-bit SSL Encryption
        </p>
      </div>

      {/* APPLE PAY / GOOGLE PAY */}
      {paymentRequest && (
        <div className="w-full flex flex-col gap-2">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
            }}
            className="
              w-full rounded-xl
              overflow-hidden
              shadow-[0_8px_32px_rgba(0,0,0,0.15)]
            "
          />

          <p className="text-center text-xs text-[#6B7280]">
            Fast checkout via Apple Pay / Google Pay
          </p>
        </div>
      )}

      {/* CARD INFO BOX */}
      <div
        className="
          w-full bg-[#F6FAFF] border border-[#DDE8FF]
          rounded-2xl p-5 sm:p-6 shadow-[0_12px_38px_rgba(0,123,255,0.12)]
          space-y-5
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#005FCC] uppercase">
            Card Information
          </span>
          <img src={brandIcon} className="h-6 opacity-80" />
        </div>

        {/* Card Number */}
        <div className="space-y-1">
          <label className="text-xs text-[#6B7280] font-semibold uppercase">
            Card Number
          </label>
          <div className="input-box">
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        {/* Exp + CVC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-semibold uppercase">
              Expiration
            </label>
            <div className="input-box">
              <CardExpiryElement options={cardStyle} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-semibold uppercase">
              CVC
            </label>
            <div className="input-box">
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-center text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      {/* PAY BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-12 rounded-2xl
          bg-gradient-to-r from-[#007BFF] to-[#005FCC]
          text-white text-base font-bold
          shadow-[0_12px_35px_rgba(0,123,255,0.55)]
          flex items-center justify-center
          transition-all hover:scale-[1.01]
          disabled:opacity-40
        "
      >
        {loading ? "Processing..." : "Complete Secure Payment"}
      </button>

      <p className="text-[11px] text-center text-[#6B7280]">
        By completing this purchase, you agree to YesViral’s Terms & Refund Policy.
      </p>

      {/* TAILWIND STYLES FOR CARD INPUT BOX */}
      <style jsx>{`
        .input-box {
          @apply w-full bg-white border border-[#CFE4FF] rounded-xl px-4 py-3 shadow-inner transition-all;
        }
        .input-box:focus-within {
          @apply border-[#007BFF] ring-4 ring-[#E5F0FF];
        }
      `}</style>
    </form>
  );
}
