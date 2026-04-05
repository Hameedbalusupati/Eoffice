import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function Inbox() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Safe user parsing
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // =========================
  // 📄 FETCH MESSAGES (FIXED)
  // =========================
  const fetchInbox = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await API.get(
        `/correspondence/inbox/${user.id}`
      );
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // =========================
  // 🔁 USE EFFECT (FIXED)
  // =========================
  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  // =========================
  // 👁️ VIEW MESSAGE
  // =========================
  const handleView = async (msg) => {
    setSelected(msg);

    // mark as read
    try {
      await API.put(
        `/correspondence/inbox/read/${msg.id}`
      );

      // update UI instantly
      setData((prev) =>
        prev.map((item) =>
          item.id === msg.id ? { ...item, read: true } : item
        )
      );
    } catch (err) {
      console.error("Read update error:", err);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📥 Inbox</h2>

      <div style={styles.layout}>
        {/* ================= LIST ================= */}
        <div style={styles.list}>
          {loading ? (
            <p>Loading messages...</p>
          ) : data.length === 0 ? (
            <p>No messages</p>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.item,
                  backgroundColor: item.read ? "#fff" : "#e0f2fe",
                }}
                onClick={() => handleView(item)}
              >
                <h4>{item.title || item.type}</h4>

                <p style={styles.preview}>
                  {item.message
                    ? item.message.slice(0, 40) + "..."
                    : "No content"}
                </p>

                <div style={styles.meta}>
                  <span>{item.type}</span>
                  <StatusIcon status={item.read} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div style={styles.details}>
          {selected ? (
            <>
              <h3>{selected.title || selected.type}</h3>

              <p><b>Type:</b> {selected.type}</p>
              <p><b>From:</b> {selected.sender || "System"}</p>

              <div style={styles.messageBox}>
                {selected.message || "No message content"}
              </div>
            </>
          ) : (
            <p>Select a message to view</p>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: { padding: "20px" },

  layout: {
    display: "flex",
    gap: "20px",
  },

  list: {
    width: "35%",
    borderRight: "1px solid #ccc",
    paddingRight: "10px",
  },

  item: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
    transition: "0.2s",
  },

  preview: {
    fontSize: "12px",
    color: "#555",
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginTop: "5px",
  },

  details: {
    flex: 1,
    padding: "10px",
  },

  messageBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
};