import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function LeavesHistory() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user");
  }

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/academics/leaves/user/${user.id}`
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load leave history");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER (OPTIMIZED)
  // =========================
  const filteredData = useMemo(() => {
    let temp = [...data];

    if (search) {
      temp = temp.filter((item) =>
        (item.reason || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      temp = temp.filter(
        (item) => item.status === statusFilter
      );
    }

    return temp;
  }, [search, statusFilter, data]);

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📄 Leaves History</h2>

      {/* ================= FILTER ================= */}
      <div style={styles.filter}>
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
      </div>

      {/* ❌ ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No leave records found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>From Date</th>
              <th>To Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.from_date || "-"}</td>
                <td>{item.to_date || "-"}</td>
                <td>{item.reason || "-"}</td>

                <td>
                  <StatusIcon
                    status={item.status === "approved"}
                  />
                  <span style={{ marginLeft: "8px" }}>
                    {item.status}
                  </span>
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

  filter: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
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

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};