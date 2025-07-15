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
    <div className="order-summary-root">
      <div className="order-summary-header">
        <span className="summary-checkmark-outer">
          <span className="summary-checkmark-anim">
            <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="22" fill="#2176FF" />
              <path d="M30 17L20 27L15 22" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </span>
        <span className="order-summary-title">Order Summary</span>
      </div>
      <div className="order-summary-row pill">
        <span className="label">Package</span>
        <span className="value pill">{pkg}</span>
      </div>
      <div className="order-summary-row pill">
        <span className="label">Type</span>
        <span className="value highlight">{type}</span>
      </div>
      <div className="order-summary-row pill">
        <span className="label">Amount</span>
        <span className="value">{amount}</span>
      </div>
      <div className="order-summary-row pill">
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
        .order-summary-root {
          margin-bottom: 30px;
          padding: 2.1rem 2rem 1.55rem 2rem;
          border-radius: 1.8rem;
          border: 1.7px solid #d6eaff;
          background: linear-gradient(120deg, #fafdff 0%, #e7f3ff 100%);
          box-shadow: 0 8px 48px 0 #2176ff18, 0 2px 10px 0 #98caff17;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          min-width: 320px;
          max-width: 460px;
          transition: box-shadow 0.22s cubic-bezier(.4,1,.6,1);
          backdrop-filter: blur(2.5px);
          position: relative;
        }
        .order-summary-root:hover {
          box-shadow: 0 16px 52px 0 #2176ff26, 0 4px 24px 0 #98caff1e;
        }
        .order-summary-header {
          display: flex;
          align-items: center;
          font-weight: 900;
          font-size: 25px;
          color: #2176FF;
          margin-bottom: 22px;
          gap: 0.68em;
          letter-spacing: -0.02em;
          user-select: none;
        }
        .order-summary-title {
          font-size: 1.2em;
          font-family: inherit;
          color: #2176FF;
          letter-spacing: -0.01em;
        }
        .summary-checkmark-outer {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(120deg, #2176ff 40%, #39beff 100%);
          box-shadow: 0 4px 22px #3ab6ff2a, 0 0px 6px #39beff19;
        }
        .summary-checkmark-anim {
          animation: pop 0.7s cubic-bezier(.44,1.72,.57,1) both;
        }
        @keyframes pop {
          0% { transform: scale(0.7);}
          65% { transform: scale(1.15);}
          100% { transform: scale(1);}
        }
        .order-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 13px;
          margin-bottom: 0;
          font-weight: 600;
          font-size: 1.07rem;
        }
        .order-summary-row.pill .value,
        .order-summary-row.pill .label {
          padding: 0.18em 0.86em;
          border-radius: 14px;
          background: rgba(230,245,255,0.75);
          font-size: 1em;
        }
        .order-summary-row.pill .label {
          color: #2176ff;
          font-weight: 700;
          margin-right: 10px;
          background: #f5faff;
        }
        .order-summary-row.pill .value {
          color: #15305c;
          font-weight: 700;
          background: #ecf5ff;
        }
        .order-summary-row .highlight {
          color: #2176FF;
          font-weight: 700;
          background: #e4f0ff;
        }
        .order-summary-divider {
          margin: 22px 0 7px 0;
          height: 2.5px;
          background: linear-gradient(90deg, #d2e5fa 0%, #e8f4ff 100%);
          border-radius: 8px;
        }
        .order-summary-row.total {
          font-size: 23px;
          font-weight: 900;
          color: #14b884;
          margin-top: 18px;
        }
        .value.total {
          color: #14b884;
          font-weight: 900;
          letter-spacing: -0.01em;
        }
        @media (max-width: 500px) {
          .order-summary-root {
            padding: 1.2rem 0.7rem 1.2rem 0.7rem;
            min-width: unset;
            max-width: 100vw;
          }
          .order-summary-header {
            font-size: 18px;
            gap: 0.5em;
          }
          .order-summary-row,
          .order-summary-row.total {
            font-size: 15px;
          }
          .summary-checkmark-outer {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
}
