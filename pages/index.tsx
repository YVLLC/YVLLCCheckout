// pages/index.tsx

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f7faff 0%, #f4faff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
          borderRadius: 18,
          boxShadow: "0 2px 16px 0 #007bff14",
          background: "#fff",
          border: "1.5px solid #e3edfc",
          padding: "44px 24px 36px",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            marginBottom: 10,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#007BFF",
          }}
        >
          YesViral Solutions
        </h1>
        <p style={{ color: "#22324d", marginBottom: 20, fontSize: 18, lineHeight: 1.6, fontWeight: 500 }}>
          Next-generation platform for digital growth, audience engagement, and professional marketing tools.
        </p>
        <ul style={{
          margin: "0 0 26px",
          padding: 0,
          listStyle: "none",
          fontSize: 15,
          color: "#222",
          textAlign: "left",
          fontWeight: 500,
        }}>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>🚀 Fast, reliable fulfillment</li>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>🔒 Secure online payments</li>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>📈 Scalable growth for all clients</li>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>💬 24/7 support team</li>
        </ul>
        <Link href="/checkout">
          <button
            style={{
              padding: "16px 38px",
              fontSize: 20,
              fontWeight: 700,
              borderRadius: 12,
              background: "linear-gradient(90deg,#007bff 30%,#21e2ff 100%)",
              color: "#fff",
              border: "none",
              boxShadow: "0 2px 18px 0 #007bff14",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Start Secure Checkout
          </button>
        </Link>
        <div style={{marginTop: 30, fontSize: 13, color: "#95a7be"}}>
          <span>Trusted digital services platform • YesViral</span>
        </div>
      </div>
    </div>
  );
}
