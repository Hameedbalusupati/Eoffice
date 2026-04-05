import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function LibraryLeavesHistory() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 🔐 SAFE USER
  // =========================
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // =========================
  // 📄 FETCH LEAVES (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.get(`/library/leaves/${user.id}`);

      const leaves =
        res.data?.data || res.data?.leaves || res.data || [];

      setData(Array.isArray(leaves) ? leaves : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load leave history");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const reason = (item?.reason || "").toLowerCase();

      const matchesSearch = reason.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        !statusFilter || item?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  return (
    <div style={styles.container}>
      <h2>📄 Library Leave History</h2>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by reason..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
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
                <tr key={item?.id || Math.random()}>
                  <td>
                    {item?.from_date
                      ? new Date(item.from_date).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    {item?.to_date
                      ? new Date(item.to_date).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>{item?.reason || "—"}</td>

                  <td>
                    <StatusIcon
                      status={item?.status === "approved"}
                    />
                    <span style={{ marginLeft: "6px" }}>
                      {item?.status || "—"}
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