import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";

export default function BestUser() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/library/best-users");
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
    fetchUsers();
  }, [fetchUsers]);

  // =========================
  // 🔍 FILTER + SORT (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    let temp = data;

    if (search) {
      temp = temp.filter((user) =>
        (user.name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // sort safely (descending)
    return [...temp].sort(
      (a, b) => (b.books_count || 0) - (a.books_count || 0)
    );
  }, [data, search]);

  // =========================
  // 🏆 GET MEDAL
  // =========================
  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>🏆 Best Library Users</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Role</th>
              <th>Books Taken</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredData.map((user, index) => (
                <tr
                  key={user.id}
                  style={index < 3 ? styles.topUser : {}}
                >
                  <td>{getMedal(index)}</td>
                  <td>{user.name || "—"}</td>
                  <td>{user.role || "—"}</td>
                  <td>{user.books_count ?? 0}</td>
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
    width: "250px",
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

  topUser: {
    backgroundColor: "#fef9c3",
    fontWeight: "bold",
  },
};