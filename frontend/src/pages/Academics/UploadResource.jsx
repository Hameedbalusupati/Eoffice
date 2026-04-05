import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function UploadResources() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    class_name: "",
    link: "",
  });

  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Safe user parsing
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // =========================
  // 📄 FETCH RESOURCES (FIXED)
  // =========================
  const fetchResources = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await API.get(
        `/academics/upload-resources/${user.id}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // ✅ dependency added

  // =========================
  // 🔁 USE EFFECT (FIXED)
  // =========================
  useEffect(() => {
    fetchResources();
  }, [fetchResources]); // ✅ no warning now

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // 📁 HANDLE FILE
  // =========================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // =========================
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setIsError(true);
      setMessage("❌ User not logged in");
      return;
    }

    if (!form.title || !form.subject || !form.class_name) {
      setIsError(true);
      setMessage("❌ All required fields must be filled");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("faculty_id", user.id);
      formData.append("title", form.title);
      formData.append("subject", form.subject);
      formData.append("class_name", form.class_name);
      formData.append("link", form.link);

      if (file) {
        formData.append("file", file);
      }

      await API.post("/academics/upload-resource", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsError(false);
      setMessage("✅ Resource uploaded successfully!");

      // reset form
      setForm({
        title: "",
        subject: "",
        class_name: "",
        link: "",
      });
      setFile(null);

      // refresh
      fetchResources();

    } catch (err) {
      console.error("Upload error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Upload failed";

      setIsError(true);
      setMessage(errorMsg);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📁 Upload Resources</h2>

      {message && (
        <p
          style={{
            ...styles.message,
            color: isError ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
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
          placeholder="Optional Link"
          value={form.link}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="file"
          onChange={handleFileChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Upload
        </button>
      </form>

      {/* TABLE */}
      {loading ? (
        <p>Loading resources...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Class</th>
              <th>File</th>
              <th>Link</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  No resources uploaded
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.subject}</td>
                  <td>{item.class_name}</td>

                  <td>
                    {item.file_url ? (
                      <a href={item.file_url} target="_blank" rel="noreferrer">
                        📄 View
                      </a>
                    ) : "—"}
                  </td>

                  <td>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        🔗 Open
                      </a>
                    ) : "—"}
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
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};