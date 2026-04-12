import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sleepService from "../services/sleepService";
import Navbar from "../components/Navbar";

const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const toHMS = (decimal) => {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return { hrs: h === 0 ? "" : String(h), min: m === 0 ? "" : String(m) };
};

export default function MorningCheckIn() {
  const navigate = useNavigate();
  const [existingId, setExistingId] = useState(null);
  const [form, setForm] = useState({
    date:             new Date().toISOString().split("T")[0],
    hrv:              "",
    resting_hr:       "",
    deep_sleep_hrs:   "",
    deep_sleep_min:   "",
    rem_sleep_hrs:    "",
    rem_sleep_min:    "",
    light_sleep_hrs:  "",
    light_sleep_min:  "",
    respiratory_rate: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Load today's existing log if it exists
  useEffect(() => {
    sleepService.getToday()
      .then((log) => {
        setExistingId(log.id);
        const deep  = toHMS(log.deep_sleep);
        const rem   = toHMS(log.rem_sleep);
        const light = toHMS(log.light_sleep);
        setForm({
          date:             log.date,
          hrv:              String(log.hrv),
          resting_hr:       String(log.resting_hr),
          deep_sleep_hrs:   deep.hrs,
          deep_sleep_min:   deep.min,
          rem_sleep_hrs:    rem.hrs,
          rem_sleep_min:    rem.min,
          light_sleep_hrs:  light.hrs,
          light_sleep_min:  light.min,
          respiratory_rate: String(log.respiratory_rate),
        });
      })
      .catch(() => {}); // No log today — start fresh
  }, []);

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const toHours = (hrs, min) => {
    const h = parseFloat(hrs) || 0;
    const m = parseFloat(min) || 0;
    return Math.round((h + m / 60) * 100) / 100;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        date:             form.date,
        hrv:              parseFloat(form.hrv),
        resting_hr:       parseFloat(form.resting_hr),
        deep_sleep:       toHours(form.deep_sleep_hrs, form.deep_sleep_min),
        rem_sleep:        toHours(form.rem_sleep_hrs, form.rem_sleep_min),
        light_sleep:      toHours(form.light_sleep_hrs, form.light_sleep_min),
        respiratory_rate: parseFloat(form.respiratory_rate),
      };

      let log;
      if (existingId) {
        log = await sleepService.updateLog(existingId, payload);
      } else {
        log = await sleepService.createLog(payload);
      }
      navigate("/results", { state: { logId: log.id } });
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong. Check your values.");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    background: "#0a1624", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10, padding: "13px 16px", color: "#dce9f5",
    fontSize: 15, boxSizing: "border-box", width: "100%",
  };

  const Label = ({ text }) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: "#4a6480", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
      {text}
    </div>
  );

  const Hint = ({ text }) => (
    <div style={{ fontSize: 11, color: "#4a6480", marginBottom: 7 }}>{text}</div>
  );

  const sleepFields = [
    { label: "Deep Sleep",  hrsKey: "deep_sleep_hrs",  minKey: "deep_sleep_min" },
    { label: "REM Sleep",   hrsKey: "rem_sleep_hrs",   minKey: "rem_sleep_min" },
    { label: "Light Sleep", hrsKey: "light_sleep_hrs", minKey: "light_sleep_min" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#08111e", color: "#dce9f5" }}>
      <Navbar />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 6 }}>Morning Check-In</h1>
        <p style={{ color: "#4a6480", fontSize: 15, marginBottom: 8 }}>{today}</p>
        <p style={{ color: "#4a6480", fontSize: 13, marginBottom: 36, fontStyle: "italic" }}>
          {existingId
            ? "✏️ Editing today's log — your previous values are pre-filled."
            : "All metrics pulled from your wearable device — no subjective input required."}
        </p>

        {/* HRV + Resting HR + Respiratory Rate */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
          <div>
            <Label text="HRV" />
            <Hint text="Heart rate variability" />
            <input style={inp} type="number" step="any" placeholder="ms" value={form.hrv} onChange={update("hrv")} />
          </div>
          <div>
            <Label text="Resting Heart Rate" />
            <Hint text="Beats per minute" />
            <input style={inp} type="number" step="any" placeholder="bpm" value={form.resting_hr} onChange={update("resting_hr")} />
          </div>
          <div>
            <Label text="Avg Respiratory Rate" />
            <Hint text="Breaths per minute" />
            <input style={inp} type="number" step="any" placeholder="breaths/min" value={form.respiratory_rate} onChange={update("respiratory_rate")} />
          </div>
        </div>

        {/* Sleep stages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
          {sleepFields.map((f) => (
            <div key={f.label}>
              <Label text={f.label} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <Hint text="Hours" />
                  <input style={inp} type="number" min="0" max="12" step="1" placeholder="hrs" value={form[f.hrsKey]} onChange={update(f.hrsKey)} />
                </div>
                <div>
                  <Hint text="Minutes" />
                  <input style={inp} type="number" min="0" max="59" step="1" placeholder="min" value={form[f.minKey]} onChange={update(f.minKey)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && <div style={{ color: "#e05555", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {existingId && (
            <button onClick={() => navigate("/results", { state: { logId: existingId } })} style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              padding: "14px 32px", color: "#dce9f5", fontWeight: 600, fontSize: 15, cursor: "pointer",
            }}>
              View Today's Results
            </button>
          )}
          <button onClick={handleSubmit} disabled={loading} style={{
            background: "#00d4a8", border: "none", borderRadius: 10,
            padding: "14px 48px", color: "#060e1b", fontWeight: 700,
            fontSize: 15, cursor: "pointer",
          }}>
            {loading ? "Submitting..." : existingId ? "Update Morning Log ✓" : "Submit Morning Log ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}