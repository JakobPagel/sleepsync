import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function AuthPage() {
  const [mode, setMode]   = useState("login");
  const [form, setForm]   = useState({ username: "", email: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleLogin = async () => {
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    }
  };

  const handleRegister = async () => {
    if (form.password !== form.password2) return setError("Passwords do not match.");
    try {
      await register(form.username, form.email, form.password, form.password2);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.username?.[0] || "Registration failed.");
    }
  };

  const inp = {
    width: "100%", background: "#0a1624", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10, padding: "13px 16px", color: "#dce9f5", fontSize: 15,
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08111e", color: "#dce9f5" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", padding: "64px 32px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          {/* Toggle */}
          <div style={{ display: "flex", background: "#0f1e32", borderRadius: 12, padding: 4, marginBottom: 32, width: "fit-content" }}>
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                background: mode === m ? "#00d4a8" : "transparent",
                border: "none", borderRadius: 9, padding: "9px 28px",
                color: mode === m ? "#060e1b" : "#4a6480",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div style={{ background: "#0f1e32", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 32 }}>
            <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>
              {mode === "login" ? "Sign In" : "Sign Up"}
            </h2>
            <div style={{ height: 3, width: 60, background: "#00d4a8", borderRadius: 2, marginBottom: 28 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#4a6480", marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>Username</div>
                <input style={inp} placeholder="your_username" value={form.username} onChange={update("username")} />
              </div>

              {mode === "register" && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#4a6480", marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>Email</div>
                  <input style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={update("email")} />
                </div>
              )}

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#4a6480", marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>Password</div>
                <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={update("password")} />
              </div>

              {mode === "register" && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#4a6480", marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>Confirm Password</div>
                  <input style={inp} type="password" placeholder="repeat password" value={form.password2} onChange={update("password2")} />
                </div>
              )}

              {error && <div style={{ color: "#e05555", fontSize: 13 }}>{error}</div>}

              <button onClick={mode === "login" ? handleLogin : handleRegister} style={{
                background: "#00d4a8", border: "none", borderRadius: 10,
                padding: "14px", color: "#060e1b", fontWeight: 700, fontSize: 15,
                cursor: "pointer", width: "100%", marginTop: 8,
              }}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}