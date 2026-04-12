import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{
      background: "#070f1c", borderBottom: "1px solid rgba(255,255,255,0.07)",
      padding: "0 40px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <span style={{ fontSize: 22 }}>🌙</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>SleepSync</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {["/" , "/log", "/results", "/history"].map((path, i) => {
          const labels = ["Home", "Log", "Results", "History"];
          return (
            <Link key={path} to={path} style={{
              color: "#4a6480", textDecoration: "none", padding: "0 16px",
              height: 62, display: "flex", alignItems: "center",
              fontSize: 14, fontWeight: 500,
            }}>
              {labels[i]}
            </Link>
          );
        })}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 12 }}>
            <span style={{ fontSize: 13, color: "#4a6480" }}> 👋 {user.username}</span>
            <button onClick={handleLogout} style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "8px 16px", color: "#fff",
              cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" style={{
            background: "#00d4a8", borderRadius: 8, padding: "9px 18px",
            color: "#060e1b", textDecoration: "none", fontSize: 13, fontWeight: 700, marginLeft: 12,
          }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}