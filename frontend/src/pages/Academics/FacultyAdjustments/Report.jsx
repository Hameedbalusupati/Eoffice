import { useEffect, useState } from "react";
import API from "../../../services/api"; // ✅ FIX

export default function FacultyAdjustmentEntry() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    date: "",
    time: "",
    replacement_faculty: "",
    signature: null,
    description: "",
  });

  const [freeFaculty, setFreeFaculty] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user");
  }

  // 🔄 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "signature") {
      setForm((prev) => ({ ...prev, signature: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔥 FETCH FREE FACULTY
  useEffect(() => {
    if (!form.date || !form.time) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await API.get(
          `/schedule/free-faculty?date=${form.date}&time=${form.time}`
        );

        if (!ignore) {
          setFreeFaculty(res.data || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [form.date, form.time]);

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage("❌ Please login first");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("faculty_id", user.id);
      formData.append("activity_name", "faculty_adjustments");
      formData.append("subject", form.subject);
      formData.append("class_name", form.class_name);
      formData.append("replacement_faculty", form.replacement_faculty);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("description", form.description);

      if (form.signature) {
        formData.append("signature", form.signature);
      }

      await API.post("/academics/adjustment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Faculty adjustment recorded successfully!");

      setForm({
        subject: "",
        class_name: "",
        date: "",
        time: "",
        replacement_faculty: "",
        signature: null,
        description: "",
      });

      setFreeFaculty([]);
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to record adjustment");
    }
  };

  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>🔄 Faculty Adjustment Entry</h2>

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
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="replacement_faculty"
          value={form.replacement_faculty}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Available Faculty</option>
          {freeFaculty.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="signature"
          accept="image/*"
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Reason for adjustment"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit Adjustment
        </button>
      </form>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: { padding: "20px" },

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
    backgroundColor: "#7c3aed",
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