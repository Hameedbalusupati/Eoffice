import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function StudentPerformance() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get(
        "/placements/student-performance"
      );

      const items =
        res.data?.data || res.data?.students || res.data || [];

      setData(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load student performance");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER + SORT (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    let temp = data;

    if (search) {
      const query = search.toLowerCase();

      temp = temp.filter((item) =>
        (item?.student_name || "")
          .toLowerCase()
          .includes(query)
      );
    }

    // sort safely
    return [...temp].sort(
      (a, b) => (b?.score || 0) - (a?.score || 0)
    );
  }, [data, search]);

  // =========================
  // 🏆 RANK
  // =========================
  const getRank = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  return (
    <div style={styles.container}>
      <h2>📊 Student Performance</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search student..."
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
              <th>Rank</th>
              <th>Student</th>
              <th>Skills</th>
              <th>Score</th>
              <th>Company</th>
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
              filteredData.map((item, index) => (
                <tr
                  key={item?.id || Math.random()}
                  style={index < 3 ? styles.top : {}}
                >
                  <td>{getRank(index)}</td>

                  <td>{item?.student_name || "—"}</td>
                  <td>{item?.skills || "—"}</td>
                  <td>{item?.score ?? "—"}</td>
                  <td>{item?.company || "-"}</td>

                  <td>
                    <StatusIcon status={item?.placed} />
                    <span style={{ marginLeft: "6px" }}>
                      {item?.placed
                        ? "Placed"
                        : "Not Placed"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* REFRESH */}
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

  top: {
    backgroundColor: "#fef9c3",
    fontWeight: "bold",
  },

  button: {
    marginTop: "15px",
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
  },
};