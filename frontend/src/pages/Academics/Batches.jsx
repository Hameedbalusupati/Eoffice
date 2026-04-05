import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

export default function Batches() {
  const [className, setClassName] = useState("");
  const [day, setDay] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user");
  }

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id || !className || !day) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get("/academics/day-timetable", {
        params: {
          faculty_id: user.id,
          class_name: className,
          day: day,
        },
      });

      setData(res.data || []);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }, [user?.id, className, day]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🖨️ PRINT
  // =========================
  const handlePrint = () => {
    window.print();
  };

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📄 Batches Time Table Report</h2>

      {/* ================= FILTER ================= */}
      <div style={styles.filter}>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Class</option>
          <option value="CSE-A">CSE-A</option>
          <option value="CSE-B">CSE-B</option>
          <option value="ECE-A">ECE-A</option>
        </select>

        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>

        <button
          onClick={handlePrint}
          style={styles.button}
          disabled={!data.length}
        >
          🖨️ Print
        </button>
      </div>

      {/* ❌ ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      {/* 📋 TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No timetable data</p>
      ) : (
        <div style={styles.reportBox}>
          <h3>
            Class: {className} | Day: {day}
          </h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Period</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Room</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.period || "-"}</td>
                  <td>{item.time || "-"}</td>
                  <td>{item.subject || "-"}</td>
                  <td>{item.faculty || "-"}</td>
                  <td>{item.room || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    padding: "20px",
  },

  filter: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "8px 15px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  reportBox: {
    backgroundColor: "#fff",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};