import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) setReady(true);
  }, [router.isReady]);

  const platform = ready ? (router.query.platform as string) || "—" : "Loading...";
  const service = ready ? (router.query.service as string) || "—" : "Loading...";
  const quantity = ready ? (router.query.quantity as string) || "—" : "Loading...";
  const total = ready ? (router.query.total as string) || "—" : "Loading...";
  const reference = ready
    ? (router.query.reference as string) || (router.query.ref as string) || "—"
    : "Loading...";

  // ⭐ ALWAYS SHOW 30-DAY REFILL BASED ON TODAY
  const today = new Date();
  const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const refillDate = endDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const refillDaysLeft = 30;

  // Confetti
  useEffect(() => {
    if (!ready) return;
    const confetti = () => {
      const duration = 1600;
      const end = Date.now() + duration;
      (function frame() {
        const colors = ["#007BFF", "#00F2EA", "#22C55E", "#FACC15"];
        for (let i = 0; i < 25; i++) {
          const div = document.createElement("div");
          div.className = "confetti-piece";
          div.style.background = colors[Math.floor(Math.random() * colors.length)];
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
      <div className="min-h-screen flex items-center justify-center text-[#007BFF] text-xl font-extrabold">
        Preparing your success…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E6F0FF] to-[#F4F9FF] flex items-center justify-center px-4 py-20 overflow-hidden">

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#CFE4FF] rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Main success card */}
      <div className="
        relative w-full max-w-2xl
        bg-white/80 backdrop-blur-2xl
        border border-[#DCE8FF]
        shadow-[0_20px_60px_rgba(0,123,255,0.20)]
        rounded-3xl p-10 sm:p-12 text-center
        animate-fadeIn
      ">

        {/* Check Icon */}
        <div className="mx-auto mb-8 w-24 h-24 flex items-center justify-center bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-3xl shadow-[0_15px_40px_rgba(34,197,94,0.4)]">
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

        <h1 className="text-4xl font-black text-[#007BFF] tracking-tight">
          Thank You! 🎉
        </h1>

        <p className="mt-4 text-[#475569] text-lg font-medium leading-relaxed px-4">
          Your payment was successful and your order is now being prepared inside our Private Delivery Network.
          You’ll receive updates shortly.
        </p>

        {/* Order Summary */}
        <div className="mt-10 bg-white/70 border border-[#CFE4FF] rounded-2xl shadow-[0_10px_40px_rgba(0,123,255,0.08)] p-7 text-left">
          <h3 className="text-[#007BFF] text-xl font-extrabold mb-5 uppercase tracking-wide">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm font-semibold text-[#374151]">
            
            <div className="flex justify-between">
              <span>Platform</span>
              <span>{platform}</span>
            </div>

            <div className="flex justify-between">
              <span>Service</span>
              <span>{service}</span>
            </div>

            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>

            <div className="flex justify-between">
              <span>Username / Link</span>
              <span className="truncate max-w-[55%]">{reference}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Paid</span>
              <span>${total}</span>
            </div>

            <div className="flex justify-between pt-4 border-t mt-3">
              <span>Order Status</span>
              <span className="text-[#22C55E]">Processing</span>
            </div>

            {/* ⭐ ALWAYS SHOW 30-DAY REFILL */}
            <div className="flex justify-between pt-4 border-t mt-3">
              <span>Refill Guarantee</span>
              <span className="text-[#007BFF] font-semibold">
                {refillDaysLeft} days left • until {refillDate}
              </span>
            </div>

            <div className="flex justify-between pt-4 border-t mt-3">
              <span>Order Number</span>
              <span className="text-[#007BFF] font-bold">(Full details emailed to you)</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4">
          <a
            href="https://www.yesviral.com/track-order"
            className="
              w-full py-4 rounded-xl text-white text-lg font-bold
              bg-gradient-to-br from-[#007BFF] to-[#005FCC]
              shadow-[0_10px_35px_rgba(0,123,255,0.55)]
              hover:shadow-[0_12px_45px_rgba(0,123,255,0.65)]
              hover:scale-[1.02] active:scale-[0.97]
              transition-all
            "
          >
            Track Your Order
          </a>

          <a
            href="https://www.yesviral.com"
            className="
              w-full py-4 rounded-xl font-bold text-lg
              text-[#007BFF] bg-white border border-[#CFE4FF]
              hover:bg-[#EDF5FF] hover:border-[#9CCBFF]
              transition-all
            "
          >
            Return Home
          </a>
        </div>
      </div>

      <style jsx>{`
        .confetti-piece {
          position: fixed;
          top: -12px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
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
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
