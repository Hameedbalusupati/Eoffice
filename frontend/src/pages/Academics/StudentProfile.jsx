import { useState } from "react";
import API from "../../services/api";

export default function StudentProfile() {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 🔍 SEARCH STUDENT
  // =========================
  const handleSearch = async () => {
    if (!rollNo.trim()) {
      setMessage("❌ Please enter roll number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setStudent(null);

      const res = await API.get(
        `/academics/student/${rollNo}`
      );

      setStudent(res.data || null);

      if (!res.data) {
        setMessage("❌ Student not found");
      }
    } catch (err) {
      console.error(err);
      setStudent(null);
      setMessage("❌ Student not found");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ⌨️ ENTER KEY SEARCH
  // =========================
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={styles.container}>
      <h2>👨‍🎓 Student Profile</h2>

      {/* ================= SEARCH ================= */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
        />

        <button
          onClick={handleSearch}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* MESSAGE */}
      {message && <p style={styles.message}>{message}</p>}

      {/* ================= PROFILE CARD ================= */}
      {student && (
        <div style={styles.card}>
          <h3>{student.name || "N/A"}</h3>

          <p><b>Roll No:</b> {student.roll_no || "-"}</p>
          <p><b>Class:</b> {student.class_name || "-"}</p>
          <p><b>Branch:</b> {student.branch || "-"}</p>
          <p><b>Email:</b> {student.email || "-"}</p>
          <p><b>Phone:</b> {student.phone || "-"}</p>
          <p><b>Address:</b> {student.address || "-"}</p>
          <p><b>Year:</b> {student.year || "-"}</p>
        </div>
      )}
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    padding: "20px",
  },

  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "250px",
  },

  button: {
    padding: "10px 15px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },

  card: {
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    border: "1px solid #ddd",
  },

  message: {
    color: "red",
    marginBottom: "10px",
  },
};