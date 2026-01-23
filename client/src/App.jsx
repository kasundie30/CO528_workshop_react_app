
import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tasks from "./pages/Tasks.jsx";
import Admin from "./pages/Admin.jsx";
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
    <div className="appShell">
      <header className="header">
        <div className="headerInner">
          <div className="brand">
            <span className="brandIcon">✨</span>
            <div>
              <div className="brandTitle">Creative Tasks</div>
              <div className="brandSubtitle">Plan, build, and shine</div>
            </div>
          </div>

          <nav className="nav">
            {isLoggedIn() ? (
              <>
                <Link className="pill" to="/tasks">Tasks</Link>
                {user?.role === "ADMIN" && <Link className="pill" to="/admin">Admin</Link>}
              </>
            ) : (
              <>
                <Link className="pill" to="/login">Login</Link>
                <Link className="pill" to="/register">Register</Link>
              </>
            )}
          </nav>

          <div className="userMeta">
            {isLoggedIn() && user ? (
              <>
                <span className="userBadge">
                  {user.name} • <b>{user.role}</b>
                </span>
                <button className="btn btnGhost" onClick={logout}>Logout</button>
              </>
            ) : (
              <span className="muted">Not logged in</span>
            )}
          </div>
        </div>
      </header>

      <main className="container">
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

          <Route path="*" element={<div className="card">404 Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}
