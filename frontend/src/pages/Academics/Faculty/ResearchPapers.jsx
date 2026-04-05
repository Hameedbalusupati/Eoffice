import { useState } from "react";
import API from "../../../services/api"; // ✅ FIX

export default function ResearchPapers() {
  const [form, setForm] = useState({
    title: "",
    journal: "",
    authors: "",
    publication_date: "",
    doi: "",
    index_type: "",
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
Journal: ${form.journal}
Authors: ${form.authors}
Publication Date: ${form.publication_date}
DOI: ${form.doi}
Index: ${form.index_type}

Details: ${form.description}
      `;

      await API.post("/academics/create", {
        faculty_id: user.id,
        activity_name: "research_papers",
        subject: form.title,
        class_name: "N/A",
        description: description,
        status: "completed",
      });

      setMessage("📄 Research paper added successfully!");

      setForm({
        title: "",
        journal: "",
        authors: "",
        publication_date: "",
        doi: "",
        index_type: "",
        description: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to add research paper");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📄 Research Papers</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Paper Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="journal"
          placeholder="Journal / Conference"
          value={form.journal}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="authors"
          placeholder="Authors"
          value={form.authors}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="date"
          name="publication_date"
          value={form.publication_date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="doi"
          placeholder="DOI / Link"
          value={form.doi}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="index_type"
          value={form.index_type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Index Type</option>
          <option value="scopus">Scopus</option>
          <option value="web_of_science">Web of Science</option>
          <option value="ugc">UGC</option>
          <option value="other">Other</option>
        </select>

        <textarea
          name="description"
          placeholder="Additional Details"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Research Paper
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
    backgroundColor: "#0ea5e9",
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