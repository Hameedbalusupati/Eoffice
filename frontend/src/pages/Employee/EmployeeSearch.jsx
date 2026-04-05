import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function EmployeeSearch() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH EMPLOYEES (FIXED)
  // =========================
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/employee/list");
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
    fetchEmployees();
  }, [fetchEmployees]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((emp) => {
      const matchesSearch =
        (emp.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (emp.email || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDept =
        department === "" || emp.department === department;

      return matchesSearch && matchesDept;
    });
  }, [data, search, department]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>🔍 Employee Search</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={styles.select}
        >
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading employees...</p>
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
                  No employees found
                </td>
              </tr>
            ) : (
              filteredData.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name || "—"}</td>
                  <td>{emp.department || "—"}</td>
                  <td>{emp.email || "—"}</td>
                  <td>{emp.phone || "—"}</td>

                  <td>
                    <StatusIcon status={emp.active} />
                    <span style={{ marginLeft: "6px" }}>
                      {emp.active ? "Active" : "Inactive"}
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