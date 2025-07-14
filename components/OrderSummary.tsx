// components/OrderSummary.tsx

export default function OrderSummary() {
  // Replace these with props or real order info if needed
  const orderInfo = {
    service: "Example Service",
    price: 19.99,
  };

  return (
    <div
      style={{
        margin: "24px 0",
        padding: "1.25rem",
        border: "1px solid #E6F0FF",
        borderRadius: 16,
        background: "#f8fbff",
        fontSize: 16,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 18 }}>
        Order Summary
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <span style={{ color: "#444" }}>Service:</span>{" "}
          {orderInfo.service}
        </li>
        <li>
          <span style={{ color: "#444" }}>Price:</span>{" "}
          ${orderInfo.price.toFixed(2)}
        </li>
      </ul>
    </div>
  );
}
