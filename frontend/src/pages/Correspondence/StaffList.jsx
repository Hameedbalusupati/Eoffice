import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function StaffList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH STAFF (FIXED)
  // =========================
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/employee/staff");
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // 🔁 USE EFFECT (FIXED)
  // =========================
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // =========================
  // 🔍 SEARCH FILTER (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((staff) =>
      (staff.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (staff.department || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>👨‍🏫 Staff List</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search by name or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading staff...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No staff found
                </td>
              </tr>
            ) : (
              filteredData.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.name || "—"}</td>
                  <td>{staff.department || "—"}</td>
                  <td>{staff.email || "—"}</td>
                  <td>{staff.phone || "—"}</td>

                  <td>
                    <StatusIcon status={staff.active} />
                    <span style={{ marginLeft: "6px" }}>
                      {staff.active ? "Active" : "Inactive"}
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

  input: {
    padding: "8px",
    width: "300px",
    marginBottom: "15px",
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