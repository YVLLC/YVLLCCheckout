// components/PaymentButton.tsx

interface PaymentButtonProps {
  loading: boolean;
}

export default function PaymentButton({ loading }: PaymentButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        fontWeight: 600,
        fontSize: 18,
        borderRadius: 10,
        background: loading ? "#888" : "#007BFF",
        color: "#fff",
        border: "none",
        marginTop: 8,
        cursor: loading ? "wait" : "pointer",
        boxShadow: "0 2px 12px #CFE4FF44",
        transition: "background 0.18s",
      }}
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
