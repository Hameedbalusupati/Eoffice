import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function SubscriptionReport() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/library/subscriptions");

      const items =
        res.data?.data || res.data?.subscriptions || res.data || [];

      setData(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const name = (item?.name || "").toLowerCase();

      const matchesSearch = name.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "active" && item?.active) ||
        (statusFilter === "expired" && !item?.active);

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  return (
    <div style={styles.container}>
      <h2>📚 Subscription Report</h2>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>

        <button onClick={fetchData} style={styles.button}>
          Refresh
        </button>
      </div>

      {/* STATUS */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Start Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No subscriptions found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item?.id || Math.random()}>
                  <td>{item?.name || "—"}</td>
                  <td>{item?.role || "—"}</td>

                  <td>
                    {item?.start_date
                      ? new Date(item.start_date).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    {item?.expiry_date
                      ? new Date(item.expiry_date).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <StatusIcon status={item?.active} />
                    <span style={{ marginLeft: "6px" }}>
                      {item?.active ? "Active" : "Expired"}
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
    flexWrap: "wrap",
  },

  input: {
    padding: "8px",
    width: "250px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  select: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  button: {
    padding: "8px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  error: {
    color: "red",
  },
};