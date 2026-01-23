import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { saveAuth } from "../auth.js";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("student1@gmail.com");
    const [password, setPassword] = useState("Abcd@1234");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await api("/auth/login", { method: "POST", body: { email, password } });
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
                <div className="eyebrow">Welcome back</div>
                <h2 className="authTitle">Login</h2>
                <p className="muted">Pick up where you left off and keep tasks moving.</p>
            </div>
            <div className="card authCard">
                <form onSubmit={onSubmit} className="grid">
                    <label className="field">
                        <span>Email</span>
                        <input
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </label>
                    <label className="field">
                        <span>Password</span>
                        <input
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            type="password"
                        />
                    </label>

                    <button className="btn btnPrimary" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
            {error && <p className="alert">{error}</p>}

            <p className="muted">
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
