// pages/checkout/error.tsx

export default function ErrorPage() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "60px auto",
        padding: "2rem",
        textAlign: "center",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 6px 32px 0 #CFE4FF33",
      }}
    >
      <h1 style={{ color: "#EF4444", fontWeight: 900, fontSize: 32, marginBottom: 8 }}>
        Error
      </h1>
      <p style={{ color: "#444", fontSize: 18 }}>
        There was a problem processing your order.<br />
        Please try again or contact support if the issue persists.
      </p>
      <a
        href="/checkout"
        style={{
          display: "inline-block",
          marginTop: 32,
          background: "#007bff",
          color: "#fff",
          padding: "12px 28px",
          borderRadius: 8,
          fontWeight: 700,
          textDecoration: "none",
          transition: "background 0.2s",
        }}
      >
        Back to Checkout
      </a>
    </div>
  );
}
