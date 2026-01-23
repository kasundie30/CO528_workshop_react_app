import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { saveAuth } from "../auth.js";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("Student 1");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("Abcd@1234");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        // simple client validation
        if (name.trim().length < 2) return setError("Name must be at least 2 characters.");
        if (!email.includes("@")) return setError("Enter a valid email.");
        if (password.length < 6) return setError("Password must be at least 6 characters.");

        setLoading(true);
        try {
            const data = await api("/auth/register", {
                method: "POST",
                body: { name, email, password },
            });
            saveAuth({ token: data.token, user: data.user });
            navigate("/tasks");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420 }}>
            <h2>Register</h2>

            <div className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
                {/* form */
                    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                        />

                        <button disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
                    </form>
                }
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <p style={{ marginTop: 10 }}>
                Have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
