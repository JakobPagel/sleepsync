import { useEffect, useState } from "react";
import sleepService from "../services/sleepService";
import Navbar from "../components/Navbar";

const getColor  = (s) => s >= 70 ? "#00d4a8" : s >= 45 ? "#f5a623" : "#e05555";

export default function HistoryPage() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sleepService.getLogs().then((data) => { setLogs(data); setLoading(false); });
  }, []);

  const avgScore = logs.length ? Math.round(logs.reduce((a, l) => a + l.score, 0) / logs.length) : 0;
  const goodDays = logs.filter((l) => l.score >= 70).length;
  const fairDays = logs.filter((l) => l.score >= 45 && l.score < 70).length;
  const poorDays = logs.filter((l) => l.score < 45).length;
  const avgSleep = logs.length ? (logs.reduce((a, l) => a + l.sleep_hours, 0) / logs.length).toFixed(1) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#08111e", color: "#dce9f5" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 36 }}>Sleep History</h1>

        {loading ? (
          <div style={{ color: "#4a6480" }}>Loading your history...</div>
        ) : logs.length === 0 ? (
          <div style={{ color: "#4a6480", fontSize: 16 }}>No logs yet — complete your first morning check-in!</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
            {/* Log List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {logs.map((log) => (
                <div key={log.id} style={{
                  background: "#0f1e32", borderRadius: 14,
                  border: `1px solid ${getColor(log.score)}44`,
                  padding: "16px 20px", display: "flex", alignItems: "center", gap: 20,
                }}>
                  <div style={{ fontWeight: 800, fontSize: 28, color: getColor(log.score), minWidth: 50 }}>
                    {log.score}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {new Date(log.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </div>
                    <div style={{ color: "#4a6480", fontSize: 13 }}>
                      {log.sleep_hours} hrs sleep · HRV {log.hrv}ms
                    </div>
                  </div>
                  <div style={{
                    background: `${getColor(log.score)}22`, color: getColor(log.score),
                    borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700,
                  }}>
                    {log.score_label?.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#0f1e32", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Overall Stats</div>
                {[
                  { label: "Avg Score", value: avgScore, unit: "/100", color: "#00d4a8" },
                  { label: "Good Days", value: goodDays, unit: "days",  color: "#00d4a8" },
                  { label: "Fair Days", value: fairDays, unit: "days",  color: "#f5a623" },
                  { label: "Poor Days", value: poorDays, unit: "days",  color: "#e05555" },
                  { label: "Avg Sleep", value: avgSleep, unit: "hrs",   color: "#00d4a8" },
                ].map((s) => (
                  <div key={s.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "baseline",
                    padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <span style={{ color: "#4a6480", fontSize: 13 }}>{s.label}</span>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</span>
                      <span style={{ fontSize: 12, color: "#4a6480", marginLeft: 3 }}>{s.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}