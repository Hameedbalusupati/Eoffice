import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import API from "../services/api"; ❌ TEMP DISABLE

export default function Dashboard() {
  const navigate = useNavigate();

  // STATES
  const [faculty, setFaculty] = useState({ email: "", password: "" });
  const [student, setStudent] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleFacultyChange = (e) => {
    setFaculty({ ...faculty, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // =========================
  // LOGIN FUNCTION (SAFE)
  // =========================
  const login = async (credentials, role) => {
    if (!credentials.email || !credentials.password) {
      alert("Email and Password required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔥 TEMP MOCK LOGIN (REMOVE API ERROR)
      const fakeUser = {
        email: credentials.email,
        role: role,
        name: "Demo User",
      };

      localStorage.setItem("user", JSON.stringify(fakeUser));

      // NAVIGATION
      if (role === "faculty") {
        navigate("/academics/manage");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PACE Institute Dashboard</h1>

      <div style={styles.cards}>
        {/* FACULTY */}
        <div style={styles.card}>
          <h2>👨‍🏫 Faculty Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={faculty.email}
            onChange={handleFacultyChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={faculty.password}
            onChange={handleFacultyChange}
            style={styles.input}
          />

          <button
            style={styles.button}
            onClick={() => login(faculty, "faculty")}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>

        {/* STUDENT */}
        <div style={styles.card}>
          <h2>🎓 Student Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={handleStudentChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={student.password}
            onChange={handleStudentChange}
            style={styles.input}
          />

          <button
            style={styles.button}
            onClick={() => login(student, "student")}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "30px",
    color: "#1e3a8a",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
  },

  card: {
    width: "300px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginTop: "15px",
  },
};