import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function Greetings() {
  const [form, setForm] = useState({
    name: "",
    type: "birthday",
    message: "",
  });

  const [data, setData] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
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
  // 📄 FETCH GREETINGS (FIXED)
  // =========================
  const fetchGreetings = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await API.get(
        `/correspondence/greetings/${user.id}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // =========================
  // 🔁 USE EFFECT (FIXED)
  // =========================
  useEffect(() => {
    fetchGreetings();
  }, [fetchGreetings]);

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // 🚀 SEND GREETING
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.message) {
      setIsError(true);
      setStatusMsg("❌ All fields are required");
      return;
    }

    if (!user?.id) {
      setIsError(true);
      setStatusMsg("❌ User not logged in");
      return;
    }

    try {
      const description = `Name: ${form.name}, Type: ${form.type}, Message: ${form.message}`;

      await API.post("/correspondence/greeting", {
        sender_id: user.id,
        name: form.name,
        type: form.type,
        message: form.message,
        description,
      });

      setIsError(false);
      setStatusMsg("🎉 Greeting sent successfully!");

      // reset form
      setForm({
        name: "",
        type: "birthday",
        message: "",
      });

      // refresh
      fetchGreetings();

    } catch (err) {
      console.error("Greeting error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Failed to send greeting";

      setIsError(true);
      setStatusMsg(errorMsg);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>🎉 Greetings</h2>

      {statusMsg && (
        <p
          style={{
            ...styles.message,
            color: isError ? "red" : "green",
          }}
        >
          {statusMsg}
        </p>
      )}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Recipient Name"
          value={form.name}
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
          <option value="birthday">Birthday 🎂</option>
          <option value="festival">Festival 🎊</option>
          <option value="congratulations">Congratulations 🎉</option>
        </select>

        <textarea
          name="message"
          placeholder="Enter greeting message..."
          value={form.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Send Greeting
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading greetings...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No greetings sent
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td style={styles.desc}>{item.message}</td>
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
  },
};