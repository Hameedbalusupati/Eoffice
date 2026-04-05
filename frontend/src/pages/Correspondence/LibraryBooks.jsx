import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function LibraryBooks() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
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
  // 🔁 USE EFFECT (FIXED)
  // =========================
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // =========================
  // 🔍 SEARCH FILTER (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      (item.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.author || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📚 Library Books</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

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
              <th>Availability</th>
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
};