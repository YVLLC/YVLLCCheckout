// pages/checkout/order-status.tsx

import { useState } from "react";

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulate order status lookup (replace with real API call!)
  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // TODO: Replace this with your real order status logic/API
    setTimeout(() => {
      if (orderId === "123456") {
        setStatus("Complete");
      } else if (orderId) {
        setStatus("Processing");
      } else {
        setStatus(null);
      }
      setLoading(false);
    }, 1200);
  };

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
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 18 }}>
        Order Status
      </h1>
      <form onSubmit={handleCheckStatus} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Enter your order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #CFE4FF",
            width: "70%",
            maxWidth: 260,
            marginRight: 12,
            marginBottom: 12,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 22px",
            fontWeight: 700,
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Status"}
        </button>
      </form>
      {status && (
        <div style={{
          fontWeight: 700,
          color: status === "Complete" ? "#22C55E" : "#007bff",
          fontSize: 20,
          marginTop: 12,
        }}>
          Status: {status}
        </div>
      )}
    </div>
  );
}
