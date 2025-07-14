import React from "react";

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
    <div className="order-summary-container">
      <div className="order-summary-header">
        <span className="order-summary-icon">
          <svg width="36" height="36" viewBox="0 0 38 38" fill="none">
            <circle cx="19" cy="19" r="19" fill="#2176FF" />
            <path d="M25.5 14.5L17 23L12.5 18.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="order-summary-title">Order Summary</span>
      </div>
      <div className="order-summary-row">
        <span className="label">Package</span>
        <span className="value">{pkg}</span>
      </div>
      <div className="order-summary-row">
        <span className="label">Type</span>
        <span className="value highlight">{type}</span>
      </div>
      <div className="order-summary-row">
        <span className="label">Amount</span>
        <span className="value">{amount}</span>
      </div>
      <div className="order-summary-row">
        <span className="label">Reference</span>
        <span className="value">{reference}</span>
      </div>
      <div className="order-summary-divider" />
      <div className="order-summary-row total">
        <span className="label">Total</span>
        <span className="value total">
          ${typeof total === "number" ? total.toFixed(2) : "--"}
        </span>
      </div>
      <style jsx>{`
        .order-summary-container {
          margin-bottom: 28px;
          padding: 2rem 1.7rem 1.4rem 1.7rem;
          border-radius: 20px;
          border: 1.5px solid #d2e5fa;
          background: linear-gradient(100deg, #f5faff 0%, #e8f4ff 100%);
          box-shadow: 0 8px 36px 0 #2176ff17;
          font-size: 17px;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          color: #1a314b;
          min-width: 320px;
          max-width: 470px;
          transition: box-shadow 0.2s;
        }
        .order-summary-container:hover {
          box-shadow: 0 12px 46px 0 #2176ff24;
        }
        .order-summary-header {
          display: flex;
          align-items: center;
          font-weight: 900;
          font-size: 22px;
          color: #2176FF;
          margin-bottom: 18px;
          letter-spacing: -0.01em;
          gap: 0.6em;
        }
        .order-summary-icon {
          display: flex;
          align-items: center;
          margin-right: 2px;
        }
        .order-summary-title {
          font-size: 1.2em;
        }
        .order-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 12px 0 0 0;
          font-weight: 600;
          font-size: 17px;
        }
        .order-summary-row.total {
          font-size: 21px;
          font-weight: 900;
          color: #14b884;
          margin-top: 15px;
        }
        .label {
          color: #222c;
          letter-spacing: 0;
        }
        .value {
          color: #1e293b;
          font-weight: 700;
        }
        .value.highlight {
          color: #2176FF;
        }
        .value.total {
          color: #14b884;
        }
        .order-summary-divider {
          margin-top: 15px;
          margin-bottom: 4px;
          height: 2px;
          background: linear-gradient(90deg, #d2e5fa 0%, #e8f4ff 100%);
          border-radius: 4px;
        }
        @media (max-width: 480px) {
          .order-summary-container {
            padding: 1rem 0.6rem 1rem 0.6rem;
            min-width: unset;
            max-width: 100%;
          }
          .order-summary-header {
            font-size: 17px;
          }
          .order-summary-row,
          .order-summary-row.total {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}