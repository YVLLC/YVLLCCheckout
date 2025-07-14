// pages/index.tsx

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7faff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="yesviral-card"
        style={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            marginBottom: 8,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          YesViral Checkout
        </h1>
        <p style={{ color: "#444", marginBottom: 28 }}>
          Start your secure order below.
        </p>
        <Link href="/checkout">
          <button
            style={{
              padding: "16px 32px",
              fontSize: 20,
              fontWeight: 600,
              borderRadius: 10,
              background: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Go to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
