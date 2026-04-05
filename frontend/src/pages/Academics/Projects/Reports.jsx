import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function ProjectsReport() {
  const [form, setForm] = useState({
    title: "",
    class_name: "",
    guide: "",
    team: "",
    status: "ongoing",
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
  // 📄 FETCH PROJECTS
  // =========================
  const fetchProjects = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await API.get(`/academics/projects/${user.id}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // =========================
  // 🚀 ADD PROJECT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage("❌ Please login first");
      return;
    }

    if (!form.title || !form.class_name) {
      setMessage("❌ Please fill required fields");
      return;
    }

    try {
      const description = `
Guide: ${form.guide}
Team: ${form.team}
Status: ${form.status}

Details:
${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "projects",
        subject: form.title,
        class_name: form.class_name,
        description,
        status: form.status === "completed" ? "completed" : "pending",
      });

      setMessage("✅ Project added successfully!");

      setForm({
        title: "",
        class_name: "",
        guide: "",
        team: "",
        status: "ongoing",
        description: "",
      });

      fetchProjects(); // refresh
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add project");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📊 Projects Report</h2>

      {/* MESSAGE */}
      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={form.title}
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
          name="guide"
          placeholder="Guide Name"
          value={form.guide}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="team"
          placeholder="Team Members"
          value={form.team}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Project
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
              <th>Class</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No projects found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.subject || "-"}</td>
                  <td>{item.class_name || "-"}</td>
                  <td style={styles.desc}>
                    {item.description || "-"}
                  </td>
                  <td>
                    <StatusIcon status={item.status === "completed"} />
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

// 🎨 STYLES
const styles = {
  container: {
    padding: "20px",
  },

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
    backgroundColor: "#0284c7",
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