import { useEffect, useState } from "react";
import API from "../../../services/api"; // ✅ USE THIS
import StatusIcon from "../../../components/StatusIcon";

export default function LeaveAccept() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // 📄 FETCH LEAVES
  // =========================
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get("/academics/leaves");
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // =========================
  // ✅ ACCEPT
  // =========================
  const handleAccept = async (id) => {
    try {
      await API.put(`/academics/leaves/${id}/accept`);
      setMessage("✅ Leave accepted successfully");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to accept leave");
    }
  };

  // =========================
  // ❌ REJECT
  // =========================
  const handleReject = async (id) => {
    try {
      await API.put(`/academics/leaves/${id}/reject`);
      setMessage("❌ Leave rejected");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to reject leave");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📄 Leave Approval</h2>

      {/* 🔔 MESSAGE */}
      {message && <p style={styles.message}>{message}</p>}

      {/* 🔄 LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Faculty</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  No leave requests
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.faculty_name || "-"}</td>
                  <td>{item.from_date || "-"}</td>
                  <td>{item.to_date || "-"}</td>
                  <td>{item.reason || "-"}</td>

                  <td>
                    <StatusIcon status={item.status === "approved"} />
                  </td>

                  <td>
                    {item.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleAccept(item.id)}
                          style={styles.acceptBtn}
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => handleReject(item.id)}
                          style={styles.rejectBtn}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>-</span>
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

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    padding: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  acceptBtn: {
    marginRight: "5px",
    padding: "6px 12px",
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  rejectBtn: {
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