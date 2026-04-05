import { useEffect, useState } from "react";
import API from "../../../services/api"; // ✅ FIXED
import StatusIcon from "../../../components/StatusIcon";

export default function Report() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  // ✅ SAFE USER FETCH
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user in localStorage");
  }

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const res = await API.get(`/academics/faculty/${user.id}`);

        const records = res.data || [];

        setData(records);

        // ✅ SUMMARY CALCULATION
        const total = records.length;
        const completed = records.filter(
          (item) => item.status === "completed"
        ).length;

        const pending = total - completed;

        setSummary({ total, completed, pending });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📊 Assignments Report</h2>

      {/* 📈 SUMMARY */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Total</h3>
          <p>{summary.total}</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#22c55e" }}>
          <h3>Completed</h3>
          <p>{summary.completed}</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#ef4444" }}>
          <h3>Pending</h3>
          <p>{summary.pending}</p>
        </div>
      </div>

      {/* 📋 TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Class</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.subject || "-"}</td>
                <td>{item.class_name || "-"}</td>
                <td>{item.description || "-"}</td>
                <td>
                  <StatusIcon status={item.status === "completed"} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    padding: "20px",
  },

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    flex: 1,
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};