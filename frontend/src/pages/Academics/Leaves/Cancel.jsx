import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";
import StatusIcon from "../../../components/StatusIcon";

export default function LeaveCancel() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ SAFE USER
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user");
  }

  // =========================
  // 📄 FETCH LEAVES (FIXED)
  // =========================
  const fetchLeaves = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await API.get(`/academics/leaves/user/${user.id}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // ✅ dependency added

  // =========================
  // 🔄 USE EFFECT
  // =========================
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]); // ✅ no warning now

  // =========================
  // ❌ CANCEL
  // =========================
  const handleCancel = async (id) => {
    try {
      await API.delete(`/academics/leaves/${id}`);
      setMessage("❌ Leave canceled successfully");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to cancel leave");
    }
  };

  // 🚫 NOT LOGGED IN
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>❌ Cancel Leave</h2>

      {message && <p style={styles.message}>{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No leave records
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.from_date || "-"}</td>
                  <td>{item.to_date || "-"}</td>
                  <td>{item.reason || "-"}</td>

                  <td>
                    <StatusIcon status={item.status === "approved"} />
                  </td>

                  <td>
                    {item.status === "pending" ? (
                      <button
                        onClick={() => handleCancel(item.id)}
                        style={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span style={{ color: "#777" }}>Not Allowed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    padding: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  cancelBtn: {
    padding: "6px 12px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};