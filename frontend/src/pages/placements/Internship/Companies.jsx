import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function InternshipCompanies() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 🔐 SAFE USER
  // =========================
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // =========================
  // 📄 FETCH COMPANIES
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get(
        "/placements/internship/companies"
      );

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

  // =========================
  // 🚀 APPLY
  // =========================
  const handleApply = async (companyId) => {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      await API.post("/placements/internship/apply", {
        user_id: user.id,
        company_id: companyId,
      });

      alert("Applied successfully!");
    } catch (err) {
      console.error("Apply error:", err);
      alert("Error applying");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🏢 Internship Companies</h2>

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

      {/* CARDS */}
      {!loading && !error && (
        <div style={styles.grid}>
          {filteredData.length === 0 ? (
            <p>No companies found</p>
          ) : (
            filteredData.map((item) => (
              <div key={item?.id || Math.random()} style={styles.card}>
                <h3>{item?.company || "—"}</h3>

                <p><b>Role:</b> {item?.role || "—"}</p>
                <p><b>Location:</b> {item?.location || "—"}</p>
                <p><b>Stipend:</b> ₹{item?.stipend || "—"}</p>

                <div style={styles.status}>
                  <StatusIcon status={item?.open} />
                  <span>
                    {item?.open ? "Open" : "Closed"}
                  </span>
                </div>

                <button
                  style={styles.button}
                  disabled={!item?.open}
                  onClick={() => handleApply(item.id)}
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* REFRESH */}
      <button onClick={fetchData} style={styles.refreshBtn}>
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
    padding: "10px",
    width: "300px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },

  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "10px",
    fontWeight: "bold",
  },

  button: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  refreshBtn: {
    marginTop: "20px",
    padding: "8px 12px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
  },
};