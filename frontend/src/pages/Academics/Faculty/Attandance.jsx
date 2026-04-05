import { useEffect, useState } from "react";
import API from "../../../services/api"; // ✅ FIX
import StatusIcon from "../../../components/StatusIcon";

export default function Attendance() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
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

  // 📄 FETCH DATA
  useEffect(() => {
    if (!user?.id) return; // ✅ prevent crash

    const fetchData = async () => {
      try {
        const res = await API.get(`/academics/faculty/${user.id}`);

        const attendanceData = (res.data || []).filter(
          (item) => item.activity_name === "attendance_reports"
        );

        setData(attendanceData);
        setFilteredData(attendanceData);

        // 📊 SUMMARY
        const total = attendanceData.length;
        const completed = attendanceData.filter(
          (item) => item.status === "completed"
        ).length;
        const pending = total - completed;

        setSummary({ total, completed, pending });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  // 🔍 SEARCH
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = data.filter(
      (item) =>
        item.subject?.toLowerCase().includes(value.toLowerCase()) ||
        item.class_name?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📅 Attendance Overview</h2>

      {/* 📊 SUMMARY */}
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

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by subject or class..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

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
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No attendance records found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject || "-"}</td>
                <td>{item.class_name || "-"}</td>
                <td style={styles.desc}>{item.description || "-"}</td>

                <td>
                  <StatusIcon status={item.status === "completed"} />
                </td>
              </tr>
            ))
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

  search: {
    padding: "10px",
    width: "300px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  desc: {
    maxWidth: "300px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};