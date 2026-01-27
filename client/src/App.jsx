
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tasks from "./pages/Tasks.jsx";
import Admin from "./pages/Admin.jsx";
import { clearAuth, getUser, isLoggedIn } from "./auth.js";
import { io } from "socket.io-client";
import NotificationPopup from "./components/NotificationPopup.jsx";

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const user = getUser();
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!user || user.role !== "ADMIN") return <Navigate to="/tasks" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const user = getUser();
  const [notification, setNotification] = useState(null);

  function logout() {
    clearAuth();
    navigate("/login");
  }

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to notification service via WebSocket");
    });

    socket.on("taskCreated", (event) => {
      setNotification(
        `New Task Created: ${event.metadata.title} (ID: ${event.taskId})`
      );
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from notification service via WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 900, margin: "0 auto", padding: 16 }}>
      {notification && (
        <NotificationPopup
          message={notification}
          onClose={handleCloseNotification}
        />
      )}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          paddingBottom: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <strong>Simple App</strong>
          {isLoggedIn() ? (
            <>
              <Link to="/tasks">Tasks</Link>
              {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {isLoggedIn() && user ? (
            <>
              <span>
                {user.name} — <b>{user.role}</b>
              </span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <span style={{ color: "#666" }}>Not logged in</span>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}
