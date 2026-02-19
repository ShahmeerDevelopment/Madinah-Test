import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "16px", color: "#333" }}>
        404
      </h1>
      <h2 style={{ fontSize: "24px", marginBottom: "24px", color: "#666" }}>
        Page Not Found
      </h2>
      <p style={{ marginBottom: "32px", color: "#888" }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          backgroundColor: "#2A9D8F",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "500",
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
}
