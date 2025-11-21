import { CheckCircle } from "lucide-react";

export default function OrderSummary({ order }: { order: any }) {
  if (!order) return null;

  const {
    package: pkg = "Premium Package",
    type = "Standard",
    amount = order.amount || order.quantity || "--",
    reference = order.reference || "—",
    total = order.total,
  } = order;

  return (
    <div className="ys-order-summary">
      <div className="ys-summary-header">
        <CheckCircle size={30} className="ys-check" />
        <span>Review Your Order</span>
      </div>
      <div className="ys-summary-table">
        <div>
          <span className="ys-label">Package</span>
          <span>{pkg}</span>
        </div>
        <div>
          <span className="ys-label">Type</span>
          <span>{type}</span>
        </div>
        <div>
          <span className="ys-label">Amount</span>
          <span>{amount}</span>
        </div>
        <div>
          <span className="ys-label">Username / Link</span>
          <span>{reference}</span>
        </div>
      </div>
      <div className="ys-summary-total">
        <span>Total</span>
        <span>${typeof total === "number" ? total.toFixed(2) : "--"}</span>
      </div>
      <style jsx>{`
        .ys-order-summary {
          background: rgba(248,251,255,0.85);
          border-radius: 20px;
          padding: 2rem 1.7rem 1.5rem;
          box-shadow: 0 8px 36px #2176ff14, 0 1px 4px #22c55e09;
          border: 1.5px solid #d2e5fa;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          min-width: 320px;
          max-width: 470px;
          margin: 0 auto;
          margin-bottom: 24px;
        }
        .ys-summary-header {
          display: flex;
          align-items: center;
          gap: 0.5em;
          font-size: 1.25em;
          font-weight: 800;
          color: #186cd7;
          margin-bottom: 1.2em;
        }
        .ys-check {
          color: #22C55E;
        }
        .ys-summary-table > div {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eaf3ff;
          font-weight: 500;
        }
        .ys-label {
          color: #7b8ba8;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .ys-summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.3em;
          font-weight: 900;
          margin-top: 1.4em;
          color: #22C55E;
        }
        @media (max-width: 500px) {
          .ys-order-summary { padding: 1rem 0.4rem 1rem;}
        }
      `}</style>
    </div>
  );
}
