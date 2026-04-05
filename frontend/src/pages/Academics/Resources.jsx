import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function Resources() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    class_name: "",
    link: "",
    description: "",
  });

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user");
  }

  // =========================
  // 📄 FETCH RESOURCES
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/academics/resources/${user.id}`);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load resources");
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
  // 🚀 ADD RESOURCE
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
Link: ${form.link}

Details:
${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "resources",
        subject: form.title,
        class_name: form.class_name,
        description,
        status: "completed",
      });

      setMessage("📚 Resource added successfully!");

      setForm({
        title: "",
        subject: "",
        class_name: "",
        link: "",
        description: "",
      });

      fetchData(); // 🔄 refresh
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add resource");
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
      <h2>📚 Resources</h2>

      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Resource Title"
          value={form.title}
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
          type="url"
          name="link"
          placeholder="Resource Link"
          value={form.link}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Resource"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No resources found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Class</th>
              <th>Description</th>
              <th>Link</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {
              const desc = item.description || "";

              const linkMatch = desc.match(/Link:\s*(.*)/);
              const link = linkMatch ? linkMatch[1].trim() : "#";

              return (
                <tr key={item.id}>
                  <td>{item.subject || "-"}</td>
                  <td>{item.class_name || "-"}</td>

                  <td style={styles.desc}>{desc}</td>

                  <td>
                    <a href={link} target="_blank" rel="noreferrer">
                      🔗 Open
                    </a>
                  </td>

                  <td>
                    <StatusIcon
                      status={item.status === "completed"}
                    />
                  </td>
                </tr>
              );
            })}
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
    maxWidth: "450px",
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
    backgroundColor: "#0891b2",
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
    maxWidth: "300px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
    color: "green",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },
};