import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AuthShell({ title, children }) {
  const loc = useLocation();
  const isLogin = loc.pathname === "/login";

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          border: "1px solid #dfe7df",
          borderRadius: 18,
          padding: 18,
          background: "#f3fbf5",
          boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <Link
            to="/login"
            style={{
              flex: 1,
              textAlign: "center",
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid #cfe6d3",
              background: isLogin ? "#1f7a2e" : "#ffffff",
              color: isLogin ? "#ffffff" : "#1f7a2e",
              fontWeight: 700,
            }}
          >
            Login
          </Link>

          <Link
            to="/register"
            style={{
              flex: 1,
              textAlign: "center",
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid #cfe6d3",
              background: !isLogin ? "#1f7a2e" : "#ffffff",
              color: !isLogin ? "#ffffff" : "#1f7a2e",
              fontWeight: 700,
            }}
          >
            Register
          </Link>
        </div>

        <h2 style={{ margin: "6px 0 14px 0" }}>{title}</h2>

        {children}
      </div>
    </div>
  );
}
