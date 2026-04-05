import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api"; // ✅ use your API

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "faculty",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // 🚀 LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ basic validation
    if (!form.email || !form.password) {
      setIsError(true);
      setMessage("❌ Please enter email and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", form);

      const user = res.data;

      if (!user) {
        throw new Error("Invalid response");
      }

      // 💾 Save user safely
      localStorage.setItem("user", JSON.stringify(user));

      setIsError(false);
      setMessage("✅ Login successful!");

      // 🔁 Redirect based on role
      if (user.role === "faculty") {
        navigate("/dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Invalid credentials";

      setIsError(true);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Login</h2>

        {message && (
          <p
            style={{
              ...styles.message,
              color: isError ? "red" : "green",
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f3f4f6",
  },

  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold",
  },
};