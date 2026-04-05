import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function Companies() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH COMPANIES (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/placements/companies");

      const companies =
        res.data?.data || res.data?.companies || res.data || [];

      setData(Array.isArray(companies) ? companies : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    const query = search.toLowerCase();

    return data.filter((item) => {
      const company = (item?.company || "").toLowerCase();
      const role = (item?.role || "").toLowerCase();

      return company.includes(query) || role.includes(query);
    });
  }, [data, search]);

  return (
    <div style={styles.container}>
      <h2>🏢 Placement Companies</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* STATUS */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Location</th>
              <th>Package (LPA)</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No companies found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item?.id || Math.random()}>
                  <td>{item?.company || "—"}</td>
                  <td>{item?.role || "—"}</td>
                  <td>{item?.location || "—"}</td>
                  <td>{item?.package ?? "—"}</td>

                  <td>
                    <StatusIcon status={item?.active} />
                    <span style={{ marginLeft: "6px" }}>
                      {item?.active ? "Active" : "Closed"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* REFRESH BUTTON */}
      <button onClick={fetchData} style={styles.button}>
        Refresh
      </button>
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