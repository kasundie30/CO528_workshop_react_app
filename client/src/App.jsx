
import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tasks from "./pages/Tasks.jsx";
import Admin from "./pages/Admin.jsx";
import Lab from "./pages/Lab.jsx";
import { clearAuth, getUser, isLoggedIn } from "./auth.js";

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

  function logout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="container">
      <header className="header">
        <div className="headerInner">
          <div className="brand">
            <strong>Workshop 2: Web Oriented Architecture</strong>
            <span className="pill muted">Dept. of Computer Engineering</span>
          </div>
          {isLoggedIn() ? (
            <nav className="nav">
              <Link to="/lab" className="pill">Lab Sheet</Link>
              <Link to="/tasks" className="pill">Tasks</Link>
              {user?.role === "ADMIN" && <Link to="/admin" className="pill">Admin</Link>}
            </nav>
          ) : (
            <nav className="nav">
              <Link to="/lab" className="pill">Lab Sheet</Link>
              <Link to="/login" className="pill">Login</Link>
              <Link to="/register" className="pill">Register</Link>
            </nav>
          )}
          <div className="row">
            {isLoggedIn() && user ? (
              <>
                <span className="muted">
                  {user.name} — <b>{user.role}</b>
                </span>
                <button onClick={logout} className="btn">Logout</button>
              </>
            ) : (
              <span className="muted">Not logged in</span>
            )}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/lab" replace />} />
        <Route path="/lab" element={<Lab />} />
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
