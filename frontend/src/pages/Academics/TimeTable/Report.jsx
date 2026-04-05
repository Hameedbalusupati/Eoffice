import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";

export default function TimeTableReports() {
  const [className, setClassName] = useState("");
  const [day, setDay] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
  // 📄 FETCH ALL TIMETABLE
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/academics/timetable/${user.id}`);

      const result = res.data || [];

      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER
  // =========================
  useEffect(() => {
    let filtered = data;

    if (className) {
      filtered = filtered.filter(
        (item) => item.class_name === className
      );
    }

    if (day) {
      filtered = filtered.filter(
        (item) => item.day === day
      );
    }

    setFilteredData(filtered);
  }, [className, day, data]);

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📊 Timetable Reports</h2>

      {/* ================= FILTER ================= */}
      <div style={styles.filter}>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={styles.select}
        >
          <option value="">All Classes</option>
          <option value="CSE-A">CSE-A</option>
          <option value="CSE-B">CSE-B</option>
          <option value="ECE-A">ECE-A</option>
        </select>

        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={styles.select}
        >
          <option value="">All Days</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>
      </div>

      {/* ================= ERROR ================= */}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No timetable records found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Faculty</th>
              <th>Room</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.day || "-"}</td>
                <td>{item.class_name || "-"}</td>
                <td>{item.subject || "-"}</td>
                <td>
                  {item.start_time && item.end_time
                    ? `${item.start_time} - ${item.end_time}`
                    : "-"}
                </td>
                <td>{item.faculty || "-"}</td>
                <td>{item.room || "-"}</td>
              </tr>
            ))}
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