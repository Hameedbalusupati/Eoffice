import { useEffect, useState } from "react";
import API from "../../../services/api"; // ✅ FIX
import StatusIcon from "../../../components/StatusIcon";

export default function ExtraClassReport() {
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

  // 📄 FETCH DATA
  useEffect(() => {
    if (!user?.id) return; // ✅ prevent crash

    const fetchData = async () => {
      try {
        const res = await API.get(`/academics/faculty/${user.id}`);

        const extraClassData = (res.data || []).filter(
          (item) => item.activity_name === "extra_class"
        );

        setData(extraClassData);
        setFilteredData(extraClassData);
        setTotal(extraClassData.length);
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
      <h2>📊 Extra Class Report</h2>

      {/* 📈 Summary */}
      <div style={styles.summary}>
        <h3>Total Extra Classes: {total}</h3>
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by subject or class..."
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
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No extra class records found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject || "-"}</td>
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