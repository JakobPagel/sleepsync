import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#08111e", color: "#dce9f5" }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 64 }}>
          <span style={{ fontSize: 72 }}>🌙</span>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 16, lineHeight: 1.1 }}>
              Wake up to<br />better sleep.
            </h1>
            <p style={{ color: "#4a6480", fontSize: 18, lineHeight: 1.65, maxWidth: 460, marginBottom: 32 }}>
              Log your morning metrics and get a personalized recovery score + daily plan — every day.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <Link to="/login" style={{
                background: "#00d4a8", borderRadius: 10, padding: "14px 28px",
                color: "#060e1b", textDecoration: "none", fontWeight: 700, fontSize: 15,
              }}>
                Get Started →
              </Link>
              <Link to="/login" style={{ color: "#00d4a8", fontSize: 14, textDecoration: "none" }}>
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { icon: "📊", title: "Morning Log",     sub: "6 quick metrics every morning",          border: "#00d4a8" },
            { icon: "💤", title: "Sleep Score",     sub: "Weighted recovery score out of 100",     border: "#f5a623" },
            { icon: "📅", title: "Streak Tracker",  sub: "Calendar view of your consistency",      border: "#e05555" },
          ].map((f) => (
            <div key={f.title} style={{
              background: "#0f1e32", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: `4px solid ${f.border}`, padding: "28px 24px",
            }}>
              <span style={{ fontSize: 38, display: "block", marginBottom: 14 }}>{f.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 7 }}>{f.title}</div>
              <div style={{ color: "#4a6480", fontSize: 14, lineHeight: 1.55 }}>{f.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}