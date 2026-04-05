import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function AdditionalWork() {
  const [form, setForm] = useState({
    title: "",
    type: "fdp",
    hours: "",
    date: "",
    description: "",
  });

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
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchWork = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await API.get(
        `/employee/additional-work/${user.id}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchWork();
  }, [fetchWork]);

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // 🚀 SUBMIT WORK
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.hours || !form.date) {
      setIsError(true);
      setMessage("❌ All required fields must be filled");
      return;
    }

    if (!user?.id) {
      setIsError(true);
      setMessage("❌ User not logged in");
      return;
    }

    try {
      await API.post("/employee/additional-work", {
        employee_id: user.id,
        title: form.title,
        type: form.type,
        hours: form.hours,
        date: form.date,
        description: form.description,
      });

      setIsError(false);
      setMessage("✅ Work added successfully!");

      // reset form
      setForm({
        title: "",
        type: "fdp",
        hours: "",
        date: "",
        description: "",
      });

      // refresh
      fetchWork();

    } catch (err) {
      console.error("Submit error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Failed to add work";

      setIsError(true);
      setMessage(errorMsg);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>🧑‍💼 Additional Work</h2>

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
          placeholder="Work Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="fdp">FDP</option>
          <option value="research">Research</option>
          <option value="admin">Admin Work</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          name="hours"
          placeholder="Hours"
          value={form.hours}
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
          placeholder="Description..."
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Work
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading records...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No records found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.title || "—"}</td>
                  <td>{item.type || "—"}</td>
                  <td>{item.hours || "—"}</td>
                  <td>{item.date || "—"}</td>

                  <td>
                    <StatusIcon status={true} />
                    <span style={{ marginLeft: "6px" }}>
                      Completed
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

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};