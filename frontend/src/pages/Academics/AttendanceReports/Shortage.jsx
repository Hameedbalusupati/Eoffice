import { useEffect, useState } from "react";
import API from "../../../../services/api"; // ✅ FIX
import StatusIcon from "../../../../components/StatusIcon";

export default function Shortage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ SAFE USER FETCH
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user in localStorage");
  }

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const res = await API.get(`/academics/faculty/${user.id}`);

        const attendanceData = (res.data || []).filter(
          (item) => item.activity_name === "attendance_reports"
        );

        // 🔥 Calculate shortage safely
        const processed = attendanceData.map((item) => {
          let present = 0;
          let total = 0;

          const desc = item.description || "";

          const presentMatch = desc.match(/Present:\s*(\d+)/i);
          const absentMatch = desc.match(/Absent:\s*(\d+)/i);

          if (presentMatch) present = parseInt(presentMatch[1]) || 0;
          if (absentMatch) total = present + (parseInt(absentMatch[1]) || 0);

          const percentage = total > 0 ? (present / total) * 100 : 0;

          return {
            ...item,
            percentage: percentage.toFixed(2),
            shortage: percentage < 75,
          };
        });

        setData(processed);
        setFilteredData(processed);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  // =========================
  // 🔍 SEARCH
  // =========================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = data.filter((item) => {
      const subject = item.subject || "";
      const className = item.class_name || "";

      return (
        subject.toLowerCase().includes(value.toLowerCase()) ||
        className.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>⚠️ Attendance Shortage</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by Subject or Class..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Class</th>
            <th>Attendance %</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No shortage data found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject || "-"}</td>
                <td>{item.class_name || "-"}</td>
                <td>{item.percentage}%</td>

                <td>
                  <StatusIcon status={!item.shortage} />
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

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};