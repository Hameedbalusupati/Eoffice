import { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../services/api";
import StatusIcon from "../../components/StatusIcon";

export default function LibraryCirculars() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📄 FETCH CIRCULARS (FIXED)
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/library/circulars");

      const circulars =
        res.data?.data || res.data?.circulars || res.data || [];

      setData(Array.isArray(circulars) ? circulars : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load circulars");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔍 FILTER (SAFE)
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      (item?.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // =========================
  // 👁️ VIEW + MARK READ (FIXED)
  // =========================
  const handleView = async (item) => {
    setSelected(item);

    try {
      await API.put(`/library/circular/read/${item?.id}`);

      setData((prev) =>
        prev.map((c) =>
          c?.id === item?.id ? { ...c, read: true } : c
        )
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📢 Library Circulars</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search circular..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* STATUS */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* MAIN LAYOUT */}
      {!loading && !error && (
        <div style={styles.layout}>
          {/* LIST */}
          <div style={styles.list}>
            {filteredData.length === 0 ? (
              <p>No circulars found</p>
            ) : (
              filteredData.map((item) => (
                <div
                  key={item?.id || Math.random()}
                  style={{
                    ...styles.item,
                    backgroundColor: item?.read
                      ? "#fff"
                      : "#e0f2fe",
                  }}
                  onClick={() => handleView(item)}
                >
                  <h4>{item?.title || "—"}</h4>

                  <p style={styles.preview}>
                    {(item?.message || "").slice(0, 40)}...
                  </p>

                  <div style={styles.meta}>
                    <span>
                      {item?.date
                        ? new Date(item.date).toLocaleDateString()
                        : "—"}
                    </span>

                    <StatusIcon status={item?.read} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DETAILS */}
          <div style={styles.details}>
            {selected ? (
              <>
                <h3>{selected?.title || "—"}</h3>

                <p>
                  <b>Date:</b>{" "}
                  {selected?.date
                    ? new Date(selected.date).toLocaleDateString()
                    : "—"}
                </p>

                <div style={styles.messageBox}>
                  {selected?.message || "No content"}
                </div>
              </>
            ) : (
              <p>Select a circular to view</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: { padding: "20px" },

  input: {
    padding: "8px",
    width: "300px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  layout: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  list: {
    width: "35%",
    minWidth: "250px",
    borderRight: "1px solid #ccc",
    paddingRight: "10px",
  },

  item: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
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

  error: {
    color: "red",
  },
};