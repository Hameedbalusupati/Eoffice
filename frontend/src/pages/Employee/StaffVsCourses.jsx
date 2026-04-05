import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function StaffVsCourses() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchStaffCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/employee/staff-courses");
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
    fetchStaffCourses();
  }, [fetchStaffCourses]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      (item.staff_name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.course || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>👨‍🏫 Staff vs Courses</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search by staff or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Course</th>
              <th>Department</th>
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
                  <td>{item.staff_name || "—"}</td>
                  <td>{item.course || "—"}</td>
                  <td>{item.department || "—"}</td>

                  <td>
                    <StatusIcon status={true} />
                    <span style={{ marginLeft: "6px" }}>
                      Assigned
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