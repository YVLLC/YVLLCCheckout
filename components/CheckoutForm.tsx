import { useEffect, useState } from "react";
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

// ------------------------------------------------------------
// CARD STYLE
// ------------------------------------------------------------

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      fontWeight: 500,
      color: "#111827",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      iconColor: "#007BFF",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------

export default function CheckoutForm({ order }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cardBrand, setCardBrand] = useState<string | null>(null);

  // ------------------------------------------------------------
  // APPLE PAY / GOOGLE PAY SETUP
  // ------------------------------------------------------------

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

        pr.on("paymentmethod", async (ev: any) => {
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

          const { clientSecret } = await res.json();

          const { error: confirmError } = await stripe!.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

          if (confirmError) {
            ev.complete("fail");
            setError(confirmError.message || "Payment failed.");
          } else {
            ev.complete("success");
            window.location.href = "/checkout/success";
          }
        });
      }
    });
  }, [stripe]);

  // ------------------------------------------------------------
  // CARD BRAND DETECTION
  // ------------------------------------------------------------

  useEffect(() => {
    if (!elements) return;

    const cardNumber = elements.getElement(CardNumberElement);

    if (!cardNumber) return;

    const handler = (event: any) => {
      setCardBrand(event.brand);
    };

    cardNumber.on("change", handler);

    return () => {
      cardNumber.off("change", handler);
    };
  }, [elements]);

  const brandImage = () => {
    switch (cardBrand) {
      case "visa":
        return "/cards/visa.svg";
      case "mastercard":
        return "/cards/mastercard.svg";
      case "amex":
        return "/cards/amex.svg";
      case "discover":
        return "/cards/discover.svg";
      case "diners":
        return "/cards/diners.svg";
      case "jcb":
        return "/cards/jcb.svg";
      default:
        return null;
    }
  };

  // ------------------------------------------------------------
  // SUBMIT HANDLER
  // ------------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
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
        throw new Error(serverError || "Problem creating payment.");

      const card = elements?.getElement(CardNumberElement);
      if (!stripe || !card)
        throw new Error("Card element not ready.");

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card } }
      );

      if (stripeError)
        throw new Error(stripeError.message || "Payment failed.");

      window.location.href = "/checkout/success";
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ------------------------------------------------------------
  // UI LAYOUT
  // ------------------------------------------------------------

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
      {/* Apple Pay / Google Pay */}
      {paymentRequest && (
        <div className="w-full">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                type: "default",
                theme: "dark",
                height: "44px",
              },
            }}
          />
          <p className="text-center text-xs text-[#6B7280] mt-2">
            Pay instantly with Apple Pay / Google Pay
          </p>
        </div>
      )}

      {/* CARD NUMBER */}
      <Field label="Card Number">
        <div className="relative flex items-center">
          <CardNumberElement options={cardStyle} />

          {brandImage() && (
            <img
              src={brandImage()!}
              alt="brand"
              className="w-9 h-6 absolute right-3 opacity-80"
            />
          )}
        </div>
      </Field>

      {/* EXP + CVC */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Expiration">
          <CardExpiryElement options={cardStyle} />
        </Field>

        <Field label="CVC">
          <CardCvcElement options={cardStyle} />
        </Field>
      </div>

      {/* SECURE BADGE */}
      <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
        <span>Secured by Stripe • Card details never touch YesViral.</span>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-12 rounded-2xl 
          bg-gradient-to-r from-[#007BFF] to-[#005FCC] 
          text-white text-base font-bold 
          shadow-[0_12px_35px_rgba(0,123,255,0.55)]
          transition-all hover:scale-[1.01]
          disabled:opacity-50 disabled:shadow-none
        "
      >
        {loading ? "Processing…" : "Complete Secure Payment"}
      </button>

      <p className="text-[11px] text-center text-[#6B7280]">
        By paying, you agree to YesViral Terms & Refund Policy.
      </p>
    </form>
  );
}

// ------------------------------------------------------------
// FIELD COMPONENT
// ------------------------------------------------------------

function Field({ label, children }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        {label}
      </label>

      <div
        className="
          w-full bg-white border border-[#CFE4FF]
          rounded-xl px-4 py-3 shadow-inner
          focus-within:border-[#007BFF]
          focus-within:ring-4 focus-within:ring-[#E5F0FF]
          transition-all
        "
      >
        {children}
      </div>
    </div>
  );
}
