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
        <div className="authLayout">
            <div>
                <div className="eyebrow">New here?</div>
                <h2 className="authTitle">Register</h2>
                <p className="muted">Create an account to map ideas into action.</p>
            </div>

            <div className="card authCard">
                {/* form */
                    <form onSubmit={onSubmit} className="grid">
                        <label className="field">
                            <span>Name</span>
                            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                        </label>
                        <label className="field">
                            <span>Email</span>
                            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                        </label>
                        <label className="field">
                            <span>Password</span>
                            <input
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                type="password"
                            />
                        </label>

                        <button className="btn btnPrimary" disabled={loading}>
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                    </form>
                }
            </div>

            {error && <p className="alert">{error}</p>}

            <p className="muted">
                Have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
