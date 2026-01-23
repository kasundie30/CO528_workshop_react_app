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
        <div style={{ maxWidth: 420 }}>
            <h2>Login</h2>
            <div className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                    />

                    <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                </form>
            </div>
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <p style={{ marginTop: 10 }}>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
