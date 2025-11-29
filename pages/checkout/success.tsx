import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(7);

  // Countdown auto redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          window.location.href = "/";
          return 1;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Trigger confetti burst on load
  useEffect(() => {
    const confetti = () => {
      const duration = 1800;
      const end = Date.now() + duration;

      (function frame() {
        if (typeof window === "undefined") return;

        // Lightweight confetti without libs
        const colors = ["#007BFF", "#00F2EA", "#FF0000", "#22C55E", "#FACC15"];
        for (let i = 0; i < 30; i++) {
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
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#EEF6FF] to-[#F7FAFD] flex items-center justify-center px-4 py-16 overflow-hidden">

      {/* FLOATING BACKGROUND PARTICLES */}
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

      {/* MAIN CARD */}
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
        {/* GLOWING RING BEHIND ICON */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="w-40 h-40 bg-[#007BFF]/20 rounded-full blur-3xl"></div>
        </div>

        {/* SUCCESS ICON */}
        <div className="relative mx-auto mb-8 w-24 h-24 rounded-3xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center shadow-[0_15px_40px_rgba(34,197,94,0.35)]">
          {/* SPARKLES */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-300 rounded-full animate-ping opacity-60" />
          <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-80" />

          {/* Checkmark SVG */}
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

        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#22C55E] tracking-tight">
          Payment Successful!
        </h1>

        {/* SUBTEXT */}
        <p className="mt-4 text-[#475569] text-lg leading-relaxed font-medium px-3">
          Your order has been received and is now being processed.
          <br />
          You’ll receive updates shortly.
        </p>

        {/* ORDER SUMMARY */}
        <div className="mt-10 bg-white/70 border border-[#CFE4FF] rounded-2xl shadow-[0_8px_30px_rgba(0,123,255,0.07)] p-6 text-left">
          <h3 className="text-[#007BFF] text-xl font-extrabold mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm font-medium text-[#374151]">
            <div className="flex justify-between">
              <span>Package</span>
              <span className="font-semibold text-[#0F172A]">Premium Delivery</span>
            </div>
            <div className="flex justify-between">
              <span>Platform</span>
              <span className="font-semibold text-[#0F172A]">Social Media</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-[#22C55E] font-semibold">Processing</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-[#94A3B8] text-right">
            (Full details emailed to you)
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col gap-4 items-center">
          {/* TRACK ORDER */}
          <a
            href="/track-order"
            className="
              w-full py-4 rounded-xl text-white text-lg font-bold
              bg-gradient-to-br from-[#007BFF] to-[#005FCC]
              shadow-[0_8px_28px_rgba(0,123,255,0.45)]
              hover:shadow-[0_10px_40px_rgba(0,123,255,0.6)]
              hover:scale-[1.02] active:scale-[0.97]
              transition-all
            "
          >
            Track Your Order
          </a>

          {/* RETURN HOME */}
          <a
            href="/"
            className="
              w-full py-4 rounded-xl font-bold text-lg
              text-[#007BFF] bg-white border border-[#CFE4FF]
              hover:bg-[#F0F7FF] hover:border-[#7FB5FF]
              transition-all
            "
          >
            Return Home
          </a>

          {/* COUNTDOWN */}
          <p className="text-xs text-[#94A3B8] mt-1">
            Redirecting you in {countdown} seconds…
          </p>
        </div>
      </div>

      {/* CONFETTI CSS */}
      <style jsx>{`
        .confetti-piece {
          position: fixed;
          top: -10px;
          left: ${Math.random() * 100}%;
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

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
