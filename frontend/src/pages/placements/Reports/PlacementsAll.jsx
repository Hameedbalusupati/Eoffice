import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";

export default function PlacementsAll() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/placements/all");

      const items =
        res.data?.data || res.data?.placements || res.data || [];

      setData(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load placement data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 📊 UNIQUE COMPANIES (SAFE)
  // =========================
  const companies = useMemo(() => {
    return [
      ...new Set(
        data.map((d) => d?.company).filter(Boolean)
      ),
    ];
  }, [data]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const student = (item?.student_name || "").toLowerCase();
      const company = (item?.company || "").toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        student.includes(query) || company.includes(query);

      const matchesCompany =
        !companyFilter || item?.company === companyFilter;

      return matchesSearch && matchesCompany;
    });
  }, [data, search, companyFilter]);

  return (
    <div style={styles.container}>
      <h2>🎯 All Placements</h2>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search student or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Companies</option>
          {companies.map((c, i) => (
            <option key={i} value={c}>
              {c}
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
              <th>Student Name</th>
              <th>Company</th>
              <th>Role</th>
              <th>Package (LPA)</th>
              <th>Year</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No placement records found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item?.id || Math.random()}>
                  <td>{item?.student_name || "—"}</td>
                  <td>{item?.company || "—"}</td>
                  <td>{item?.role || "—"}</td>
                  <td>{item?.package ?? "—"}</td>
                  <td>{item?.year || "—"}</td>
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