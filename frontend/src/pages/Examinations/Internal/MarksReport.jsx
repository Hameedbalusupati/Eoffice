import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";

export default function InternalMarksReport() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/examination/internal/reports");
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
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        (item.student_name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.roll_no || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.subject || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesExam =
        examFilter === "" || item.exam_name === examFilter;

      return matchesSearch && matchesExam;
    });
  }, [data, search, examFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📊 Internal Marks Report</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name / roll / subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Exams</option>
          <option value="Mid-1">Mid-1</option>
          <option value="Mid-2">Mid-2</option>
          <option value="Assignment">Assignment</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              <th>Subject</th>
              <th>Exam</th>
              <th>Marks</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.student_name || "—"}</td>
                  <td>{item.roll_no || "—"}</td>
                  <td>{item.subject || "—"}</td>
                  <td>{item.exam_name || "—"}</td>
                  <td>{item.marks ?? "—"}</td>

                  <td>
                    {(item.marks ?? 0) >= 40 ? (
                      <span style={{ color: "green" }}>Pass</span>
                    ) : (
                      <span style={{ color: "red" }}>Fail</span>
                    )}
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