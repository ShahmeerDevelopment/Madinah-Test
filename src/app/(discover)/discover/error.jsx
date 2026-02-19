"use client";

import { useEffect } from "react";

/**
 * Discover Error Boundary
 *
 * Handles errors in the discover page and provides a retry mechanism.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Discover page error:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#333",
          marginBottom: "16px",
        }}
      >
        Something went wrong!
      </h2>
      <p
        style={{
          fontSize: "16px",
          color: "#666",
          marginBottom: "24px",
        }}
      >
        We couldn&apos;t load the discover page. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "500",
          color: "#fff",
          backgroundColor: "#1976d2",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
      >
        Try again
      </button>
    </div>
  );
}
