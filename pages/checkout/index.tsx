// pages/checkout/index.tsx

import OrderSummary from "../../components/OrderSummary";
import CheckoutForm from "../../components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "60px auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 6px 32px 0 #CFE4FF33",
      }}
    >
      <h1
        style={{
          fontSize: 30,
          fontWeight: 900,
          marginBottom: 12,
          color: "#111",
        }}
      >
        Checkout
      </h1>
      <OrderSummary />
      <CheckoutForm />
    </div>
  );
}
