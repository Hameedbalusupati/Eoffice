import { useEffect, useState } from "react";
import API from "../../../../services/api"; // ✅ FIX
import StatusIcon from "../../../../components/StatusIcon";

export default function NotPostedFaculty() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
          "/activity/not-posted/attendance_reports"
        );

        setData(res.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>🚫 Not Posted Faculty (Attendance)</h2>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p style={styles.success}>✅ All faculty submitted attendance</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.faculty_id}>
                <td>{item.faculty_id}</td>
                <td>{item.name || "-"}</td>

                <td>
                  <StatusIcon status={false} /> {/* ❌ always pending */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    padding: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  success: {
    color: "green",
    fontWeight: "bold",
  },
};