export default function OrderSummary({ order }: { order: any }) {
  if (!order) return null;

  // Stripe-Safe: Remap order keys to neutral
  const {
    package: pkg = "Premium Package",
    type = "Standard",
    amount = order.amount || order.quantity || "--",
    reference = order.reference || "—",
    total = order.total
  } = order;

  return (
    <div
      className="order-summary-card"
      style={{
        marginBottom: 24,
        padding: "1.3rem 1.4rem",
        borderRadius: 18,
        border: "1.5px solid #E3EDFC",
        background: "linear-gradient(105deg,#f7fbff 0%,#f4faff 100%)",
        boxShadow: "0 4px 22px 0 #007bff10",
        fontSize: 17,
        color: "#1e293b",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          marginBottom: 12,
          fontSize: 21,
          letterSpacing: "-.01em",
          color: "#007BFF"
        }}
      >
        Your Order
      </div>
      <div className="os-row" style={{ margin: "14px 0 6px 0", fontWeight: 600 }}>
        <span>Package</span>
        <span style={{ color: "#222" }}>{pkg}</span>
      </div>
      <div className="os-row" style={{ margin: "6px 0", fontWeight: 500 }}>
        <span>Type</span>
        <span style={{ color: "#2b4d7b" }}>{type}</span>
      </div>
      <div className="os-row" style={{ margin: "6px 0" }}>
        <span>Amount</span>
        <span>{amount}</span>
      </div>
      <div className="os-row" style={{ margin: "6px 0" }}>
        <span>Reference</span>
        <span>{reference}</span>
      </div>
      <div
        className="os-row"
        style={{
          marginTop: 16,
          fontWeight: 800,
          fontSize: 20,
          color: "#12b886"
        }}
      >
        <span>Total</span>
        <span>${(typeof total === "number" ? total.toFixed(2) : "--")}</span>
      </div>
      <style jsx>{`
        .os-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 2px;
        }
      `}</style>
    </div>
  );
}
