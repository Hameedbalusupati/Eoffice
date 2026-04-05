import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api"; // ✅ use global API
import StatusIcon from "../../../components/StatusIcon";

export default function LeaveReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ SAFE USER PARSE
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user data");
  }

  // =========================
  // 📄 FETCH LEAVES (FIXED)
  // =========================
  const fetchLeaves = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await API.get(`/academics/leaves/user/${user.id}`);

      const leaves = res.data || [];

      setData(leaves);
      setFilteredData(leaves);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // =========================
  // 🔄 USE EFFECT
  // =========================
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // =========================
  // 🔍 SEARCH
  // =========================
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter((item) => {
      const reason = item.reason?.toLowerCase() || "";
      const status = item.status?.toLowerCase() || "";

      return reason.includes(value) || status.includes(value);
    });

    setFilteredData(filtered);
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📄 Leave Report</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by reason or status..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No leave records found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.from_date || "-"}</td>
                  <td>{item.to_date || "-"}</td>
                  <td>{item.reason || "-"}</td>

                  <td>
                    <StatusIcon status={item.status === "approved"} />
                    <span style={{ marginLeft: "8px" }}>
                      {item.status || "-"}
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