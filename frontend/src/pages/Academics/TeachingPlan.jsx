import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function TeachingPlan() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    topic: "",
    date: "",
    hours: "",
    description: "",
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
    console.error("Invalid user");
  }

  // =========================
  // 📄 FETCH TEACHING PLAN
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/academics/faculty/${user.id}`
      );

      // 🔥 filter teaching plan
      const plans = (res.data || []).filter(
        (item) => item.activity_name === "teaching_plan"
      );

      setData(plans);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load teaching plan");
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
Date: ${form.date}
Topic: ${form.topic}
Hours: ${form.hours}

Details:
${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "teaching_plan",
        subject: form.subject,
        class_name: form.class_name,
        description,
        status: "completed",
      });

      setMessage("📘 Teaching plan added successfully!");

      setForm({
        subject: "",
        class_name: "",
        topic: "",
        date: "",
        hours: "",
        description: "",
      });

      fetchData(); // 🔄 refresh
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add teaching plan");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  if (!user) return <h2>Please login</h2>;

  return (
    <div style={styles.container}>
      <h2>📘 Teaching Plan</h2>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
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
          type="text"
          name="topic"
          placeholder="Topic"
          value={form.topic}
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

        <input
          type="number"
          name="hours"
          placeholder="Hours"
          value={form.hours}
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
          {loading ? "Adding..." : "Add Plan"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No teaching plans found</p>
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
                <td>{item.subject}</td>
                <td>{item.class_name}</td>

                <td style={styles.desc}>{item.description}</td>

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

  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "80px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#2563eb",
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

  success: {
    color: "green",
    marginBottom: "10px",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};