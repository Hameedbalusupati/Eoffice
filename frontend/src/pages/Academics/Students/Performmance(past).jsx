import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function PerformancePast() {
  const [className, setClassName] = useState("");
  const [semester, setSemester] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user data");
  }

  // =========================
  // 📄 FETCH FUNCTION
  // =========================
  const fetchData = useCallback(async () => {
    if (!className || !semester || !user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://127.0.0.1:8000/academics/performance-past",
        {
          params: {
            faculty_id: user.id,
            class_name: className,
            semester: semester,
          },
        }
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [className, semester, user?.id]);

  // =========================
  // AUTO FETCH
  // =========================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📊 Performance (Past)</h2>

      {/* FILTER */}
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
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Semester</option>
          <option value="1-1">1-1</option>
          <option value="1-2">1-2</option>
          <option value="2-1">2-1</option>
          <option value="2-2">2-2</option>
          <option value="3-1">3-1</option>
          <option value="3-2">3-2</option>
          <option value="4-1">4-1</option>
          <option value="4-2">4-2</option>
        </select>

        <button
          onClick={fetchData}
          style={styles.button}
          disabled={!className || !semester}
        >
          Show
        </button>
      </div>

      {/* ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No past records found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Internal</th>
              <th>External</th>
              <th>Total</th>
              <th>Grade</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              const total = Number(item.total) || 0;
              const attendance = Number(item.attendance) || 0;

              return (
                <tr key={index}>
                  <td>{item.roll_no || "-"}</td>
                  <td>{item.student_name || "-"}</td>
                  <td>{item.subject || "-"}</td>
                  <td>{item.internal ?? "-"}</td>
                  <td>{item.external ?? "-"}</td>
                  <td>{total}</td>
                  <td>{item.grade || "-"}</td>
                  <td>{attendance}%</td>

                  <td>
                    {total >= 40 ? (
                      <span style={styles.pass}>✔ Pass</span>
                    ) : (
                      <span style={styles.fail}>❌ Fail</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },

  pass: {
    color: "green",
    fontWeight: "bold",
  },

  fail: {
    color: "red",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};