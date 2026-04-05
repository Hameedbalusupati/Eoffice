import { useEffect, useState } from "react";
import API from "../../../services/api"; // ✅ FIX
import StatusIcon from "../../../components/StatusIcon";

export default function Manage() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ SAFE USER FETCH
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    console.error("Invalid user in localStorage");
  }

  // =========================
  // 🔄 FETCH DATA
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const res = await API.get(`/academics/faculty/${user.id}`);
        setData(res.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  // =========================
  // ❌ DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/academics/delete/${id}`);

      setMessage("❌ Deleted successfully");

      // 🔄 Refresh
      const res = await API.get(`/academics/faculty/${user?.id}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // =========================
  // ✏️ UPDATE
  // =========================
  const handleUpdate = async (item) => {
    const newDesc = prompt("Enter new description", item.description);

    if (!newDesc) return;

    try {
      await API.put(`/academics/update/${item.id}`, {
        description: newDesc,
        subject: item.subject,
        class_name: item.class_name,
      });

      setMessage("✅ Updated successfully");

      // 🔄 Refresh
      const res = await API.get(`/academics/faculty/${user?.id}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // =========================
  // 🚫 NOT LOGGED IN
  // =========================
  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>📋 Manage Assignments</h2>

      {message && <p style={styles.message}>{message}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Class</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.subject || "-"}</td>
                <td>{item.class_name || "-"}</td>
                <td>{item.description || "-"}</td>

                <td>
                  <StatusIcon status={item.status === "completed"} />
                </td>

                <td>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleUpdate(item)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
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

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },

  editBtn: {
    padding: "5px 10px",
    marginRight: "5px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "5px 10px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};