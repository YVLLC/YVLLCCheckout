// pages/_app.tsx
import type { AppProps } from "next/app";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "../styles/globals.css";
import Script from "next/script"; // ✅ REQUIRED
import { useRouter } from "next/router"; // ✅ REQUIRED
import { useEffect } from "react"; // ✅ REQUIRED

// Load Stripe using your LIVE publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // ✅ META PIXEL SPA PAGEVIEW FIX
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "PageView");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* ================= META PIXEL ================= */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1196656872434686');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* ================= NOSCRIPT FALLBACK ================= */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1196656872434686&ev=PageView&noscript=1"
        />
      </noscript>

      <Elements stripe={stripePromise}>
        <Component {...pageProps} />
      </Elements>
    </>
  );
}
