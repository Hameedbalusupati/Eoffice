import { useState } from "react";
import API from "../../../services/api"; // ✅ FIX

export default function SetPaper() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    exam_type: "",
    paper_title: "",
    max_marks: "",
    duration: "",
    date: "",
    pattern: "",
    description: "",
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

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❗ LOGIN CHECK
    if (!user?.id) {
      setMessage("❌ Please login first");
      return;
    }

    try {
      const description = `
Paper Title: ${form.paper_title}
Exam Type: ${form.exam_type}
Max Marks: ${form.max_marks}
Duration: ${form.duration}
Date: ${form.date}

Pattern:
${form.pattern}

Details:
${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "question_paper",
        subject: form.subject,
        class_name: form.class_name,
        description: description,
        status: "completed",
      });

      setMessage("📝 Question paper created successfully!");

      setForm({
        subject: "",
        class_name: "",
        exam_type: "",
        paper_title: "",
        max_marks: "",
        duration: "",
        date: "",
        pattern: "",
        description: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to create paper");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📝 Set Question Paper</h2>

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

        <select
          name="exam_type"
          value={form.exam_type}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Exam Type</option>
          <option value="internal">Internal</option>
          <option value="mid">Mid Exam</option>
          <option value="semester">Semester</option>
        </select>

        <input
          type="text"
          name="paper_title"
          placeholder="Paper Title"
          value={form.paper_title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="max_marks"
          placeholder="Max Marks"
          value={form.max_marks}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 3 Hours)"
          value={form.duration}
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
          name="pattern"
          placeholder="Question Paper Pattern"
          value={form.pattern}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <textarea
          name="description"
          placeholder="Additional Notes"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit Paper
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
    maxWidth: "500px",
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
    backgroundColor: "#ef4444",
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