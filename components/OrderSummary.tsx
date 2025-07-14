export default function OrderSummary({ order }: { order: any }) {
  if (!order) return null;
  return (
    <div style={{
      marginBottom: 18,
      padding: "1rem",
      borderRadius: 10,
      border: "1px solid #CFE4FF",
      background: "#f8fbff",
      fontSize: 16
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 18 }}>Order Summary</div>
      <div><b>Product:</b> {order.product}</div>
      <div><b>Option:</b> {order.option}</div>
      <div><b>Amount:</b> {order.amount}</div>
      <div><b>Reference:</b> {order.reference}</div>
      <div style={{ fontWeight: 700, marginTop: 10 }}>Total: ${order.total?.toFixed(2) ?? "--"}</div>
    </div>
  );
}
