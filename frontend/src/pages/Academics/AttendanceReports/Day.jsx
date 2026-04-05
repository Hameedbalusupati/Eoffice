import { useState } from "react";
import API from "../../../../services/api"; // ✅ FIX

export default function DayAttendance() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    date: "",
    present_count: "",
    absent_count: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  // ✅ SAFE USER FETCH
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user in localStorage");
  }

  // 🔄 HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage("❌ Please login first");
      return;
    }

    try {
      const description = `
Date: ${form.date}
Present: ${form.present_count}
Absent: ${form.absent_count}
Notes: ${form.notes}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "attendance_reports",
        subject: form.subject,
        class_name: form.class_name,
        description: description,
      });

      setMessage("✅ Day attendance submitted successfully!");

      setForm({
        subject: "",
        class_name: "",
        date: "",
        present_count: "",
        absent_count: "",
        notes: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to submit attendance");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📅 Daily Attendance</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
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
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="present_count"
          placeholder="Number of Present Students"
          value={form.present_count}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="absent_count"
          placeholder="Number of Absent Students"
          value={form.absent_count}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={form.notes}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit Attendance
        </button>
      </form>
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
    gap: "15px",
    maxWidth: "400px",
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
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};