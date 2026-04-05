import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function TeachingLoadDistribution() {
  const [form, setForm] = useState({
    faculty_name: "",
    subject: "",
    class_name: "",
    hours: "",
  });

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user data");
  }

  // =========================
  // 📄 FETCH DATA
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/academics/teaching-load/${user.id}`
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load teaching load");
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
  // 🚀 ADD LOAD
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
Faculty: ${form.faculty_name}
Subject: ${form.subject}
Class: ${form.class_name}
Weekly Hours: ${form.hours}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "teaching_load",
        subject: form.subject,
        class_name: form.class_name,
        description,
        status: "completed",
      });

      setMessage("📊 Teaching load added successfully!");

      setForm({
        faculty_name: "",
        subject: "",
        class_name: "",
        hours: "",
      });

      fetchData(); // 🔄 refresh
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add teaching load");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📊 Teaching Load Distribution</h2>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="faculty_name"
          placeholder="Faculty Name"
          value={form.faculty_name}
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
          placeholder="Class (e.g. CSE-A)"
          value={form.class_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="hours"
          placeholder="Weekly Hours"
          value={form.hours}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Load"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No load data found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.subject || "-"}</td>
                <td>{item.class_name || "-"}</td>

                <td style={styles.desc}>
                  {item.description || "-"}
                </td>

                <td>
                  <StatusIcon
                    status={item.status === "completed"}
                  />
                </td>
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
    gap: "10px",
    maxWidth: "400px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#14b8a6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  desc: {
    maxWidth: "400px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  success: {
    color: "green",
    marginBottom: "10px",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};