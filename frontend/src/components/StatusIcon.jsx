import "./StatusIcon.css";

export default function StatusIcon({ status }) {
  // =========================
  // 🔄 NORMALIZE STATUS
  // =========================
  const normalizeStatus = () => {
    if (status === true || status === "approved" || status === "active" || status === "open") {
      return "success";
    }

    if (status === false || status === "rejected" || status === "closed") {
      return "error";
    }

    return "pending";
  };

  const state = normalizeStatus();

  // =========================
  // 🎨 CONFIG
  // =========================
  const config = {
    success: {
      icon: "✔️",
      label: "Success",
      className: "completed",
    },
    error: {
      icon: "❌",
      label: "Failed",
      className: "error",
    },
    pending: {
      icon: "⏳",
      label: "Pending",
      className: "pending",
    },
  };

  const { icon, label, className } = config[state];

  return (
    <span
      className={`status-icon ${className}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </span>
  );
}