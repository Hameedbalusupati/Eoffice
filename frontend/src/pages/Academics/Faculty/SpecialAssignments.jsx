import { useState } from "react";
import API from "../../../services/api"; // ✅ FIX

export default function SpecialAssignments() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    class_name: "",
    assigned_to: "",
    deadline: "",
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
Title: ${form.title}
Assigned To: ${form.assigned_to}
Deadline: ${form.deadline}

Details:
${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "special_assignments",
        subject: form.subject,
        class_name: form.class_name,
        description: description,
        status: "completed",
      });

      setMessage("📌 Special assignment created successfully!");

      setForm({
        title: "",
        subject: "",
        class_name: "",
        assigned_to: "",
        deadline: "",
        description: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to create assignment");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📌 Special Assignments</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Assignment Title"
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
          type="text"
          name="assigned_to"
          placeholder="Assigned To (Student / Group)"
          value={form.assigned_to}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Assignment Details"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Create Assignment
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
    maxWidth: "450px",
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
    backgroundColor: "#14b8a6",
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