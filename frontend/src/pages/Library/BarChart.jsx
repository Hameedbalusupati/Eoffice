import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function BarCharts() {
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/library/chart-data");

      const data = res.data || {};

      // 🔥 safe handling
      setCategoryData(
        Array.isArray(data.category) ? data.category : []
      );

      setStatusData(
        Array.isArray(data.status) ? data.status : []
      );
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={styles.container}>
      <h2>📊 Library Dashboard</h2>

      {/* STATUS */}
      {loading && <p>⏳ Loading charts...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* ================= CATEGORY CHART ================= */}
      {!loading && !error && (
        <>
          <div style={styles.chartBox}>
            <h3>📚 Books by Category</h3>

            {categoryData.length === 0 ? (
              <p>No category data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ================= STATUS CHART ================= */}
          <div style={styles.chartBox}>
            <h3>📊 Book Status</h3>

            {statusData.length === 0 ? (
              <p>No status data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 🔄 Refresh Button */}
          <button onClick={fetchData} style={styles.button}>
            Refresh Data
          </button>
        </>
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

  chartBox: {
    marginBottom: "40px",
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "10px",
  },

  button: {
    padding: "8px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
  },
};