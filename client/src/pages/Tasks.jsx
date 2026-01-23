import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { getUser } from "../auth.js";

function StatusBadge({ status }) {
  const cls =
    status === "TODO" ? "badge badgeTodo"
    : status === "IN_PROGRESS" ? "badge badgeProg"
    : "badge badgeDone";

  return (
    <span className={cls}>
      <span className="badgeDot" />
      {status}
    </span>
  );
}

export default function Tasks() {
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const total = tasks.length;
  const doneCount = useMemo(() => tasks.filter(t => t.status === "DONE").length, [tasks]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  async function loadTasks() {
    setError("");
    setLoading(true);
    try {
      const data = await api("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask(e) {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    try {
      const newTask = await api("/tasks", {
        method: "POST",
        body: { title: title.trim(), description: description.trim() },
      });
      setTasks(prev => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      showToast("Task created ✅");
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeStatus(taskId, status) {
    setError("");
    try {
      const updated = await api(`/tasks/${taskId}/status`, {
        method: "PATCH",
        body: { status },
      });
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      showToast(`Status → ${status}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2 className="h1">Tasks</h2>
            <div className="muted">
              Welcome <b>{user?.name}</b> • {user?.role} • Done {doneCount}/{total}
            </div>
          </div>
          <button className="btn" onClick={loadTasks}>Refresh</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Create a task</h3>
        <form onSubmit={createTask} className="grid" style={{ maxWidth: 700 }}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title (min 3 chars)"
          />
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <div className="row">
            <button className="btn btnPrimary" type="submit">Create</button>
            <span className="muted">Saved in MySQL via API</span>
          </div>
        </form>

        {error && <div className="alert" style={{ marginTop: 12 }}>{error}</div>}
      </div>

      <div className="grid">
        {loading ? (
          <div className="card">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="card">
            <b>No tasks yet.</b>
            <div className="muted">Create your first task above.</div>
          </div>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="card">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div style={{ minWidth: 240 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <b style={{ fontSize: 16 }}>{t.title}</b>
                    <StatusBadge status={t.status} />
                    {t.owner_name && (
                      <span className="muted">Owner: {t.owner_name}</span>
                    )}
                  </div>
                  {t.description && <div className="muted" style={{ marginTop: 6 }}>{t.description}</div>}
                </div>

                <div className="row">
                  <select
                    className="select"
                    value={t.status}
                    onChange={(e) => changeStatus(t.id, e.target.value)}
                    style={{ width: 170 }}
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
