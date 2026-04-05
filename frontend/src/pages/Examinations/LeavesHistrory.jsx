import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function ExaminationLeavesHistory() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/examination/leaves");
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
    fetchLeaves();
  }, [fetchLeaves]);

  // =========================
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    let temp = data;

    if (search) {
      temp = temp.filter((item) =>
        (item.reason || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.employee_name || "")
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
  }, [data, search, statusFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📄 Examination Leave History</h2>

      {/* ================= FILTER ================= */}
      <div style={styles.filter}>
        <input
          type="text"
          placeholder="Search by reason or employee..."
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

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading leave records...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No leave records found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.employee_name || "—"}</td>
                  <td>{item.from_date || "—"}</td>
                  <td>{item.to_date || "—"}</td>
                  <td>{item.reason || "—"}</td>

                  <td>
                    <StatusIcon
                      status={item.status === "approved"}
                    />
                    <span style={{ marginLeft: "6px" }}>
                      {item.status}
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

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};