import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api"; // ✅ use your API

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
  // 🚀 REGISTER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validations
    if (!form.name || !form.email || !form.password) {
      setIsError(true);
      setMessage("❌ All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setIsError(true);
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setIsError(true);
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setIsError(false);
      setMessage("✅ Registration successful! Redirecting...");

      // redirect after delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Register error:", err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Registration failed (email may exist)";

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
        <h2>📝 Register</h2>

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
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
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
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold",
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
  },
};