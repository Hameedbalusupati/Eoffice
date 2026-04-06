import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // 🔐 SAFE USER STATE (NO useEffect)
  // =========================
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser || storedUser === "undefined") {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User parse error:", error);
      return null;
    }
  });

  const isLoggedIn = !!user;

  // =========================
  // 🚪 LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // =========================
  // 🎯 ACTIVE LINK
  // =========================
  const isActive = (path) =>
    location.pathname.startsWith(path) ? "active-link" : "";

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
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
          <button className="login-btn" onClick={() => navigate("/")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}