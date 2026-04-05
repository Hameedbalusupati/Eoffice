import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function ExternalAnalysis() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/examination/external/analysis");
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
    fetchAnalysis();
  }, [fetchAnalysis]);

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
          .includes(search.toLowerCase());

      const matchesSubject =
        subjectFilter === "" || item.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [data, search, subjectFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📊 External Examination Analysis</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name / roll no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Filter by subject..."
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading analysis...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Result</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.student_name || "—"}</td>
                  <td>{item.roll_no || "—"}</td>
                  <td>{item.subject || "—"}</td>
                  <td>{item.marks ?? "—"}</td>

                  <td>
                    <StatusIcon status={item.result === "pass"} />
                    <span style={{ marginLeft: "6px" }}>
                      {item.result || "—"}
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