import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function BookStatusReports() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/library/book-status");
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

      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "available" && book.available) ||
        (statusFilter === "issued" && !book.available);

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📚 Book Status Reports</h2>

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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="issued">Issued</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading records...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Issued Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No records found
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

                  <td>
                    {book.available
                      ? "-"
                      : book.issued_date || "N/A"}
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