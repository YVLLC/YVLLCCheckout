// pages/checkout/success.tsx

export default function SuccessPage() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "60px auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 6px 32px 0 #CFE4FF33",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#22C55E", fontWeight: 900, fontSize: 32, marginBottom: 12 }}>
        Payment Successful
      </h1>
      <p style={{ color: "#444", fontSize: 18, marginBottom: 28 }}>
        Thank you! Your order has been received and is being processed.<br />
        You’ll receive an update soon.
      </p>
      <a
        href="/"
        style={{
          display: "inline-block",
          background: "#007bff",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: 8,
          fontWeight: 700,
          textDecoration: "none",
          marginTop: 16,
          fontSize: 16,
        }}
      >
        Return Home
      </a>
    </div>
  );
}
