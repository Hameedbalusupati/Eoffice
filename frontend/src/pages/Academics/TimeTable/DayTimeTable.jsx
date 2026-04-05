import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";

export default function DayTimeTable() {
  const [form, setForm] = useState({
    day: "",
    subject: "",
    class_name: "",
    start_time: "",
    end_time: "",
  });

  const [data, setData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user");
  }

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // 📄 FETCH TIMETABLE
  // =========================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await API.get(`/academics/timetable/${user.id}`);

      setData(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🚀 ADD TIMETABLE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage("❌ Please login first");
      return;
    }

    try {
      await API.post("/academics/timetable", {
        faculty_id: user.id,
        ...form,
      });

      setMessage("✅ Timetable added successfully!");

      setForm({
        day: "",
        subject: "",
        class_name: "",
        start_time: "",
        end_time: "",
      });

      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add timetable");
    }
  };

  // =========================
  // 📊 FILTER
  // =========================
  const filteredData = selectedDay
    ? data.filter((item) => item.day === selectedDay)
    : data;

  // =========================
  // UI
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📅 Day Timetable</h2>

      {message && <p style={styles.message}>{message}</p>}

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          name="day"
          value={form.day}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Day</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>

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
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Timetable
        </button>
      </form>

      {/* FILTER */}
      <div style={{ marginBottom: "15px" }}>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          style={styles.input}
        >
          <option value="">All Days</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No timetable found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.day || "-"}</td>
                <td>{item.subject || "-"}</td>
                <td>{item.class_name || "-"}</td>
                <td>
                  {item.start_time} - {item.end_time}
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
    borderRadius: "5px",
    border: "1px solid #ccc",
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
    marginTop: "10px",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};