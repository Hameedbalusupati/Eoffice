import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function DeptWiseBooks() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [openDept, setOpenDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/library/department-books");

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
  // 🔍 GROUP + FILTER (SAFE)
  // =========================
  const groupedData = useMemo(() => {
    const filtered = data.filter((book) => {
      const title = (book?.title || "").toLowerCase();
      return title.includes(search.toLowerCase());
    });

    const groups = {};

    filtered.forEach((book) => {
      const dept = book?.department || "Others";

      if (!groups[dept]) {
        groups[dept] = [];
      }

      groups[dept].push(book);
    });

    return groups;
  }, [data, search]);

  // =========================
  // 🔄 TOGGLE DEPT
  // =========================
  const toggleDept = (dept) => {
    setOpenDept(openDept === dept ? null : dept);
  };

  return (
    <div style={styles.container}>
      <h2>📚 Dept Wise Books</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search book..."
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
            Object.entries(groupedData).map(([dept, books]) => (
              <div key={dept} style={styles.card}>
                {/* HEADER */}
                <div
                  style={styles.header}
                  onClick={() => toggleDept(dept)}
                >
                  <h3>{dept}</h3>
                  <span>{books.length} books</span>
                </div>

                {/* BOOK LIST */}
                {openDept === dept && (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {books.map((book) => (
                        <tr key={book?.id || Math.random()}>
                          <td>{book?.title || "—"}</td>
                          <td>{book?.author || "—"}</td>

                          <td>
                            <StatusIcon status={book?.available} />
                            <span style={{ marginLeft: "6px" }}>
                              {book?.available
                                ? "Available"
                                : "Issued"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          )}
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

  error: {
    color: "red",
  },
};