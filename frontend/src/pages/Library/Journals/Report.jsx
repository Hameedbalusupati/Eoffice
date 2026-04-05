import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function JournalReports() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchJournals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/library/journals");
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
    fetchJournals();
  }, [fetchJournals]);

  // =========================
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        (item.title || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.publisher || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesYear =
        yearFilter === "" ||
        String(item.year || "") === yearFilter;

      return matchesSearch && matchesYear;
    });
  }, [data, search, yearFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📑 Journal Reports</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or publisher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Filter by year..."
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading journals...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Publisher</th>
              <th>Year</th>
              <th>Volume</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.title || "—"}</td>
                  <td>{item.publisher || "—"}</td>
                  <td>{item.year || "—"}</td>
                  <td>{item.volume || "—"}</td>

                  <td>
                    <StatusIcon status={item.available} />
                    <span style={{ marginLeft: "6px" }}>
                      {item.available ? "Available" : "In Use"}
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