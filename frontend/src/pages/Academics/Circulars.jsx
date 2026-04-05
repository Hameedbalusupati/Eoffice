import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

export default function Circulars() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
  });

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user");
  }

  // =========================
  // 📄 FETCH CIRCULARS
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/academics/circulars/${user.id}`);
      const result = res.data || [];

      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load circulars");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔄 INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage("❌ Please login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const description = `
Date: ${form.date}
Details: ${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "circulars",
        subject: form.title,
        class_name: "N/A",
        description,
        status: "completed",
      });

      setMessage("✅ Circular created successfully!");

      setForm({
        title: "",
        date: "",
        description: "",
      });

      fetchData(); // refresh
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create circular");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔍 SEARCH
  // =========================
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter(
      (item) =>
        (item.subject || "").toLowerCase().includes(value) ||
        (item.description || "").toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📢 Circulars</h2>

      {/* 🔔 MESSAGE */}
      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Circular Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Circular Details"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Create Circular"}
        </button>
      </form>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search circulars..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* ================= LIST ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No circulars found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.description}</td>
              </tr>
            ))}
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
  container: {
    padding: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "400px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  search: {
    padding: "10px",
    width: "300px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  message: {
    color: "green",
    marginBottom: "10px",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};