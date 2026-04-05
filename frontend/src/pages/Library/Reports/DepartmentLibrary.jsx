import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function DepartmentLibrary() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/library/department-books");

      const books =
        res.data?.data || res.data?.books || res.data || [];

      setData(Array.isArray(books) ? books : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 📊 UNIQUE DEPARTMENTS
  // =========================
  const departments = useMemo(() => {
    return [
      ...new Set(
        data.map((b) => b?.department).filter(Boolean)
      ),
    ];
  }, [data]);

  // =========================
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((book) => {
      const title = (book?.title || "").toLowerCase();

      const matchesSearch = title.includes(
        search.toLowerCase()
      );

      const matchesDept =
        deptFilter === "" ||
        book?.department === deptFilter;

      return matchesSearch && matchesDept;
    });
  }, [data, search, deptFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>🏫 Department Library</h2>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Departments</option>
          {departments.map((dept, i) => (
            <option key={i} value={dept}>
              {dept}
            </option>
          ))}
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
              <th>Title</th>
              <th>Department</th>
              <th>Author</th>
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
              filteredData.map((book) => (
                <tr key={book?.id || Math.random()}>
                  <td>{book?.title || "—"}</td>
                  <td>{book?.department || "—"}</td>
                  <td>{book?.author || "—"}</td>
                  <td>
                    <StatusIcon status={book?.available} />
                    <span style={{ marginLeft: "6px" }}>
                      {book?.available ? "Available" : "Issued"}
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
    background: "#28a745",
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