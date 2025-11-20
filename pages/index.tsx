import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(117deg, #E6F0FF 0%, #FFFFFF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          borderRadius: 22,
          background: "#fff",
          border: "1.5px solid #CFE4FF",
          padding: "54px 32px 42px",
          boxShadow: "0 8px 32px 0 #007BFF14",
        }}
      >
        <h1
          style={{
            fontSize: 34,
            marginBottom: 10,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            color: "#007BFF",
          }}
        >
          Creator Tools Hub
        </h1>

        <p
          style={{
            color: "#555",
            marginBottom: 26,
            fontSize: 18,
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          A central place for creators to manage digital utilities, resources,
          and premium service tools — all in one simplified portal.
        </p>

        <ul
          style={{
            margin: "0 0 32px",
            padding: 0,
            listStyle: "none",
            textAlign: "left",
            fontSize: 16,
            color: "#444",
            fontWeight: 500,
          }}
        >
          <li style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
            🧩 Access creator utilities and workflow tools
          </li>
          <li style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
            🎛️ Manage your digital resources in one place
          </li>
          <li style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
            ☑️ Premium add-ons available for advanced features
          </li>
          <li style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
            📘 Simple, clean interface built for professionals
          </li>
        </ul>

        <Link href="/checkout">
          <button
            style={{
              padding: "16px 40px",
              fontSize: 20,
              fontWeight: 800,
              borderRadius: 13,
              background: "linear-gradient(90deg,#007BFF 30%,#005FCC 100%)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px 0 #007BFF22",
              transition: "background 0.22s",
            }}
          >
            Open Tools Panel
          </button>
        </Link>

        <div style={{ marginTop: 34, fontSize: 13.5, color: "#888" }}>
          Optimized for creators, freelancers & digital brands.
        </div>
      </div>
    </div>
  );
}
