import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function SearchReport() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH REPORT DATA (FIXED)
  // =========================
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/employee/reports");
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
    fetchReports();
  }, [fetchReports]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        (item.title || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.type || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDate =
        dateFilter === "" || item.date === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [data, search, dateFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📊 Search Report</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No reports found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.title || "—"}</td>
                  <td>{item.type || "—"}</td>
                  <td>{item.hours || "—"}</td>
                  <td>{item.date || "—"}</td>

                  <td>
                    <StatusIcon status={true} />
                    <span style={{ marginLeft: "6px" }}>
                      Completed
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

  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};