import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function EmployeeCirculars() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH CIRCULARS
  // =========================
  const fetchCirculars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/employee/circulars");
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // 🔁 USE EFFECT
  // =========================
  useEffect(() => {
    fetchCirculars();
  }, [fetchCirculars]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📢 Employee Circulars</h2>

      {loading ? (
        <p>Loading circulars...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No circulars found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.title || "—"}</td>
                  <td style={styles.desc}>
                    {item.message || "—"}
                  </td>
                  <td>{item.date || "—"}</td>

                  <td>
                    <StatusIcon status={true} />
                    <span style={{ marginLeft: "6px" }}>
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
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
  container: { padding: "20px" },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  desc: {
    maxWidth: "400px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};