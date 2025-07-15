import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(117deg, #E6F0FF 0%, #FFFFFF 100%)",
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
          borderRadius: 22,
          boxShadow: "0 8px 32px 0 #007BFF14",
          background: "#fff",
          border: "1.5px solid #CFE4FF",
          padding: "54px 32px 38px",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            marginBottom: 12,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            color: "#007BFF",
          }}
        >
          Checkout Services Portal
        </h1>
        <p style={{ color: "#444444", marginBottom: 24, fontSize: 18, lineHeight: 1.6, fontWeight: 500 }}>
          Seamless, secure, and fast digital order processing for all your online needs.
        </p>
        <ul style={{
          margin: "0 0 32px",
          padding: 0,
          listStyle: "none",
          fontSize: 16,
          color: "#444444",
          textAlign: "left",
          fontWeight: 500,
        }}>
          <li style={{marginBottom: 10, display: "flex", alignItems: "center"}}>🚀 Fast, reliable order fulfillment</li>
          <li style={{marginBottom: 10, display: "flex", alignItems: "center"}}>🔒 Secure payment processing</li>
          <li style={{marginBottom: 10, display: "flex", alignItems: "center"}}>💡 Solutions for every business</li>
          <li style={{marginBottom: 10, display: "flex", alignItems: "center"}}>💬 24/7 support team</li>
        </ul>
        <Link href="/checkout">
          <button
            style={{
              padding: "16px 40px",
              fontSize: 20,
              fontWeight: 800,
              borderRadius: 13,
              background: "linear-gradient(90deg,#007BFF 30%,#005FCC 100%)",
              color: "#fff",
              border: "none",
              boxShadow: "0 4px 20px 0 #007BFF22",
              cursor: "pointer",
              transition: "background 0.22s",
              outline: "none",
            }}
          >
            Start Secure Checkout
          </button>
        </Link>
        <div style={{marginTop: 34, fontSize: 13.5, color: "#888888"}}>
          <span>Trusted digital checkout experience</span>
        </div>
      </div>
    </div>
  );
}