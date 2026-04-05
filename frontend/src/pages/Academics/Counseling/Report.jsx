import { useEffect, useState } from "react";
import API from "../../../../services/api"; // ✅ FIX
import StatusIcon from "../../../../components/StatusIcon";

export default function CounselingReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

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

        const counselingData = (res.data || []).filter(
          (item) => item.activity_name === "counseling"
        );

        // 🔥 SAFE PROCESSING
        const processed = counselingData.map((item) => {
          const desc = item.description || "";

          const studentMatch = desc.match(/Student:\s*(.*)/i);

          return {
            ...item,
            student: studentMatch
              ? studentMatch[1]
              : item.subject || "Unknown",
            status: true,
          };
        });

        setData(processed);
        setFilteredData(processed);
        setTotal(processed.length);
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
      const student = item.student || "";
      const className = item.class_name || "";

      return (
        student.toLowerCase().includes(value.toLowerCase()) ||
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
      <h2>📊 Counseling Report</h2>

      {/* 📈 SUMMARY */}
      <div style={styles.summary}>
        <h3>Total Sessions: {total}</h3>
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by student or class..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.student}</td>
                <td>{item.class_name || "-"}</td>
                <td style={styles.desc}>{item.description || "-"}</td>

                <td>
                  <StatusIcon status={true} />
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

  summary: {
    marginBottom: "15px",
    fontWeight: "bold",
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