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
    <div>
      <h2>Admin Panel</h2>
      <p style={{ color: "#666" }}>Only ADMIN can access this page.</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div>
              <b>{u.name}</b> — {u.email} <br />
              Role: <b>{u.role}</b>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRole(u.id, "USER")}>Make USER</button>
              <button onClick={() => setRole(u.id, "ADMIN")}>Make ADMIN</button>
            </div>
          </div>
        ))}
      </div>

      <button style={{ marginTop: 12 }} onClick={loadUsers}>
        Refresh Users
      </button>
    </div>
  );
}
