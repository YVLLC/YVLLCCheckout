import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase"; // ⭐ ADDED

export default function SuccessPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // ⭐ NEW: Live order fetched from Supabase
  const [latestOrder, setLatestOrder] = useState<any>(null);

  // Ensure router.query is ready
  useEffect(() => {
    if (router.isReady) setReady(true);
  }, [router.isReady]);

  // Extract parameters (support both "reference" and "ref")
  const platform = ready ? (router.query.platform as string) || "—" : "Loading...";
  const service = ready ? (router.query.service as string) || "—" : "Loading...";
  const quantity = ready ? (router.query.quantity as string) || "—" : "Loading...";
  const total = ready ? (router.query.total as string) || "—" : "Loading...";

  const reference = ready
    ? (router.query.reference as string) ||
      (router.query.ref as string) ||
      "—"
    : "Loading...";

  // ⭐ NEW: Load latest order for logged-in user OR fallback to last created order
  useEffect(() => {
    if (!ready) return;

    async function load() {
      // 1️⃣ Try to load logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let orderRes;

      if (user?.id) {
        // User logged in → fetch their most recent order
        orderRes = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);
      } else {
        // User NOT logged in → fallback: get most recent global order created in last 2 minutes
        orderRes = await supabase
          .from("orders")
          .select("*")
          .gte("created_at", new Date(Date.now() - 2 * 60000).toISOString())
          .order("created_at", { ascending: false })
          .limit(1);
      }

      if (orderRes.data && orderRes.data.length > 0) {
        setLatestOrder(orderRes.data[0]);
      }
    }

    load();
  }, [ready]);

  // Confetti effect
  useEffect(() => {
    if (!ready) return;

    const confetti = () => {
      const duration = 1800;
      const end = Date.now() + duration;
      (function frame() {
        const colors = ["#007BFF", "#00F2EA", "#FF0000", "#22C55E", "#FACC15"];
        for (let i = 0; i < 30; i++) {
          const div = document.createElement("div");
          div.className = "confetti-piece";
          div.style.background =
            colors[Math.floor(Math.random() * colors.length)];
          document.body.appendChild(div);
          setTimeout(() => div.remove(), 1500);
        }
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    };
    confetti();
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#007BFF] text-xl font-bold">
        Loading your order…
      </div>
    );
  }

  // ⭐ Extract Followiz Order ID
  const followizOrder = latestOrder?.followiz_order_id || "Pending…";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#EEF6FF] to-[#F7FAFD] flex items-center justify-center px-4 py-16 overflow-hidden">

      {/* Background Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#CFE4FF] rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div
        className="
          relative w-full max-w-xl
          bg-white/80 backdrop-blur-2xl
          border border-[#DCE8FF]
          shadow-[0_20px_80px_rgba(0,123,255,0.18)]
          rounded-3xl p-10 text-center
          animate-fadeIn
        "
      >
        {/* Success Icon */}
        <div className="relative mx-auto mb-8 w-24 h-24 rounded-3xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center shadow-[0_15px_40px_rgba(34,197,94,0.35)]">
          <svg
            className="w-14 h-14 text-[#22C55E]"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#22C55E] tracking-tight">
          Payment Successful!
        </h1>

        <p className="mt-4 text-[#475569] text-lg leading-relaxed font-medium px-3">
          Your order has been received and is now being processed.
          <br />
          You’ll receive updates shortly.
        </p>

        {/* Order Summary */}
        <div className="mt-10 bg-white/70 border border-[#CFE4FF] rounded-2xl shadow-[0_8px_30px_rgba(0,123,255,0.07)] p-6 text-left">
          <h3 className="text-[#007BFF] text-xl font-extrabold mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm font-medium text-[#374151]">
            <div className="flex justify-between">
              <span>Platform</span>
              <span className="font-semibold">{platform}</span>
            </div>

            <div className="flex justify-between">
              <span>Service</span>
              <span className="font-semibold">{service}</span>
            </div>

            <div className="flex justify-between">
              <span>Quantity</span>
              <span className="font-semibold">{quantity}</span>
            </div>

            <div className="flex justify-between">
              <span>Target</span>
              <span className="font-semibold truncate max-w-[55%]">
                {reference}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Paid</span>
              <span className="font-semibold">${total}</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-[#22C55E] font-semibold">Processing</span>
            </div>

            {/* ⭐ NEW → Followiz Order Number */}
            <div className="flex justify-between mt-4 pt-3 border-t">
              <span>Order Number</span>
              <span className="font-bold text-[#007BFF]">
                {followizOrder}
              </span>
            </div>
          </div>

          <div className="mt-4 text-xs text-[#94A3B8] text-right">
            (Full details emailed to you)
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 items-center">
          <a
            href={
              followizOrder !== "Pending…" 
                ? `https://www.yesviral.com/track-order?orderId=${followizOrder}`
                : "https://www.yesviral.com/track-order"
            }
            className="
              w-full py-4 rounded-xl text-white text-lg font-bold
              bg-gradient-to-br from-[#007BFF] to-[#005FCC]
              shadow-[0_8px_28px_rgba(0,123,255,0.45)]
              hover:shadow-[0_10px_40px_rgba(0,123,255,0.6)]
              hover:scale-[1.02] active:scale-[0.97]
              transition-all
            "
          >
            {followizOrder !== "Pending…"
              ? "Track Your Order"
              : "Track Order (Pending…)"}
          </a>

          <a
            href="https://www.yesviral.com"
            className="
              w-full py-4 rounded-xl font-bold text-lg
              text-[#007BFF] bg-white border border-[#CFE4FF]
              hover:bg-[#F0F7FF] hover:border-[#7FB5FF]
              transition-all
            "
          >
            Return Home
          </a>
        </div>
      </div>

      {/* Confetti CSS */}
      <style jsx>{`
        .confetti-piece {
          position: fixed;
          top: -10px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          opacity: 1;
          animation: fall 1.5s linear forwards;
        }

        @keyframes fall {
          to {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
