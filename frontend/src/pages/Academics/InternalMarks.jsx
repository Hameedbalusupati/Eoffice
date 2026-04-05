import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

export default function InternalMarks() {
  const [form, setForm] = useState({
    student_name: "",
    roll_no: "",
    subject: "",
    class_name: "",
    internal_marks: "",
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
  // 📄 FETCH DATA
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/academics/faculty/${user.id}`);

      const marksData = (res.data || []).filter(
        (item) => item.activity_name === "internal_marks"
      );

      setData(marksData);
      setFilteredData(marksData);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load marks");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔄 HANDLE INPUT
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
Student: ${form.student_name} (${form.roll_no})
Internal Marks: ${form.internal_marks}
Date: ${form.date}

Details:
${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "internal_marks",
        subject: form.subject,
        class_name: form.class_name,
        description,
        status: "completed",
      });

      setMessage("✅ Internal marks added successfully!");

      setForm({
        student_name: "",
        roll_no: "",
        subject: "",
        class_name: "",
        internal_marks: "",
        date: "",
        description: "",
      });

      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit marks");
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
        (item.class_name || "").toLowerCase().includes(value) ||
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
      <h2>📝 Internal Marks</h2>

      {/* MESSAGE */}
      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="student_name"
          placeholder="Student Name"
          value={form.student_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="roll_no"
          placeholder="Roll Number"
          value={form.roll_no}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="class_name"
          placeholder="Class"
          value={form.class_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="internal_marks"
          placeholder="Marks"
          value={form.internal_marks}
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
          placeholder="Additional Notes"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Add Marks"}
        </button>
      </form>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No records found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>
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
  container: { padding: "20px" },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "450px",
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
    backgroundColor: "#0ea5e9",
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