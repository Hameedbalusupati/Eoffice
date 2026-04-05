import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // 🔐 SAFE USER
  // =========================
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isLoggedIn = user?.access_token || user?.token;

  // =========================
  // 📂 MENU (FIXED ROUTES)
  // =========================
  const menuItems = [
    { name: "Academics", path: "/academics/manage" },
    { name: "Assignments", path: "/academics/assign" },
    { name: "Reports", path: "/academics/report" },
    { name: "Placements", path: "/placements/student-performance" },
    { name: "Library", path: "/library" }, // add route later
  ];

  // =========================
  // 🎯 ACTIVE LINK
  // =========================
  const isActive = (path) => {
    return location.pathname.startsWith(path)
      ? "active-sidebar"
      : "";
  };

  // =========================
  // 🚫 HIDE IF NOT LOGGED IN
  // =========================
  if (!isLoggedIn) return null;

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">📂 Modules</h2>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`sidebar-item ${isActive(item.path)}`}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}