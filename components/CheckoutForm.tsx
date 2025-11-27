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

// Base style for card fields
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

export default function CheckoutForm({ order }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cardBrand, setCardBrand] = useState<string | null>(null);

  const pkg = order.package || `${order.service} Package`;
  const type = order.type || "High-Quality";

  // -----------------------------
  // Apple Pay / Google Pay setup
  // -----------------------------
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

        // Handle Apple Pay / Google Pay payment flow
        pr.on("paymentmethod", async (ev: any) => {
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
            if (serverError || !clientSecret) {
              ev.complete("fail");
              setError(serverError || "Unable to create payment.");
              return;
            }

            const { error: confirmError } = await stripe!.confirmCardPayment(
              clientSecret,
              {
                payment_method: ev.paymentMethod.id,
              },
              { handleActions: false }
            );

            if (confirmError) {
              ev.complete("fail");
              setError(confirmError.message || "Payment failed.");
              return;
            }

            ev.complete("success");
            window.location.href = "/checkout/success";
          } catch (err: any) {
            ev.complete("fail");
            setError(err.message || "Payment failed.");
          }
        });
      }
    });
  }, [stripe, order]);

  // -----------------------------
  // Card brand detection
  // -----------------------------
  useEffect(() => {
    if (!elements) return;

    const cardNumber = elements.getElement(CardNumberElement);

    if (!cardNumber) return;

    const handler = (event: any) => {
      setCardBrand(event.brand || null);
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
      default:
        return null;
    }
  };

  // -----------------------------
  // Standard card submit
  // -----------------------------
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
      if (serverError || !clientSecret) {
        throw new Error(serverError || "Unable to create payment.");
      }

      const cardElement = elements?.getElement(CardNumberElement);
      if (!stripe || !cardElement) {
        throw new Error("Card input not ready.");
      }

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed.");
      }

      window.location.href = "/checkout/success";
    } catch (err: any) {
      setError(err.message || "Unexpected error.");
    }

    setLoading(false);
  };

  // -----------------------------
  // UI
  // -----------------------------
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
      {/* Header / Summary Card */}
      <div
        className="
          w-full rounded-2xl
          bg-gradient-to-br from-[#007BFF] via-[#005FCC] to-[#001B4F]
          text-white
          p-5 sm:p-6
          shadow-[0_18px_55px_rgba(0,91,191,0.8)]
          flex flex-col gap-4
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            YesViral • Secure Checkout
          </span>
          <span className="text-[11px] font-semibold bg-white/15 px-2 py-1 rounded-full border border-white/25">
            256-bit SSL
          </span>
        </div>
        <div className="mt-1">
          <div className="text-[11px] text-white/70 mb-1">Total</div>
          <div className="text-3xl font-black tracking-tight">
            ${order.total.toFixed(2)}
          </div>
        </div>
        <div className="flex items-end justify-between mt-3 text-[11px] sm:text-xs">
          <div className="space-y-0.5">
            <div className="uppercase text-white/60">Platform</div>
            <div className="font-semibold">
              {order.platform} • {order.service}
            </div>
          </div>
          <div className="space-y-0.5 text-right">
            <div className="uppercase text-white/60">Quantity</div>
            <div className="font-semibold">
              {order.amount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div
        className="
          w-full rounded-2xl
          bg-[#F5FAFF]
          border border-[#DCEBFF]
          p-4 sm:p-5
          space-y-3
        "
      >
        <SummaryRow label="Package" value={pkg} />
        <SummaryRow label="Type" value={type} />
        <SummaryRow label="Username / Link" value={order.reference} />
        <div className="flex items-center justify-between text-base pt-2 border-t border-[#E1EDFF] mt-1">
          <span className="font-semibold text-[#111]">Total</span>
          <span className="text-xl font-black text-[#007BFF]">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Apple Pay / Google Pay */}
      {paymentRequest && (
        <div className="w-full">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              // after upgrading @stripe/stripe-js this style object is valid
              style: {
                paymentRequestButton: {
                  type: "buy",
                  theme: "dark",
                  height: "44px",
                },
              } as any, // keep TS happy across versions
            }}
            className="rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.18)]"
          />
          <div className="text-center text-xs text-[#6B7280] mt-2">
            Fast checkout with Apple Pay / Google Pay
          </div>
        </div>
      )}

      {/* Card section */}
      <div
        className="
          w-full
          rounded-2xl
          bg-gradient-to-br from-[#F6FAFF] to-white
          border border-[#DDE8FF]
          p-5 sm:p-6
          shadow-[0_12px_38px_rgba(0,123,255,0.12)]
          space-y-5
        "
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-[#005FCC] uppercase tracking-wide">
            Card Information
          </span>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="h-5 w-8 rounded-md bg-[#1A1F71]" />
            <span className="h-5 w-8 rounded-md bg-[#FF5F00]" />
            <span className="h-5 w-8 rounded-md bg-black" />
          </div>
        </div>

        {/* Card Number with brand icon */}
        <Field label="Card Number">
          <div className="relative flex items-center">
            <CardNumberElement options={cardStyle} />
            {brandImage() && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandImage() as string}
                alt="Card brand"
                className="w-9 h-6 absolute right-3 opacity-85"
              />
            )}
          </div>
        </Field>

        {/* Expiration / CVC */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiration">
            <CardExpiryElement options={cardStyle} />
          </Field>
          <Field label="CVC">
            <CardCvcElement options={cardStyle} />
          </Field>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          <span>Secured by Stripe • Card details never touch YesViral.</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-12
          rounded-2xl
          bg-gradient-to-r from-[#007BFF] to-[#005FCC]
          text-white text-base font-bold
          shadow-[0_12px_35px_rgba(0,123,255,0.55)]
          hover:from-[#005FCC] hover:to-[#0049A8]
          hover:shadow-[0_16px_45px_rgba(0,123,255,0.7)]
          transition-all
          disabled:opacity-50 disabled:shadow-none
        "
      >
        {loading ? "Processing…" : "Complete Secure Payment"}
      </button>

      <p className="text-[11px] text-center text-[#6B7280]">
        By completing this purchase, you agree to YesViral&apos;s Terms & Refund Policy.
      </p>
    </form>
  );
}

// Small field wrapper component
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        {label}
      </label>
      <div
        className="
          w-full bg-white border border-[#CFE4FF]
          rounded-xl px-4 py-3
          shadow-inner
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

// Simple summary row
function SummaryRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#6B7A90] font-medium">{label}</span>
      <span className="text-[#111827] font-semibold text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
