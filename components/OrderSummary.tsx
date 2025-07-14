export default function OrderSummary({ order }: { order: any }) {
  if (!order) return null;
  return (
    <div>
      <div>Product: {order.product}</div>
      <div>Option: {order.option}</div>
      <div>Amount: {order.amount}</div>
      <div>Reference: {order.reference}</div>
      <div style={{ fontWeight: 700, marginTop: 12 }}>
        Total: ${order.total.toFixed(2)}
      </div>
    </div>
  );
}
