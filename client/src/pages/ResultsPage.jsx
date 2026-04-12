import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sleepService from "../services/sleepService";
import Navbar from "../components/Navbar";

const getColor = (s) => s >= 70 ? "#00d4a8" : s >= 45 ? "#f5a623" : "#e05555";
const getLabel = (s) => s >= 70 ? "GOOD" : s >= 45 ? "FAIR" : "POOR";

const toHrsMin = (decimal) => {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h}h ${m}m`;
};

export default function ResultsPage() {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const [log, setLog]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [noLog, setNoLog]           = useState(false);

  useEffect(() => {
    if (state?.logId) {
      sleepService.getLog(state.logId).then((data) => {
        setLog(data);
        setLoading(false);
        if (!data.ai_plan) generatePlan(data.id);
      });
    } else {
      sleepService.getToday()
        .then((data) => {
          setLog(data);
          setLoading(false);
          if (!data.ai_plan) generatePlan(data.id);
        })
        .catch(() => {
          setNoLog(true);
          setLoading(false);
        });
    }
  }, []);

  const generatePlan = async (id) => {
    setGenLoading(true);
    try {
      const updated = await sleepService.generatePlan(id);
      setLog(updated);
    } finally {
      setGenLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08111e", color: "#dce9f5" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", padding: 64, fontSize: 18 }}>Loading your results...</div>
    </div>
  );

  if (noLog) return (
    <div style={{ minHeight: "100vh", background: "#08111e", color: "#dce9f5" }}>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 62px)", gap: 16 }}>
        <div style={{ fontSize: 48 }}>📋</div>
        <div style={{ fontWeight: 700, fontSize: 20 }}>No log yet today</div>
        <p style={{ color: "#4a6480", fontSize: 14 }}>Complete your morning check-in to see your results.</p>
        <button onClick={() => navigate("/log")} style={{
          background: "#00d4a8", border: "none", borderRadius: 10,
          padding: "14px 28px", color: "#060e1b", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>
          Log Morning Check-In →
        </button>
      </div>
    </div>
  );

  const score = log.score;
  const color = getColor(score);
  const r = 65, circ = 2 * Math.PI * r;

  const metrics = [
    { label: "HRV",              value: `${log.hrv} ms` },
    { label: "Resting HR",       value: `${log.resting_hr} bpm` },
    { label: "Deep Sleep",       value: toHrsMin(log.deep_sleep) },
    { label: "REM Sleep",        value: toHrsMin(log.rem_sleep) },
    { label: "Light Sleep",      value: toHrsMin(log.light_sleep) },
    { label: "Total Sleep",      value: toHrsMin(log.total_sleep) },
    { label: "Respiratory Rate", value: `${log.respiratory_rate} br/min` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#08111e", color: "#dce9f5" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 6 }}>Today's Recovery</h1>
        <p style={{ color: "#4a6480", marginBottom: 36 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={168} height={168} viewBox="0 0 168 168">
              <circle cx={84} cy={84} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
              <circle cx={84} cy={84} r={r} fill="none" stroke={color} strokeWidth={10}
                strokeLinecap="round" strokeDasharray={circ}
                strokeDashoffset={circ - (score / 100) * circ}
                transform="rotate(-90 84 84)" />
              <text x="50%" y="45%" textAnchor="middle" fill={color} fontSize={36} fontWeight={800}>{score}</text>
              <text x="50%" y="62%" textAnchor="middle" fill={color} fontSize={12} letterSpacing={2}>{getLabel(score)}</text>
            </svg>
          </div>

          <div style={{ background: "#0f1e32", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#00d4a8", marginBottom: 16 }}>Biometric Data</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {metrics.map(({ label, value }) => (
                <div key={label} style={{ background: "#0a1624", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#4a6480", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#0f1e32", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Today's Plan</div>
            {genLoading || !log.ai_plan
              ? <div style={{ color: "#4a6480", fontStyle: "italic" }}>Generating your AI plan...</div>
              : ["energy", "workout", "focus"].map((k) => (
                  <div key={k} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <span style={{ color: "#00d4a8", fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>{k}: </span>
                      <span style={{ fontSize: 14 }}>{log.ai_plan[k]}</span>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#0f1e32", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Lifestyle Tips</div>
            {genLoading || !log.ai_plan
              ? <div style={{ color: "#4a6480", fontStyle: "italic" }}>Loading tips...</div>
              : log.ai_plan.tips?.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: 14 }}>{t}</span>
                  </div>
                ))
            }
          </div>
          <div style={{ background: "#0f1e32", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>What's Next?</div>
            <p style={{ color: "#4a6480", fontSize: 14, lineHeight: 1.6 }}>View your sleep history and track your trends over time.</p>
            <button onClick={() => navigate("/history")} style={{
              background: "#00d4a8", border: "none", borderRadius: 10, padding: 14,
              color: "#060e1b", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              View History →
            </button>
            <button onClick={() => navigate("/log")} style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              padding: 14, color: "#dce9f5", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>
              ✏️ Edit Today's Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}