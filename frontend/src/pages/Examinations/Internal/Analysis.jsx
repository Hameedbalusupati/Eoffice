import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";

export default function InternalAnalysis() {
  const [data, setData] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchAnalysis = useCallback(async () => {
    if (!subject) return;

    setLoading(true);
    try {
      const res = await API.get(
        `/examination/internal/analysis/${subject}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  // =========================
  // 🔁 USE EFFECT
  // =========================
  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  // =========================
  // 📊 ANALYSIS CALCULATION (SAFE)
  // =========================
  const stats = useMemo(() => {
    if (!data.length)
      return { pass: 0, fail: 0, percent: 0, avg: 0 };

    const pass = data.filter((s) => (s.marks ?? 0) >= 40).length;
    const fail = data.length - pass;

    const percent = ((pass / data.length) * 100).toFixed(2);

    const avg =
      (
        data.reduce((sum, s) => sum + (s.marks ?? 0), 0) /
        data.length
      ).toFixed(2);

    return { pass, fail, percent, avg };
  }, [data]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📊 Internal Exam Analysis</h2>

      {/* ================= SUBJECT ================= */}
      <input
        type="text"
        placeholder="Enter Subject (e.g. DBMS)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={styles.input}
      />

      {/* ================= STATS ================= */}
      {loading ? (
        <p>Loading analysis...</p>
      ) : data.length > 0 ? (
        <div style={styles.stats}>
          <p>✅ Pass: {stats.pass}</p>
          <p>❌ Fail: {stats.fail}</p>
          <p>📈 Pass %: {stats.percent}%</p>
          <p>📊 Avg Marks: {stats.avg}</p>
        </div>
      ) : null}

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Marks</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {!subject ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                Enter subject to view analysis
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No data found
              </td>
            </tr>
          ) : (
            data.map((student) => (
              <tr key={student.id}>
                <td>{student.roll_no || "—"}</td>
                <td>{student.name || "—"}</td>
                <td>{student.marks ?? "—"}</td>

                <td>
                  {(student.marks ?? 0) >= 40 ? (
                    <span style={{ color: "green" }}>Pass</span>
                  ) : (
                    <span style={{ color: "red" }}>Fail</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: { padding: "20px" },

  input: {
    padding: "8px",
    width: "250px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  stats: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    fontWeight: "bold",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};