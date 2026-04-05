import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function MarksAttendance() {
  const [form, setForm] = useState({
    roll_no: "",
    subject: "",
    marks: "",
    exam_name: "",
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
  // 📄 FETCH DATA
  // =========================
  const fetchMarks = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await API.get(
        `/correspondence/sms/marks-attendance/${user.id}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

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

    if (!form.roll_no || !form.subject || !form.marks || !form.exam_name) {
      setIsError(true);
      setMessage("❌ All fields are required");
      return;
    }

    if (!user?.id) {
      setIsError(true);
      setMessage("❌ User not logged in");
      return;
    }

    try {
      const description = `Roll No: ${form.roll_no}, Subject: ${form.subject}, Marks: ${form.marks}, Exam: ${form.exam_name}`;

      await API.post(
        "/correspondence/sms/send-marks-attendance",
        {
          faculty_id: user.id,
          roll_no: form.roll_no,
          subject: form.subject,
          marks: form.marks,
          exam_name: form.exam_name,
          description,
        }
      );

      setIsError(false);
      setMessage("📊 Marks SMS sent successfully!");

      // reset form
      setForm({
        roll_no: "",
        subject: "",
        marks: "",
        exam_name: "",
      });

      // refresh
      fetchMarks();

    } catch (err) {
      console.error("SMS error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Failed to send SMS";

      setIsError(true);
      setMessage(errorMsg);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📊 Marks SMS</h2>

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
          name="roll_no"
          placeholder="Student Roll No"
          value={form.roll_no}
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
          type="number"
          name="marks"
          placeholder="Marks"
          value={form.marks}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="exam_name"
          placeholder="Exam Name"
          value={form.exam_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Send SMS
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading records...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Exam</th>
              <th>Description</th>
              <th>Sent</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  No records found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.roll_no}</td>
                  <td>{item.subject}</td>
                  <td>{item.marks}</td>
                  <td>{item.exam_name}</td>
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

  button: {
    padding: "10px",
    backgroundColor: "#16a34a",
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