import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// COMPONENTS
import Navbar from "./components/Navbar";

// 🌐 PAGES
import Dashboard from "./pages/Dashboard";

// Academics
import Assign from "./pages/Academics/Assignments/Assign";
import Manage from "./pages/Academics/Assignments/Manage";
import Report from "./pages/Academics/Assignments/Report";

// Placements
import StudentPerformance from "./pages/placements/StudentPerformance";

// =========================
// 🔐 SAFE USER FUNCTION
// =========================
const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch {
    return null;
  }
};

// =========================
// 🔐 PROTECTED ROUTE
// =========================
const ProtectedRoute = ({ children }) => {
  const user = getUser();

  // check token properly
  if (!user?.access_token && !user?.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// =========================
// 🚀 APP
// =========================
function App() {
  const location = useLocation();
  const user = getUser();

  // hide navbar on login page
  const hideNavbar = location.pathname === "/" && !user;

  return (
    <>
      {/* ✅ Navbar (conditional) */}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* HOME (LOGIN) */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/academics/manage" />
            ) : (
              <Dashboard />
            )
          }
        />

        {/* ================= ACADEMICS ================= */}
        <Route
          path="/academics/assign"
          element={
            <ProtectedRoute>
              <Assign />
            </ProtectedRoute>
          }
        />

        <Route
          path="/academics/manage"
          element={
            <ProtectedRoute>
              <Manage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/academics/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

        {/* ================= PLACEMENTS ================= */}
        <Route
          path="/placements/student-performance"
          element={
            <ProtectedRoute>
              <StudentPerformance />
            </ProtectedRoute>
          }
        />

        {/* ================= DEFAULT ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;