import { useState } from "react";
import API from "../../../services/api";

export default function InternshipEntry() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    stipend: "",
    deadline: "",
    open: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📝 HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // 🚀 SUBMIT (FIXED)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ✅ Basic validation
    if (!form.company || !form.role) {
      setError("Company and Role are required!");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Convert stipend to number
      const payload = {
        ...form,
        stipend: form.stipend ? Number(form.stipend) : 0,
      };

      await API.post(
        "/placements/internship/create",
        payload
      );

      alert("Internship added successfully!");

      // ✅ Reset form
      setForm({
        company: "",
        role: "",
        location: "",
        stipend: "",
        deadline: "",
        open: true,
      });
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to add internship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>➕ Add Internship</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* COMPANY */}
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          style={styles.input}
        />

        {/* ROLE */}
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          style={styles.input}
        />

        {/* LOCATION */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={styles.input}
        />

        {/* STIPEND */}
        <input
          type="number"
          name="stipend"
          placeholder="Stipend"
          value={form.stipend}
          onChange={handleChange}
          style={styles.input}
        />

        {/* DEADLINE */}
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          style={styles.input}
        />

        {/* STATUS */}
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            name="open"
            checked={form.open}
            onChange={handleChange}
          />
          Open for Applications
        </label>

        {/* ERROR */}
        {error && <p style={styles.error}>{error}</p>}

        {/* SUBMIT */}
        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "auto",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "14px",
  },
};