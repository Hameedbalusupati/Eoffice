import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function AbsenteesReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
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
  // 📄 FETCH DATA
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/academics/faculty/${user.id}`);

      const attendanceData = (res.data || []).filter(
        (item) => item.activity_name === "attendance_reports"
      );

      // 🔥 PROCESS DATA SAFELY
      const processed = attendanceData.map((item) => {
        const desc = item.description || "";

        const dateMatch = desc.match(/Date:\s*([^\n]+)/i);
        const absentMatch = desc.match(/Absent:\s*(\d+)/i);

        const date = dateMatch ? dateMatch[1].trim() : "N/A";
        const absent = absentMatch ? parseInt(absentMatch[1]) : 0;

        return {
          id: item.id,
          subject: item.subject || "N/A",
          class_name: item.class_name || "N/A",
          date,
          absent,
          status: absent === 0,
        };
      });

      setData(processed);
      setFilteredData(processed);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 SEARCH
  // =========================
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter(
      (item) =>
        (item.subject || "").toLowerCase().includes(value) ||
        (item.class_name || "").toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>🚫 Absentees Report</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by Subject or Class..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* ❌ ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      {/* 📋 TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No data found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class</th>
              <th>Date</th>
              <th>Absent Count</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>
                <td>{item.date}</td>
                <td>{item.absent}</td>

                <td>
                  <StatusIcon status={item.status} />
                </td>
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

  error: {
    color: "red",
    marginBottom: "10px",
  },
};