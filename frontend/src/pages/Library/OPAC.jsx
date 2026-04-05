import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function OPAC() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH BOOKS (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/library/books");

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
  // 🔍 GLOBAL SEARCH (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((book) => {
      const title = (book?.title || "").toLowerCase();
      const author = (book?.author || "").toLowerCase();
      const category = (book?.category || "").toLowerCase();

      const query = search.toLowerCase();

      return (
        title.includes(query) ||
        author.includes(query) ||
        category.includes(query)
      );
    });
  }, [data, search]);

  return (
    <div style={styles.container}>
      <h2>🔍 Library OPAC</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search books by title, author, category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* STATUS */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* RESULTS */}
      {!loading && !error && (
        <div style={styles.grid}>
          {filteredData.length === 0 ? (
            <p>No books found</p>
          ) : (
            filteredData.map((book) => (
              <div key={book?.id || Math.random()} style={styles.card}>
                <h3>{book?.title || "—"}</h3>

                <p><b>Author:</b> {book?.author || "—"}</p>
                <p><b>Category:</b> {book?.category || "—"}</p>

                {/* OPTIONAL LOCATION */}
                {book?.location && (
                  <p><b>Location:</b> {book.location}</p>
                )}

                <div style={styles.status}>
                  <StatusIcon status={book?.available} />
                  <span>
                    {book?.available ? "Available" : "Issued"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
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
    padding: "12px",
    width: "350px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "6px",
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
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
  },

  button: {
    marginTop: "15px",
    padding: "8px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
  },
};