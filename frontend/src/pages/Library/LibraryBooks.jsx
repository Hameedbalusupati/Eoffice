import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function LibraryBooks() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH BOOKS
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
  // 📊 DYNAMIC CATEGORIES
  // =========================
  const categories = useMemo(() => {
    return [
      ...new Set(
        data.map((b) => b?.category).filter(Boolean)
      ),
    ];
  }, [data]);

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

      const matchesCategory =
        !categoryFilter || book?.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [data, search, categoryFilter]);

  // =========================
  // 📥 ISSUE BOOK
  // =========================
  const handleIssue = async (bookId) => {
    try {
      await API.post(`/library/issue/${bookId}`);

      setData((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, available: false } : b
        )
      );
    } catch (err) {
      console.error("Issue error:", err);
    }
  };

  // =========================
  // 🔄 RETURN BOOK
  // =========================
  const handleReturn = async (bookId) => {
    try {
      await API.post(`/library/return/${bookId}`);

      setData((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, available: true } : b
        )
      );
    } catch (err) {
      console.error("Return error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📚 Library Books</h2>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
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
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No books found
                </td>
              </tr>
            ) : (
              filteredData.map((book) => (
                <tr key={book?.id || Math.random()}>
                  <td>{book?.title || "—"}</td>
                  <td>{book?.author || "—"}</td>
                  <td>{book?.category || "—"}</td>

                  <td>
                    <StatusIcon status={book?.available} />
                    <span style={{ marginLeft: "6px" }}>
                      {book?.available ? "Available" : "Issued"}
                    </span>
                  </td>

                  <td>
                    {book?.available ? (
                      <button
                        style={styles.issueBtn}
                        onClick={() => handleIssue(book.id)}
                      >
                        Issue
                      </button>
                    ) : (
                      <button
                        style={styles.returnBtn}
                        onClick={() => handleReturn(book.id)}
                      >
                        Return
                      </button>
                    )}
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

  issueBtn: {
    padding: "6px 10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  returnBtn: {
    padding: "6px 10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  error: {
    color: "red",
  },
};