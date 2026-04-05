import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function BooksList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH BOOKS (FIXED)
  // =========================
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/library/books");
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
    fetchBooks();
  }, [fetchBooks]);

  // =========================
  // 📊 UNIQUE CATEGORIES (DYNAMIC)
  // =========================
  const categories = useMemo(() => {
    const set = new Set(data.map((b) => b.category).filter(Boolean));
    return Array.from(set);
  }, [data]);

  // =========================
  // 🔍 FILTER LOGIC (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((book) => {
      const matchesSearch =
        (book.title || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (book.author || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "" ||
        book.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [data, search, categoryFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📚 Books List</h2>

      {/* ================= FILTERS ================= */}
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
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No books found
                </td>
              </tr>
            ) : (
              filteredData.map((book) => (
                <tr key={book.id}>
                  <td>{book.title || "—"}</td>
                  <td>{book.author || "—"}</td>
                  <td>{book.category || "—"}</td>

                  <td>
                    <StatusIcon status={book.available} />
                    <span style={{ marginLeft: "6px" }}>
                      {book.available ? "Available" : "Issued"}
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

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};