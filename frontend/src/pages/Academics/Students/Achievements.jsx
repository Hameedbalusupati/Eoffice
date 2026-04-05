import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function StudentAchievements() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    description: "",
  });

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user data");
  }

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // 📄 FETCH ACHIEVEMENTS
  // =========================
  const fetchAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await API.get(`/academics/faculty/${user.id}`);

      // 👉 filter only achievements (stored as projects or achievements)
      const achievements =
        res.data?.filter(
          (item) =>
            item.activity_name === "projects" ||
            item.activity_name === "achievements"
        ) || [];

      setData(achievements);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // =========================
  // 🚀 ADD ACHIEVEMENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage("❌ Please login first");
      return;
    }

    if (!form.title || !form.category) {
      setMessage("❌ Fill required fields");
      return;
    }

    try {
      const description = `
Category: ${form.category}
Date: ${form.date}

Details:
${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "achievements",
        subject: form.title,
        class_name: "N/A",
        description,
        status: "completed",
      });

      setMessage("🏆 Achievement added successfully!");

      setForm({
        title: "",
        category: "",
        date: "",
        description: "",
      });

      fetchAchievements(); // refresh
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add achievement");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>🏆 Student Achievements</h2>

      {/* MESSAGE */}
      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Achievement Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="category"
          placeholder="Category (Award, Certificate, etc.)"
          value={form.category}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Achievement
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.noData}>
                  No achievements found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.subject || "-"}</td>

                  <td style={styles.desc}>
                    {item.description || "-"}
                  </td>

                  <td>
                    <StatusIcon status={true} />
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
  container: {
    padding: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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
    backgroundColor: "#f59e0b",
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
    color: "#777",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};