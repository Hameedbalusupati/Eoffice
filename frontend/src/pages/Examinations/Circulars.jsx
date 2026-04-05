import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function ExaminationCirculars() {
  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // 📄 FETCH CIRCULARS
  // =========================
  const fetchCirculars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/examination/circulars");
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCirculars();
  }, [fetchCirculars]);

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // 🚀 CREATE CIRCULAR
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.message) {
      setIsError(true);
      setMessage("❌ All fields are required");
      return;
    }

    try {
      await API.post("/examination/circulars", {
        title: form.title,
        message: form.message,
      });

      setIsError(false);
      setMessage("✅ Circular created successfully!");

      // reset form
      setForm({
        title: "",
        message: "",
      });

      fetchCirculars();

    } catch (err) {
      console.error("Submit error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Failed to create circular";

      setIsError(true);
      setMessage(errorMsg);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📢 Examination Circulars</h2>

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

        <textarea
          name="message"
          placeholder="Enter circular message..."
          value={form.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Create Circular
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading circulars...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.noData}>
                  No circulars found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.title || "—"}</td>
                  <td style={styles.desc}>
                    {item.message || "—"}
                  </td>

                  <td>
                    <StatusIcon status={true} />
                    <span style={{ marginLeft: "6px" }}>
                      Active
                    </span>
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

  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "100px",
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
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};