import { useState } from "react";
import API from "../../../../services/api"; // ✅ FIX

export default function PostConversation() {
  const [form, setForm] = useState({
    student_name: "",
    roll_number: "",
    class_name: "",
    date: "",
    issue: "",
    discussion: "",
    action_taken: "",
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
Student: ${form.student_name} (${form.roll_number})
Class: ${form.class_name}

Issue: ${form.issue}

Discussion: ${form.discussion}

Action Taken: ${form.action_taken}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "counseling",
        subject: form.student_name,
        class_name: form.class_name,
        description: description,
      });

      setMessage("✅ Counseling record submitted successfully!");

      setForm({
        student_name: "",
        roll_number: "",
        class_name: "",
        date: "",
        issue: "",
        discussion: "",
        action_taken: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to submit counseling record");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>🗣️ Post Counseling Conversation</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="student_name"
          placeholder="Student Name"
          value={form.student_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="roll_number"
          placeholder="Roll Number"
          value={form.roll_number}
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

        <textarea
          name="issue"
          placeholder="Issue / Problem"
          value={form.issue}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <textarea
          name="discussion"
          placeholder="Discussion Details"
          value={form.discussion}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <textarea
          name="action_taken"
          placeholder="Action Taken"
          value={form.action_taken}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit Conversation
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
    backgroundColor: "#16a34a",
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