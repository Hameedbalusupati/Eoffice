import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get user from localStorage safely
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <h2>E-Office</h2>
      </div>

      {/* Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/academics" className={isActive("/academics")}>
            Academics
          </Link>
        </li>

        <li>
          <Link to="/placements" className={isActive("/placements")}>
            Placements
          </Link>
        </li>

        <li>
          <Link to="/library" className={isActive("/library")}>
            Library
          </Link>
        </li>
      </ul>

      {/* Right */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-name">
              👤 {user?.name || "Faculty"}
            </span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}