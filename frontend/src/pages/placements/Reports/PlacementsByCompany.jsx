import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";

export default function PlacementsByCompanies() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [openCompany, setOpenCompany] = useState(null);
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
      setError("Failed to load placements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 GROUP + FILTER (SAFE)
  // =========================
  const groupedData = useMemo(() => {
    const filtered = data.filter((item) => {
      const company = (item?.company || "").toLowerCase();
      return company.includes(search.toLowerCase());
    });

    const groups = {};

    filtered.forEach((item) => {
      const company = item?.company || "Others";

      if (!groups[company]) {
        groups[company] = [];
      }

      groups[company].push(item);
    });

    return groups;
  }, [data, search]);

  // =========================
  // 🔄 TOGGLE COMPANY
  // =========================
  const toggleCompany = (company) => {
    setOpenCompany(openCompany === company ? null : company);
  };

  return (
    <div style={styles.container}>
      <h2>🏢 Placements by Companies</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* STATUS */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* GROUP VIEW */}
      {!loading && !error && (
        <>
          {Object.keys(groupedData).length === 0 ? (
            <p>No data found</p>
          ) : (
            Object.entries(groupedData).map(([company, students]) => (
              <div key={company} style={styles.card}>
                {/* HEADER */}
                <div
                  style={styles.header}
                  onClick={() => toggleCompany(company)}
                >
                  <h3>{company}</h3>
                  <span>{students.length} students</span>
                </div>

                {/* DETAILS */}
                {openCompany === company && (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Role</th>
                        <th>Package</th>
                        <th>Year</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((item) => (
                        <tr key={item?.id || Math.random()}>
                          <td>{item?.student_name || "—"}</td>
                          <td>{item?.role || "—"}</td>
                          <td>{item?.package ?? "—"} LPA</td>
                          <td>{item?.year || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          )}

          {/* REFRESH BUTTON */}
          <button onClick={fetchData} style={styles.button}>
            Refresh
          </button>
        </>
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

  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f3f4f6",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  button: {
    marginTop: "15px",
    padding: "8px 12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
  },
};