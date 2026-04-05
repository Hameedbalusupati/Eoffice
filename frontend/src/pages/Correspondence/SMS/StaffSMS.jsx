import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function StaffSMS() {
  const [form, setForm] = useState({
    staff_id: "",
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
  // 📄 FETCH HISTORY
  // =========================
  const fetchStaffSMS = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await API.get(
        `/correspondence/sms/staff/${user.id}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStaffSMS();
  }, [fetchStaffSMS]);

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // 🚀 SEND SMS
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.staff_id || !form.message) {
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
      const description = `Staff ID: ${form.staff_id}, Message: ${form.message}`;

      await API.post(
        "/correspondence/sms/send-staff",
        {
          faculty_id: user.id,
          staff_id: form.staff_id,
          message: form.message,
          description,
        }
      );

      setIsError(false);
      setStatusMsg("📩 SMS sent to staff successfully!");

      // reset form
      setForm({
        staff_id: "",
        message: "",
      });

      // refresh
      fetchStaffSMS();

    } catch (err) {
      console.error("SMS error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Failed to send SMS";

      setIsError(true);
      setStatusMsg(errorMsg);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>👨‍🏫 Staff SMS</h2>

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
          name="staff_id"
          placeholder="Staff ID"
          value={form.staff_id}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="message"
          placeholder="Enter message..."
          value={form.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Send SMS
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Message</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No messages found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.staff_id}</td>
                  <td style={styles.desc}>{item.message}</td>
                  <td style={styles.desc}>{item.description}</td>
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
    backgroundColor: "#7c3aed",
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