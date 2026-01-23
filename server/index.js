import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "./db.js";
import { requireAuth, requireRole } from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
}

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Register
app.post("/api/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { name, email, password } = parsed.data;
  const password_hash = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );
    const id = result.insertId;
    const token = signToken({ id, role: "USER" });
    res.json({ token, user: { id, name, email, role: "USER" } });
  } catch (e) {
    if (String(e).includes("Duplicate")) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { email, password } = parsed.data;
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// Me
app.get("/api/me", requireAuth, async (req, res) => {
  const [rows] = await pool.query("SELECT id,name,email,role FROM users WHERE id=?", [
    req.user.id,
  ]);
  res.json(rows[0]);
});

// Tasks (USER: only own tasks, ADMIN: all tasks)
app.get("/api/tasks", requireAuth, async (req, res) => {
  if (req.user.role === "ADMIN") {
    const [rows] = await pool.query(
      "SELECT t.*, u.name as owner_name FROM tasks t JOIN users u ON u.id=t.user_id ORDER BY t.created_at DESC"
    );
    return res.json(rows);
  }
  const [rows] = await pool.query(
    "SELECT * FROM tasks WHERE user_id=? ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(rows);
});

const taskCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
});

app.post("/api/tasks", requireAuth, async (req, res) => {
  const parsed = taskCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { title, description } = parsed.data;
  const [result] = await pool.query(
    "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
    [title, description || null, req.user.id]
  );

  const [rows] = await pool.query("SELECT * FROM tasks WHERE id=?", [result.insertId]);
  res.status(201).json(rows[0]);
});

// Status change (complex flow)
const statusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

app.patch("/api/tasks/:id/status", requireAuth, async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const taskId = Number(req.params.id);

  // Ensure ownership unless admin
  if (req.user.role !== "ADMIN") {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id=? AND user_id=?", [
      taskId,
      req.user.id,
    ]);
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
  }

  await pool.query("UPDATE tasks SET status=? WHERE id=?", [parsed.data.status, taskId]);
  const [updated] = await pool.query("SELECT * FROM tasks WHERE id=?", [taskId]);
  res.json(updated[0]);
});

// Admin: change roles
const roleSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });

app.patch("/api/admin/users/:id/role", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const userId = Number(req.params.id);
  await pool.query("UPDATE users SET role=? WHERE id=?", [parsed.data.role, userId]);
  const [rows] = await pool.query("SELECT id,name,email,role FROM users WHERE id=?", [userId]);
  res.json(rows[0]);
});

app.listen(process.env.PORT || 5000, () => {
  console.log("API running on port", process.env.PORT || 5000);
});


app.get("/api/admin/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const [rows] = await pool.query("SELECT id,name,email,role FROM users ORDER BY created_at DESC");
  res.json(rows);
});
