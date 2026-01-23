import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  async function loadUsers() {
    setError("");
    try {
      const data = await api("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function setRole(userId, role) {
    setError("");
    try {
      const updated = await api(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: { role },
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid">
      <div>
        <div className="eyebrow">Control center</div>
        <h2 className="h1">Admin Panel</h2>
        <p className="muted">Only ADMIN can access this page.</p>
      </div>

      {error && <p className="alert">{error}</p>}

      <div className="grid">
        {users.map((u) => (
          <div key={u.id} className="card adminRow">
            <div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="userTitle">{u.name}</div>
                <span className={`badge ${u.role === "ADMIN" ? "badgeDone" : "badgeTodo"}`}>
                  <span className="badgeDot" />
                  {u.role}
                </span>
              </div>
              <div className="muted">{u.email}</div>
            </div>

            <div className="row">
              <button className="btn btnGhost" onClick={() => setRole(u.id, "USER")}>Make USER</button>
              <button className="btn btnPrimary" onClick={() => setRole(u.id, "ADMIN")}>Make ADMIN</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn" onClick={loadUsers}>
        Refresh Users
      </button>
    </div>
  );
}
