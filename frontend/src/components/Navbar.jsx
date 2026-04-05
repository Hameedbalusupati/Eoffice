import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
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
  // 🚪 LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // ✅ FIXED
  };

  // =========================
  // 🎯 ACTIVE LINK (IMPROVED)
  // =========================
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active-link" : "";
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="navbar-logo">
        <h2>E-Office</h2>
      </div>

      {/* LINKS */}
      {isLoggedIn && (
        <ul className="navbar-links">
          <li>
            <Link to="/academics/manage" className={isActive("/academics")}>
              Academics
            </Link>
          </li>

          <li>
            <Link
              to="/placements/student-performance"
              className={isActive("/placements")}
            >
              Placements
            </Link>
          </li>

          <li>
            <Link to="/library" className={isActive("/library")}>
              Library
            </Link>
          </li>
        </ul>
      )}

      {/* RIGHT SIDE */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <span className="user-name">
              👤 {user?.name || user?.email || "User"}
            </span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}