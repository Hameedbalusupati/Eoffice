import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function NewArrivals() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/library/new-arrivals");

      const books =
        res.data?.data || res.data?.books || res.data || [];

      setData(Array.isArray(books) ? books : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load new arrivals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((book) => {
      const title = (book?.title || "").toLowerCase();
      const author = (book?.author || "").toLowerCase();

      const matchesSearch =
        title.includes(search.toLowerCase()) ||
        author.includes(search.toLowerCase());

      // 🔥 Normalize date (important)
      const bookDate = book?.added_date
        ? new Date(book.added_date).toISOString().split("T")[0]
        : "";

      const matchesDate =
        !dateFilter || bookDate === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [data, search, dateFilter]);

  return (
    <div style={styles.container}>
      <h2>🆕 New Arrivals</h2>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={styles.input}
        />

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
              <th>Author</th>
              <th>Category</th>
              <th>Added Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No new books found
                </td>
              </tr>
            ) : (
              filteredData.map((book) => (
                <tr key={book?.id || Math.random()}>
                  <td>
                    {book?.title || "—"}
                    <span style={styles.newBadge}>NEW</span>
                  </td>
                  <td>{book?.author || "—"}</td>
                  <td>{book?.category || "—"}</td>
                  <td>
                    {book?.added_date
                      ? new Date(book.added_date).toLocaleDateString()
                      : "—"}
                  </td>

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

  newBadge: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "2px 6px",
    fontSize: "10px",
    borderRadius: "4px",
    marginLeft: "5px",
  },

  error: {
    color: "red",
  },
};