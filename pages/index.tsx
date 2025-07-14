import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(117deg, #f7fafd 0%, #e8f4ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
          borderRadius: 20,
          boxShadow: "0 6px 28px 0 #2176ff15",
          background: "#fff",
          border: "1.5px solid #d2e5fa",
          padding: "48px 26px 36px",
        }}
      >
        <h1
          style={{
            fontSize: 34,
            marginBottom: 10,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#2176FF",
          }}
        >
          Checkout Services Portal
        </h1>
        <p style={{ color: "#22324d", marginBottom: 20, fontSize: 18, lineHeight: 1.6, fontWeight: 500 }}>
          Simple, secure, and efficient platform for processing digital service orders and managing your online experience.
        </p>
        <ul style={{
          margin: "0 0 28px",
          padding: 0,
          listStyle: "none",
          fontSize: 15,
          color: "#222",
          textAlign: "left",
          fontWeight: 500,
        }}>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>🚀 Fast, reliable order processing</li>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>🔒 Secure payment gateway</li>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>💡 Solutions for diverse business needs</li>
          <li style={{marginBottom: 8, display: "flex", alignItems: "center"}}>💬 Responsive support team</li>
        </ul>
        <Link href="/checkout">
          <button
            style={{
              padding: "15px 36px",
              fontSize: 20,
              fontWeight: 700,
              borderRadius: 12,
              background: "linear-gradient(90deg,#2176ff 30%,#21e2ff 100%)",
              color: "#fff",
              border: "none",
              boxShadow: "0 2px 18px 0 #2176ff13",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Start Secure Checkout
          </button>
        </Link>
        <div style={{marginTop: 32, fontSize: 13, color: "#95a7be"}}>
          <span>Trusted digital checkout portal</span>
        </div>
      </div>
    </div>
  );
}